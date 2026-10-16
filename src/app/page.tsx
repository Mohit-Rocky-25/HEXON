"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderTree,
  Search,
  Cpu,
  Bot,
  Bug,
  GitPullRequest,
  Github,
  ArrowRight,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  GitFork,
  Star
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function HomePage() {
  const { currentRepo, recentRepos, setIsImportModalOpen, saveRecentRepo } = useRepository();
  const [quickUrl, setQuickUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuickImport = async (urlToImport: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToImport })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import");
      saveRecentRepo(data.repository);
      setQuickUrl("");
    } catch (err: any) {
      setError(err.message || "Failed to import repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Console Banner */}
      <div className="border border-console-border rounded-lg bg-gradient-to-b from-console-surface to-console-subtle/50 p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-console-accent/10 border border-console-accent/30 text-console-accent text-xs font-mono">
            <Terminal className="w-3.5 h-3.5" />
            <span>Open-Source Codebase Intelligence Engine</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-console-text">
            Understand, navigate, and debug any public GitHub repository.
          </h1>

          <p className="text-sm text-console-muted leading-relaxed">
            Zero-budget developer console for open-source contributors and students.
            Explore repository trees, search symbols deterministically, trace architecture,
            and investigate bugs with evidence-grounded local AI — without paying for API keys.
          </p>

          {/* Quick Import Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (quickUrl.trim()) handleQuickImport(quickUrl.trim());
            }}
            className="pt-2 flex flex-col sm:flex-row gap-2 max-w-xl"
          >
            <Input
              type="text"
              placeholder="https://github.com/owner/repository"
              value={quickUrl}
              onChange={(e) => {
                setQuickUrl(e.target.value);
                setError(null);
              }}
              icon={<Github className="w-4 h-4" />}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
              className="shrink-0"
            >
              Import Repo
            </Button>
          </form>

          {error && (
            <p className="text-xs text-console-danger font-mono pt-1">{error}</p>
          )}
        </div>
      </div>

      {/* Active Repository Card or Quick Actions */}
      {currentRepo ? (
        <Card className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-console-dim uppercase">
                  Currently Loaded Repository:
                </span>
                <Badge variant="cyan" size="sm">
                  ACTIVE
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-console-text font-mono">
                  {currentRepo.fullName}
                </h2>
                {currentRepo.stars !== undefined && (
                  <span className="flex items-center gap-1 text-xs text-console-muted font-mono">
                    <Star className="w-3.5 h-3.5 text-console-warning" />
                    {currentRepo.stars.toLocaleString()}
                  </span>
                )}
                {currentRepo.primaryLanguage && (
                  <Badge variant="neutral" size="sm">
                    {currentRepo.primaryLanguage}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-console-muted">
                {currentRepo.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href="/explore">
                <Button variant="secondary" size="sm" icon={<FolderTree className="w-3.5 h-3.5" />}>
                  Explore Code
                </Button>
              </Link>
              <Link href="/architecture">
                <Button variant="secondary" size="sm" icon={<Cpu className="w-3.5 h-3.5" />}>
                  Architecture
                </Button>
              </Link>
              <Link href="/debugging">
                <Button variant="primary" size="sm" icon={<Bug className="w-3.5 h-3.5" />}>
                  Investigate Bug
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-console-dim">
              Explore Popular Open-Source Codebases
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                name: "facebook/react",
                url: "https://github.com/facebook/react",
                lang: "JavaScript",
                desc: "The library for web and native user interfaces."
              },
              {
                name: "pallets/flask",
                url: "https://github.com/pallets/flask",
                lang: "Python",
                desc: "The Python micro framework for web development."
              },
              {
                name: "expressjs/express",
                url: "https://github.com/expressjs/express",
                lang: "JavaScript",
                desc: "Fast, unopinionated, minimalist web framework for Node."
              },
              {
                name: "fastapi/fastapi",
                url: "https://github.com/fastapi/fastapi",
                lang: "Python",
                desc: "FastAPI framework, high performance, easy to learn."
              }
            ].map((repo) => (
              <Card
                key={repo.name}
                className="p-4 hover:border-console-borderHover transition-colors cursor-pointer group flex flex-col justify-between"
                onClick={() => handleQuickImport(repo.url)}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-console-text group-hover:text-console-accent transition-colors">
                      {repo.name}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {repo.lang}
                    </Badge>
                  </div>
                  <p className="text-xs text-console-muted line-clamp-2">
                    {repo.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-console-dim">
                  <span>Click to Import</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feature Navigation Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-console-dim">
          Core Developer Workspaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/explore" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <FolderTree className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                Code Explorer & Viewer
              </h3>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Browse file trees, view exact line numbers, and inspect raw or syntax-highlighted code pinned to commit SHAs.
              </p>
            </Card>
          </Link>

          <Link href="/search" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                Full-Text & Symbol Search
              </h3>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Deterministic text search, symbol definitions (classes, functions, types), and path filters without AI hallucination.
              </p>
            </Card>
          </Link>

          <Link href="/architecture" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                Architecture Intelligence
              </h3>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Automatically detect primary languages, package manifests, entry points, and module relationships grounded in code.
              </p>
            </Card>
          </Link>

          <Link href="/assistant" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                  Grounded Code Assistant
                </h3>
                <Badge variant="violet" size="sm">
                  Ollama
                </Badge>
              </div>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Ask questions about the active repository. Explanations cite verified file paths and line ranges via your local model.
              </p>
            </Card>
          </Link>

          <Link href="/debugging" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <Bug className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                Bug Investigation & Traces
              </h3>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Paste error logs and stack traces. RepoPilot maps stack frames to source files and produces testable bug hypotheses.
              </p>
            </Card>
          </Link>

          <Link href="/patches" className="block group">
            <Card className="p-5 h-full group-hover:border-console-borderHover transition-colors">
              <div className="w-8 h-8 rounded bg-console-subtle border border-console-border flex items-center justify-center text-console-accent mb-3">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-console-text group-hover:text-console-accent transition-colors font-mono">
                Patch Review & Diffs
              </h3>
              <p className="text-xs text-console-muted mt-1 leading-relaxed">
                Review proposed candidate unified diffs, regression test recommendations, and export reproducible PR drafts.
              </p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Engineering Integrity & Guarantees */}
      <div className="border border-console-border rounded-lg bg-console-surface p-5">
        <h3 className="text-xs font-mono uppercase tracking-wider text-console-dim mb-3">
          Engineering Principles & Zero-Budget Model
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-console-success shrink-0 mt-0.5" />
            <div>
              <span className="text-console-text font-semibold block">
                Zero Mandatory Hosted AI
              </span>
              <span className="text-console-muted">
                Runs 100% locally with optional Ollama endpoints. No personal API bills.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-console-accent shrink-0 mt-0.5" />
            <div>
              <span className="text-console-text font-semibold block">
                Deterministic Code Navigation
              </span>
              <span className="text-console-muted">
                Tree navigation, symbol discovery, and text searches work without AI.
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Activity className="w-4 h-4 text-console-warning shrink-0 mt-0.5" />
            <div>
              <span className="text-console-text font-semibold block">
                Grounded Citations
              </span>
              <span className="text-console-muted">
                Every AI response is validated against indexed repository commit files.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
