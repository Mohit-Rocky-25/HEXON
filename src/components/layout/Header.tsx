"use client";

import React from "react";
import { GitBranch, GitCommit, Search, Plus, ExternalLink, ShieldAlert, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  currentRepo?: {
    owner: string;
    repo: string;
    defaultBranch?: string;
    commitSha?: string;
  } | null;
  onOpenImport?: () => void;
  onOpenSearch?: () => void;
  rateLimit?: {
    remaining: number;
    limit: number;
  };
  aiStatus?: "ready" | "offline" | "connecting";
}

export const Header: React.FC<HeaderProps> = ({
  currentRepo,
  onOpenImport,
  onOpenSearch,
  rateLimit = { remaining: 5000, limit: 5000 },
  aiStatus = "offline"
}) => {
  return (
    <header className="h-14 bg-white border-b border-stone-200 px-4 flex items-center justify-between shrink-0 select-none shadow-xs">
      {/* Current Repository Context */}
      <div className="flex items-center gap-3">
        {currentRepo ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-mono">Active Repo:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAFAF9] border border-stone-200 text-xs font-mono">
              <span className="text-stone-900 font-semibold">
                {currentRepo.owner}/{currentRepo.repo}
              </span>
              <span className="text-stone-400">@</span>
              <span className="text-[#F55036] flex items-center gap-1 font-medium">
                <GitBranch className="w-3 h-3" />
                {currentRepo.defaultBranch || "main"}
              </span>
              {currentRepo.commitSha && (
                <span className="text-stone-500 flex items-center gap-0.5 ml-1 pl-1 border-l border-stone-200">
                  <GitCommit className="w-3 h-3 text-stone-400" />
                  {currentRepo.commitSha.slice(0, 7)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-mono">No repository imported</span>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={onOpenImport}
            >
              Import Repository
            </Button>
          </div>
        )}
      </div>

      {/* Global Actions, Rate Limits & AI Telemetry */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#FAFAF9] hover:bg-stone-100 border border-stone-200 text-xs text-stone-600 transition-colors font-mono"
        >
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <span>Quick search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-stone-500 border border-stone-200 ml-2">
            Ctrl+K
          </kbd>
        </button>

        {/* Local AI Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAFAF9] border border-stone-200 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              aiStatus === "ready"
                ? "bg-emerald-500"
                : aiStatus === "connecting"
                ? "bg-amber-500 animate-pulse"
                : "bg-stone-400"
            }`}
          />
          <span className="text-stone-500">Local AI:</span>
          <span
            className={
              aiStatus === "ready"
                ? "text-emerald-700 font-medium"
                : "text-stone-600 font-medium"
            }
          >
            {aiStatus === "ready" ? "Ollama Online" : "Deterministic (Offline)"}
          </span>
        </div>

        {/* GitHub API Rate Limit */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAFAF9] border border-stone-200 text-[11px] font-mono text-stone-600"
          title="GitHub REST API rate limit status"
        >
          <span className="text-stone-400">API:</span>
          <span
            className={
              rateLimit.remaining < 20
                ? "text-red-600 font-semibold"
                : "text-stone-800 font-medium"
            }
          >
            {rateLimit.remaining}/{rateLimit.limit}
          </span>
        </div>

        {currentRepo && (
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={onOpenImport}
          >
            Switch
          </Button>
        )}
      </div>
    </header>
  );
};
