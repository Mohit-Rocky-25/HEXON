"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search as SearchIcon,
  Filter,
  FileCode,
  Code2,
  Folder,
  ArrowRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SearchResult } from "@repopilot/core";
import { SearchEngine } from "@repopilot/search";
import { Suspense } from "react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const { currentRepo, files, setIsImportModalOpen } = useRepository();

  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<"all" | "symbol" | "path" | "text">("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [pathPrefix, setPathPrefix] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Available languages from current files
  const languages = Array.from(
    new Set(files.map((f) => f.language).filter(Boolean) as string[])
  ).sort();

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    const engine = new SearchEngine({
      files,
      symbols: []
    });

    const matches = engine.search({
      query: query.trim(),
      type: searchType,
      language: selectedLanguage !== "all" ? selectedLanguage : undefined,
      pathPrefix: pathPrefix.trim() || undefined,
      limit: 50
    });

    setResults(matches);
    setIsSearching(false);
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [files]);

  const handleNavigate = (res: SearchResult) => {
    router.push(
      `/explore?file=${encodeURIComponent(res.filePath)}&line=${res.lineNumber}`
    );
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent mx-auto">
          <SearchIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-console-text">
            No Repository Loaded
          </h2>
          <p className="text-xs text-console-muted mt-1 leading-relaxed">
            Import a public GitHub repository to perform deterministic code search and symbol navigation.
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
      {/* Search Header Bar */}
      <div>
        <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
          <SearchIcon className="w-5 h-5 text-console-accent" />
          <span>Code & Symbol Search</span>
        </h1>
        <p className="text-xs text-console-muted mt-0.5">
          Deterministic indexed search across {files.length} repository files in {currentRepo.owner}/{currentRepo.repo}.
        </p>
      </div>

      {/* Query Form Box */}
      <Card className="p-4 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search functions, classes, file names, or patterns..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              icon={<SearchIcon className="w-4 h-4" />}
              autoFocus
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSearching}
            icon={<SearchIcon className="w-4 h-4" />}
            className="shrink-0"
          >
            Search Code
          </Button>
        </form>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-console-border text-xs font-mono">
          {/* Search Type Filters */}
          <div className="flex items-center gap-1">
            <span className="text-console-dim mr-1">Type:</span>
            {(["all", "symbol", "path", "text"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSearchType(t)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  searchType === t
                    ? "bg-console-accent text-[#07090e] font-semibold"
                    : "bg-console-subtle text-console-muted hover:text-console-text border border-console-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Language Filter */}
          {languages.length > 0 && (
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-console-dim">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-console-subtle border border-console-border text-console-text text-xs rounded px-2 py-1 focus:outline-none"
              >
                <option value="all">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-console-dim">
          <span>
            {results.length} {results.length === 1 ? "result" : "results"} found
          </span>
        </div>

        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((res, idx) => (
              <Card
                key={`${res.filePath}:${res.lineNumber}:${idx}`}
                onClick={() => handleNavigate(res)}
                className="p-3.5 hover:border-console-borderHover transition-colors cursor-pointer group font-mono text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-4 h-4 text-console-accent shrink-0" />
                    <span className="text-console-text font-semibold group-hover:text-console-accent truncate transition-colors">
                      {res.filePath}
                    </span>
                    <span className="text-console-dim">
                      :line {res.lineNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        res.matchType === "symbol"
                          ? "violet"
                          : res.matchType === "path"
                          ? "cyan"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {res.matchType}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-console-dim group-hover:text-console-accent group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                <div className="pl-6 text-console-muted text-[11px] truncate bg-console-subtle/50 py-1 px-2 rounded border border-console-border/40">
                  {res.previewText}
                </div>
              </Card>
            ))}
          </div>
        ) : query.trim() ? (
          <Card className="p-8 text-center text-xs font-mono text-console-dim">
            No matching results found for "{query}". Try broadening your search or clearing filters.
          </Card>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-console-muted">
          Loading Search Console...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
