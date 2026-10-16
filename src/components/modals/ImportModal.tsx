"use client";

import React, { useState } from "react";
import { X, Github, ArrowRight, AlertCircle, CheckCircle, Sparkles, GitBranch, Clock } from "lucide-react";
import { GitHubUrlSchema } from "@repopilot/core";
import { useRepository } from "@/context/RepositoryContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export const ImportModal: React.FC = () => {
  const { isImportModalOpen, setIsImportModalOpen, saveRecentRepo, setRateLimit, recentRepos } = useRepository();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F55036]">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                Import Public GitHub Repository
              </h3>
              <p className="text-xs text-stone-500">
                Explore file structure, deterministic symbols, and evidence-grounded analysis.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-md hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (url.trim()) handleImport(url.trim());
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-mono font-medium text-stone-700 mb-1.5">
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
              <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
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

          {/* Real User Recents or Honest Instructions (Zero Fake Data) */}
          {recentRepos && recentRepos.length > 0 ? (
            <div className="pt-4 border-t border-stone-200">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Recently Loaded Repositories ({recentRepos.length})</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recentRepos.slice(0, 4).map((item) => (
                  <button
                    key={item.fullName}
                    onClick={() => {
                      setUrl(item.url);
                      handleImport(item.url);
                    }}
                    disabled={loading}
                    className="flex flex-col text-left p-3 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-mono font-medium text-stone-900 group-hover:text-[#F55036] truncate">
                        {item.fullName}
                      </span>
                      {item.primaryLanguage && (
                        <Badge variant="cyan" size="sm">
                          {item.primaryLanguage}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 truncate mt-1">
                      {item.description || "No description provided"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-stone-200 text-xs font-mono text-stone-500 space-y-1.5">
              <span className="font-semibold text-stone-700 block">Repository Requirements:</span>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-stone-600">
                <li>Repository must be publicly hosted on GitHub.com.</li>
                <li>Tree is pinned to default branch SHA for reproducible inspection.</li>
                <li>Zero API charges: utilizes GitHub unauthenticated public REST quota.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#F8F8F6] border-t border-stone-200 text-[11px] text-stone-500 font-mono flex items-center justify-between">
          <span>Unauthenticated REST API · Rate Limit Aware</span>
          <span className="text-[#F55036] font-medium">₹0 Zero Budget</span>
        </div>
      </div>
    </div>
  );
};

