"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  FileCode,
  FolderTree,
  Box,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Code
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ArchitectureSummary } from "@repopilot/core";

export default function ArchitecturePage() {
  const { currentRepo, setIsImportModalOpen } = useRepository();

  const [summary, setSummary] = useState<ArchitectureSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentRepo) return;

    setLoading(true);
    setError(null);

    fetch("/api/architecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: currentRepo.owner,
        repo: currentRepo.repo,
        sha: currentRepo.selectedRevision
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setError(data.error || "Failed to analyze architecture.");
        }
      })
      .catch((err) => setError("Error loading architecture intelligence."))
      .finally(() => setLoading(false));
  }, [currentRepo]);

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent mx-auto">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-console-text">
            No Active Repository
          </h2>
          <p className="text-xs text-console-muted mt-1 leading-relaxed">
            Import a public GitHub repository to automatically detect frameworks, entry points, configuration manifests, and module relationships.
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
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-console-border gap-2">
        <div>
          <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
            <Cpu className="w-5 h-5 text-console-accent" />
            <span>Architecture Intelligence</span>
          </h1>
          <p className="text-xs text-console-muted mt-0.5">
            Deterministic architectural analysis of {currentRepo.owner}/{currentRepo.repo}.
          </p>
        </div>
        <Badge variant="cyan" size="sm">
          Commit: {currentRepo.selectedRevision ? currentRepo.selectedRevision.slice(0, 7) : "HEAD"}
        </Badge>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center border border-console-border rounded-lg bg-console-surface text-xs font-mono text-console-muted gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-console-accent" />
          <span>Analyzing repository structure and manifests...</span>
        </div>
      ) : error ? (
        <div className="p-6 rounded-lg bg-console-danger/10 border border-console-danger/30 text-console-danger text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : summary ? (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-console-dim uppercase">
                Primary Language
              </span>
              <div className="text-base font-semibold text-console-text font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-console-accent" />
                <span>{summary.primaryLanguage || "Multi-language"}</span>
              </div>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-console-dim uppercase">
                Detected Frameworks
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {summary.detectedFrameworks.length > 0 ? (
                  summary.detectedFrameworks.map((fw) => (
                    <Badge key={fw} variant="cyan" size="sm">
                      {fw}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-console-muted font-mono">
                    Standard Library / Custom
                  </span>
                )}
              </div>
            </Card>

            <Card className="p-4 space-y-1">
              <span className="text-[11px] font-mono text-console-dim uppercase">
                Identified Entry Points
              </span>
              <div className="text-base font-semibold text-console-text font-mono">
                {summary.entryPoints.length} Files
              </div>
            </Card>
          </div>

          {/* Entry Points Section */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-console-accent" />
              <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                Application Entry Points
              </h2>
            </div>
            <p className="text-xs text-console-muted">
              Key starting points where execution begins, servers boot, or pages mount:
            </p>

            {summary.entryPoints.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summary.entryPoints.map((ep) => (
                  <Link
                    key={ep}
                    href={`/explore?file=${encodeURIComponent(ep)}`}
                    className="flex items-center justify-between p-2.5 rounded bg-console-subtle hover:bg-console-elevated border border-console-border transition-colors group font-mono text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-4 h-4 text-console-accent shrink-0" />
                      <span className="truncate group-hover:text-console-accent text-console-text font-medium">
                        {ep}
                      </span>
                    </div>
                    <span className="text-[11px] text-console-dim group-hover:text-console-muted">
                      Inspect →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-console-dim font-mono">
                No conventional entry point files detected.
              </div>
            )}
          </Card>

          {/* Module Roles & Directory Hierarchy */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-console-accent" />
              <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                Module Hierarchy & Directory Roles
              </h2>
            </div>

            <div className="divide-y divide-console-border border border-console-border rounded-md overflow-hidden font-mono text-xs">
              {summary.keyModules.map((mod) => (
                <div
                  key={mod.directory}
                  className="flex items-center justify-between p-3 bg-console-surface hover:bg-console-subtle/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-semibold text-console-text">
                      {mod.directory}/
                    </span>
                    <span className="text-console-dim text-[11px]">
                      ({mod.description})
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {mod.fileCount} files
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Dependencies / Manifests */}
          {summary.dependencies.length > 0 && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-console-accent" />
                <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                  Dependencies & Packages ({summary.dependencies.length})
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 font-mono text-xs">
                {summary.dependencies.map((dep) => (
                  <div
                    key={dep.name}
                    className="p-2 rounded bg-console-subtle border border-console-border flex items-center justify-between"
                  >
                    <span className="text-console-text truncate font-medium">
                      {dep.name}
                    </span>
                    <Badge variant={dep.isDev ? "neutral" : "cyan"} size="sm">
                      {dep.isDev ? "dev" : "prod"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
