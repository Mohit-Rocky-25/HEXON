"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FolderTree,
  FileCode,
  GitCommit,
  ExternalLink,
  Code2,
  AlertCircle,
  Loader2,
  Share2
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { FileTree } from "@/components/explorer/FileTree";
import { CodeViewer } from "@/components/ui/CodeViewer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RepositoryFile, IndexedSymbol } from "@repopilot/core";
import { extractSymbols } from "@repopilot/indexer";
import { Suspense } from "react";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialFilePath = searchParams.get("file");
  const initialLine = searchParams.get("line") ? parseInt(searchParams.get("line")!, 10) : undefined;

  const { currentRepo, files, setFiles, setIsImportModalOpen } = useRepository();

  const [selectedFile, setSelectedFile] = useState<RepositoryFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [symbols, setSymbols] = useState<IndexedSymbol[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingTree, setLoadingTree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightRange, setHighlightRange] = useState<[number, number] | undefined>(
    initialLine ? [initialLine, initialLine] : undefined
  );

  // If no files in context yet, fetch tree for current repo
  useEffect(() => {
    if (currentRepo && files.length === 0) {
      setLoadingTree(true);
      fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: currentRepo.url })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.tree) {
            setFiles(data.tree);
          }
        })
        .catch((e) => setError("Failed to load file tree."))
        .finally(() => setLoadingTree(false));
    }
  }, [currentRepo, files.length, setFiles]);

  // Set initial selected file if query parameter provided
  useEffect(() => {
    if (files.length > 0) {
      if (initialFilePath) {
        const found = files.find((f) => f.path === initialFilePath);
        if (found) setSelectedFile(found);
      } else if (!selectedFile) {
        // Default to README or first root file
        const readme = files.find((f) => f.path.toLowerCase().startsWith("readme"));
        setSelectedFile(readme || files.find((f) => f.type === "blob") || null);
      }
    }
  }, [files, initialFilePath]);

  // Load content whenever selectedFile changes
  useEffect(() => {
    if (!currentRepo || !selectedFile || selectedFile.type !== "blob") {
      setFileContent("");
      setSymbols([]);
      return;
    }

    if (selectedFile.isBinary) {
      setFileContent("(Binary file content cannot be displayed)");
      setSymbols([]);
      return;
    }

    setLoadingContent(true);
    setError(null);

    const sha = currentRepo.selectedRevision || "HEAD";
    const url = `/api/github/file?owner=${encodeURIComponent(
      currentRepo.owner
    )}&repo=${encodeURIComponent(currentRepo.repo)}&sha=${encodeURIComponent(
      sha
    )}&path=${encodeURIComponent(selectedFile.path)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.content !== undefined) {
          setFileContent(data.content);
          // Extract symbols client-side deterministically
          const extracted = extractSymbols(
            selectedFile.path,
            data.content,
            selectedFile.language
          );
          setSymbols(extracted);
        } else {
          setError(data.error || "Failed to load content.");
        }
      })
      .catch((err) => setError("Error loading file content."))
      .finally(() => setLoadingContent(false));
  }, [currentRepo, selectedFile]);

  const handleSymbolClick = (sym: IndexedSymbol) => {
    setHighlightRange([sym.startLine, sym.endLine]);
    const el = document.getElementById(`L${sym.startLine}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent mx-auto">
          <FolderTree className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-console-text">
            No Repository Active
          </h2>
          <p className="text-xs text-console-muted mt-1 leading-relaxed">
            Import a public GitHub repository to browse its file structure, inspect code line-by-line, and extract symbols.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsImportModalOpen(true)}
          className="mx-auto"
        >
          Import Repository
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-console-border gap-2">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-console-accent" />
          <h1 className="text-base font-semibold text-console-text font-mono">
            {currentRepo.owner}/{currentRepo.repo}
          </h1>
          <span className="text-xs text-console-dim">·</span>
          <span className="text-xs font-mono text-console-muted">
            {files.length} files
          </span>
        </div>

        {selectedFile && (
          <div className="flex items-center gap-2">
            <a
              href={`${currentRepo.url}/blob/${currentRepo.selectedRevision || currentRepo.defaultBranch}/${selectedFile.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-console-muted hover:text-console-accent flex items-center gap-1 transition-colors"
            >
              <span>View on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Explorer Dual-Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[calc(100vh-180px)]">
        {/* Left Pane: File Tree */}
        <div className="md:col-span-4 lg:col-span-3 h-full">
          {loadingTree ? (
            <div className="h-full flex items-center justify-center border border-console-border rounded-lg bg-console-surface text-xs font-mono text-console-muted gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-console-accent" />
              <span>Fetching repository tree...</span>
            </div>
          ) : (
            <FileTree
              files={files}
              selectedPath={selectedFile?.path || null}
              onSelectFile={(f) => {
                setSelectedFile(f);
                setHighlightRange(undefined);
              }}
            />
          )}
        </div>

        {/* Right Pane: Code Viewer & Symbols */}
        <div className="md:col-span-8 lg:col-span-9 h-full flex flex-col space-y-3 overflow-hidden">
          {/* Symbols definitions quick bar (if any) */}
          {symbols.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-2.5 bg-console-surface border border-console-border rounded-md text-xs shrink-0 select-none">
              <span className="text-[10px] font-mono text-console-dim uppercase shrink-0 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-console-accent" />
                Symbols:
              </span>
              {symbols.slice(0, 15).map((sym) => (
                <button
                  key={sym.id}
                  onClick={() => handleSymbolClick(sym)}
                  className="px-2 py-0.5 rounded bg-console-subtle hover:bg-console-elevated border border-console-border text-[11px] font-mono text-console-muted hover:text-console-accent shrink-0 transition-colors"
                  title={`${sym.signature || sym.name} (line ${sym.startLine})`}
                >
                  <span className="text-console-dim mr-1">{sym.kind[0]}</span>
                  <span>{sym.name}</span>
                </button>
              ))}
              {symbols.length > 15 && (
                <span className="text-[10px] text-console-dim shrink-0">
                  +{symbols.length - 15} more
                </span>
              )}
            </div>
          )}

          {/* Main Code Viewer Box */}
          <div className="flex-1 overflow-hidden">
            {loadingContent ? (
              <div className="h-full flex items-center justify-center border border-console-border rounded-lg bg-console-surface text-xs font-mono text-console-muted gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-console-accent" />
                <span>Loading file content...</span>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center border border-console-danger/30 rounded-lg bg-console-danger/5 p-6 text-center text-xs font-mono text-console-danger">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>{error}</span>
              </div>
            ) : selectedFile ? (
              <CodeViewer
                code={fileContent}
                filePath={selectedFile.path}
                language={selectedFile.language}
                highlightLines={highlightRange}
                maxHeight="100%"
              />
            ) : (
              <div className="h-full flex items-center justify-center border border-console-border rounded-lg bg-console-surface text-xs font-mono text-console-dim">
                Select a file from the tree to view its contents.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-console-muted">
          Loading Code Explorer...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
