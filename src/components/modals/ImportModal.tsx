"use client";

import React, { useState } from "react";
import { X, Github, ArrowRight, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { GitHubUrlSchema } from "@repopilot/core";
import { useRepository } from "@/context/RepositoryContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const SUGGESTED_REPOS = [
  { name: "facebook/react", url: "https://github.com/facebook/react", lang: "JavaScript", desc: "React library" },
  { name: "pallets/flask", url: "https://github.com/pallets/flask", lang: "Python", desc: "Python microframework" },
  { name: "expressjs/express", url: "https://github.com/expressjs/express", lang: "JavaScript", desc: "Node web framework" },
  { name: "fastapi/fastapi", url: "https://github.com/fastapi/fastapi", lang: "Python", desc: "High performance API framework" }
];

export const ImportModal: React.FC = () => {
  const { isImportModalOpen, setIsImportModalOpen, saveRecentRepo, setRateLimit } = useRepository();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isImportModalOpen) return null;

  const handleImport = async (repoUrl: string) => {
    setError(null);
    try {
      const parsedUrl = GitHubUrlSchema.parse(repoUrl);
      setLoading(true);

      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsedUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to import repository from GitHub");
      }

      if (data.rateLimit) {
        setRateLimit(data.rateLimit);
      }

      saveRecentRepo(data.repository);
      setIsImportModalOpen(false);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-console-surface border border-console-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-console-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-console-text">
                Import Public GitHub Repository
              </h3>
              <p className="text-xs text-console-muted">
                Analyze architecture, browse tree, and search code with zero API costs.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="text-console-muted hover:text-console-text p-1 rounded hover:bg-console-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleImport(url);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-mono text-console-muted mb-1.5">
                GitHub Repository URL
              </label>
              <Input
                type="text"
                placeholder="https://github.com/owner/repository"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded bg-console-danger/10 border border-console-danger/30 text-console-danger text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsImportModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={loading}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                {loading ? "Resolving & Indexing..." : "Import Repository"}
              </Button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="pt-3 border-t border-console-border">
            <span className="text-[11px] font-mono text-console-dim uppercase tracking-wider block mb-2">
              Popular Open-Source Starters:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_REPOS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setUrl(item.url);
                    handleImport(item.url);
                  }}
                  disabled={loading}
                  className="flex flex-col text-left p-2.5 rounded bg-console-subtle hover:bg-console-elevated border border-console-border transition-colors group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-medium text-console-text group-hover:text-console-accent">
                      {item.name}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {item.lang}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-console-muted truncate mt-0.5">
                    {item.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-console-subtle border-t border-console-border text-[11px] text-console-dim font-mono flex items-center justify-between">
          <span>Public Unauthenticated REST API Rate Limit Aware</span>
          <span className="text-console-accent">₹0 Spend</span>
        </div>
      </div>
    </div>
  );
};
