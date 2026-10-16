"use client";

import React, { useState } from "react";
import { GitBranch, GitCommit, Search, Sparkles, Plus, ExternalLink, ShieldAlert } from "lucide-react";
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
  rateLimit = { remaining: 59, limit: 60 },
  aiStatus = "offline"
}) => {
  return (
    <header className="h-14 bg-console-surface border-b border-console-border px-4 flex items-center justify-between shrink-0 select-none">
      {/* Current Repository Context */}
      <div className="flex items-center gap-3">
        {currentRepo ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-console-muted">Active Repo:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-console-subtle border border-console-border text-xs font-mono">
              <span className="text-console-text font-semibold">
                {currentRepo.owner}/{currentRepo.repo}
              </span>
              <span className="text-console-dim">@</span>
              <span className="text-console-accent flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {currentRepo.defaultBranch || "main"}
              </span>
              {currentRepo.commitSha && (
                <span className="text-console-dim flex items-center gap-0.5 ml-1 pl-1 border-l border-console-border">
                  <GitCommit className="w-3 h-3" />
                  {currentRepo.commitSha.slice(0, 7)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-console-muted">No repository imported yet</span>
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
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-console-subtle hover:bg-console-elevated border border-console-border text-xs text-console-muted transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search repository...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-console-elevated text-console-dim border border-console-border ml-2">
            Ctrl+K
          </kbd>
        </button>

        {/* Local AI Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-console-subtle border border-console-border text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              aiStatus === "ready"
                ? "bg-console-success"
                : aiStatus === "connecting"
                ? "bg-console-warning animate-pulse"
                : "bg-console-dim"
            }`}
          />
          <span className="text-console-muted">Local AI:</span>
          <span
            className={
              aiStatus === "ready"
                ? "text-console-success font-medium"
                : "text-console-dim"
            }
          >
            {aiStatus === "ready" ? "Ollama Ready" : "Disabled (Offline)"}
          </span>
        </div>

        {/* GitHub API Rate Limit */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-console-subtle border border-console-border text-[11px] font-mono text-console-muted"
          title="Public GitHub unauthenticated REST API quota"
        >
          <span>API:</span>
          <span
            className={
              rateLimit.remaining < 10
                ? "text-console-danger font-medium"
                : "text-console-text"
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
            Switch Repo
          </Button>
        )}
      </div>
    </header>
  );
};
