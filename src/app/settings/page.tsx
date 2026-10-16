"use client";

import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Key,
  ShieldCheck,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Github
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

export default function GeneralSettingsPage() {
  const { currentRepo, recentRepos, rateLimit, setRateLimit } = useRepository();

  const [token, setToken] = useState("");
  const [savedTokenNotice, setSavedTokenNotice] = useState(false);
  const [clearedHistoryNotice, setClearedHistoryNotice] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("REPOPILOT_GH_TOKEN");
    if (saved) setToken(saved);
  }, []);

  const handleSaveToken = () => {
    if (token.trim()) {
      localStorage.setItem("REPOPILOT_GH_TOKEN", token.trim());
    } else {
      localStorage.removeItem("REPOPILOT_GH_TOKEN");
    }
    setSavedTokenNotice(true);
    setTimeout(() => setSavedTokenNotice(false), 2500);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("REPOPILOT_RECENT_REPOS");
    setClearedHistoryNotice(true);
    setTimeout(() => {
      setClearedHistoryNotice(false);
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-3 border-b border-console-border">
        <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-console-accent" />
          <span>Console Configuration & Environment</span>
        </h1>
        <p className="text-xs text-console-muted mt-0.5">
          Manage local secrets, GitHub rate limit quotas, and sandboxing safety policies.
        </p>
      </div>

      {/* GitHub Token / Rate Limit Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-console-accent" />
            <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
              GitHub Rate Limit & Optional Token
            </h2>
          </div>
          <Badge variant="cyan" size="sm">
            Current Quota: {rateLimit.remaining}/{rateLimit.limit}
          </Badge>
        </div>

        <p className="text-xs text-console-muted leading-relaxed font-mono">
          Public GitHub unauthenticated requests are limited to 60 req/hour. Supplying an optional Personal Access Token (classic with public repo read access) increases your quota to 5,000 req/hour. The token is stored strictly in your browser's LocalStorage and is never transmitted to any third party.
        </p>

        <div className="space-y-2 font-mono text-xs">
          <label className="block text-console-dim">
            Personal Access Token (Optional)
          </label>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="w-3.5 h-3.5" />}
              onClick={handleSaveToken}
              className="shrink-0"
            >
              Save Token
            </Button>
          </div>
          {savedTokenNotice && (
            <p className="text-xs text-console-success flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Token preferences saved locally.
            </p>
          )}
        </div>
      </Card>

      {/* Security & Execution Policy Card */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-console-success" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            Security & Execution Sandbox Policy
          </h2>
        </div>

        <div className="space-y-2 text-console-muted leading-relaxed">
          <div className="flex items-center justify-between p-2.5 rounded bg-console-subtle border border-console-border">
            <span>Automated Arbitrary Code Execution</span>
            <Badge variant="danger" size="sm">
              STRICTLY DISABLED
            </Badge>
          </div>

          <p>
            In alignment with open-source developer safety best practices, RepoPilot treats all third-party code as untrusted. No repository build scripts, package post-installs, or arbitrary test suites are executed on your server automatically. Instead, reproducible manual commands and unified diffs are provided for human verification.
          </p>
        </div>
      </Card>

      {/* Local Storage & History Management */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-console-danger" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            Local Data & Workspace History
          </h2>
        </div>

        <p className="text-console-muted">
          Clear cached repository history and saved configurations stored in your browser.
        </p>

        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearHistory}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear Local Cache & Recent History
          </Button>
          {clearedHistoryNotice && (
            <span className="text-xs text-console-danger ml-3">
              History cleared. Reloading...
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
