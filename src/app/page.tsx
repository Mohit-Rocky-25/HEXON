"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  GitBranch,
  GitCommit,
  CheckCircle2,
  FileCode,
  Layers,
  Code2,
  Lock,
  Compass,
  BookOpen,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export default function HomePage() {
  const router = useRouter();
  const { currentRepo, setIsImportModalOpen, saveRecentRepo } = useRepository();
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHeroImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: repoUrl.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to import repository");

      saveRecentRepo(data.repository);
      router.push("/explore");
    } catch (err: any) {
      setError(err.message || "Failed to import repository");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EE] text-[#0C0A09] font-sans antialiased selection:bg-[#F55036]/20">
      {/* SECTION 1: NAVIGATION */}
      <header className="sticky top-0 z-40 w-full bg-[#F3F3EE]/90 backdrop-blur-md border-b border-[#E7E5E4] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0C0A09] flex items-center justify-center text-white font-mono font-bold text-sm tracking-tighter group-hover:bg-[#F55036] transition-colors">
              RP
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#0C0A09] leading-none">
                RepoPilot
              </span>
              <span className="text-[10px] font-mono text-[#766F6B] tracking-wider uppercase mt-0.5">
                Open Source Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#57534E]">
            <a href="#problem" className="hover:text-[#0C0A09] transition-colors">
              Problem
            </a>
            <a href="#how-it-works" className="hover:text-[#0C0A09] transition-colors">
              How It Works
            </a>
            <a href="#capabilities" className="hover:text-[#0C0A09] transition-colors">
              Capabilities
            </a>
            <a href="#use-cases" className="hover:text-[#0C0A09] transition-colors">
              Use Cases
            </a>
            <a href="#architecture" className="hover:text-[#0C0A09] transition-colors">
              Architecture
            </a>
            <a href="#zero-budget" className="hover:text-[#0C0A09] transition-colors">
              Zero-Budget Model
            </a>
            <Link href="/docs" className="hover:text-[#0C0A09] transition-colors">
              Docs
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Mohit-Rocky-25/RepoPilot"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E7E5E4] bg-white text-xs font-mono font-medium text-[#0C0A09] hover:bg-[#F8F8F6] hover:border-[#D6D3D1] transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#1E1E1E] text-white text-xs font-medium hover:bg-[#0C0A09] shadow-xs active:scale-[0.98] transition-all"
            >
              <span>Explore Repo</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F55036]" />
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 2: HERO */}
      <section className="relative px-6 lg:px-12 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E5E4] text-[#0C0A09] text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F55036] animate-pulse" />
            <span className="font-semibold">RepoPilot v1.0</span>
            <span className="text-[#766F6B]">·</span>
            <span className="text-[#57534E]">100% Free & Open-Source Code Intelligence</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#0C0A09] leading-[1.08] max-w-4xl mx-auto">
            Understand any codebase.
            <br />
            <span className="text-[#766F6B]">Trace the evidence.</span>
            <br />
            Find the fix.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#57534E] max-w-2xl mx-auto leading-relaxed font-normal">
            An open-source repository intelligence platform for contributors and software engineers.
            Explore unfamiliar architectures, search symbols deterministically, and investigate bugs with evidence-backed local AI — with zero mandatory cloud API costs.
          </p>

          {/* Hero Repository Input Form */}
          <div className="pt-4 max-w-xl mx-auto">
            <form
              onSubmit={handleHeroImport}
              className="flex flex-col sm:flex-row gap-2 p-1.5 bg-white border border-[#E7E5E4] rounded-xl shadow-sm focus-within:border-[#F55036] focus-within:ring-2 focus-within:ring-[#F55036]/20 transition-all"
            >
              <div className="flex-1 flex items-center px-3 gap-2">
                <Github className="w-4 h-4 text-[#766F6B] shrink-0" />
                <input
                  type="text"
                  placeholder="https://github.com/owner/repository"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  className="w-full bg-transparent text-sm text-[#0C0A09] placeholder:text-[#A8A29E] font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E1E1E] text-white text-xs font-semibold hover:bg-[#0C0A09] transition-all disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resolving Commit...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Exploration</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F55036]" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <p className="text-xs text-[#DC2626] font-mono mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#766F6B] pt-3">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Public GitHub Repos
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Pinned Commit SHAs
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> ₹0 API Spend
              </span>
            </div>
          </div>

          {/* Active Repo Banner if already loaded */}
          {currentRepo && (
            <div className="pt-2 max-w-xl mx-auto">
              <div className="p-3 bg-white border border-[#E7E5E4] rounded-lg shadow-xs flex items-center justify-between gap-3 text-left">
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-semibold text-[#0C0A09] truncate">
                      {currentRepo.fullName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#766F6B]">
                    Commit: {currentRepo.selectedRevision ? currentRepo.selectedRevision.slice(0, 7) : "HEAD"}
                  </span>
                </div>
                <Link href="/explore">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Workspace
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Conceptual Architecture SVG Diagram */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="p-6 md:p-8 bg-white border border-[#E7E5E4] rounded-2xl shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center justify-between pb-6 border-b border-[#E7E5E4]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#766F6B] block">
                    System Architecture Overview
                  </span>
                  <h3 className="text-base font-semibold text-[#0C0A09] font-mono mt-0.5">
                    Deterministic Ingestion & Local Reasoning Pipeline
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#F8F8F6] border border-[#E7E5E4] text-[11px] font-mono text-[#57534E]">
                  Isolated Sandbox
                </span>
              </div>

              {/* Architecture Workflow Graphic */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6">
                <div className="p-4 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036] font-mono text-xs font-bold">
                    01
                  </div>
                  <h4 className="text-xs font-semibold font-mono text-[#0C0A09]">
                    Public Ingestion
                  </h4>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Validates URL, checks SSRF safety, pins to explicit commit SHA, and retrieves recursive tree without private tokens.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036] font-mono text-xs font-bold">
                    02
                  </div>
                  <h4 className="text-xs font-semibold font-mono text-[#0C0A09]">
                    AST & Symbol Parsing
                  </h4>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Deterministic regex & parser extraction of functions, classes, interfaces, and entry points across TS, JS, Python, Go, Rust.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036] font-mono text-xs font-bold">
                    03
                  </div>
                  <h4 className="text-xs font-semibold font-mono text-[#0C0A09]">
                    Bounded RAG Context
                  </h4>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Relevant source files are ranked and injected with strict token bounds. Citations are verified against real indexed files.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-2">
                  <div className="w-7 h-7 rounded-md bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036] font-mono text-xs font-bold">
                    04
                  </div>
                  <h4 className="text-xs font-semibold font-mono text-[#0C0A09]">
                    Verified Patch Diff
                  </h4>
                  <p className="text-[11px] text-[#57534E] leading-relaxed">
                    Produces ranked hypotheses, minimal unified diffs, and reproducible regression test procedures for human review.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM */}
      <section id="problem" className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              The Engineering Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Entering an unfamiliar codebase is daunting.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Software engineers spend up to 70% of their time reading and navigating existing code. When opening a new open-source repository or investigating a critical issue, developers encounter distinct technical obstacles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <FolderTree className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Thousands of files, zero clear entry points
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Large mono-repos or nested directory structures conceal where boot execution starts, where configuration is evaluated, and which modules are active.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Cross-module execution is hard to trace
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Navigating between API handlers, middleware, database models, and service abstractions requires mental context that takes days to build manually.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Locating the source of runtime errors
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                A stack trace dumped in production or CI points to internal library frames, leaving engineers searching for the exact user-code line where invalid state originated.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Uncertainty about where tests belong
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Knowing how to write a regression test requires knowing whether the project uses Vitest, Jest, PyTest, or Go test, and where fixtures and test helpers reside.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Friction for first-time OSS contributors
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Contributors often get stuck before writing their first line of code because understanding contribution rules and project conventions is buried in outdated documentation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[#E7E5E4] flex items-center justify-center text-[#F55036]">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                AI answers that lack verified citations
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Generic cloud chatbots invent non-existent APIs, cite fabricated file paths, and hallucinate methods because they lack deterministic grounding in the repository revision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE REPOPILOT APPROACH */}
      <section id="how-it-works" className="px-6 lg:px-12 py-20 bg-[#F3F3EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              The RepoPilot Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Deterministic evidence first. AI only where grounded.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              RepoPilot follows a verifiable engineering methodology. We pin analysis to exact commit SHAs, extract deterministic symbol tables, and enforce citation checks on every output.
            </p>
          </div>

          {/* 8-Step Workflow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Select Public Repo",
                desc: "Paste any public GitHub repository URL. Validates host and SSRF boundaries."
              },
              {
                step: "02",
                title: "Pin Commit Revision",
                desc: "Resolves the exact Git commit SHA to ensure all line references remain permanent."
              },
              {
                step: "03",
                title: "Index Source Files",
                desc: "Filters binary and oversized files, extracting deterministic AST symbols."
              },
              {
                step: "04",
                title: "Search & Navigate",
                desc: "Deterministic text and symbol search works entirely offline without AI calls."
              },
              {
                step: "05",
                title: "Trace Relationships",
                desc: "Maps framework entry points, manifests, module roles, and package dependencies."
              },
              {
                step: "06",
                title: "Optional Local AI",
                desc: "Connects to your local Ollama instance with bounded context prompts and verified citations."
              },
              {
                step: "07",
                title: "Investigate Root Cause",
                desc: "Correlates runtime exception stack frames with source lines to formulate testable hypotheses."
              },
              {
                step: "08",
                title: "Validate & Export Patch",
                desc: "Reviews candidate unified diffs and exports reproducible markdown PR drafts."
              }
            ].map((st) => (
              <div
                key={st.step}
                className="p-5 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-2 hover:border-[#D6D3D1] transition-colors"
              >
                <div className="text-xs font-mono font-bold text-[#F55036]">
                  STEP {st.step}
                </div>
                <h3 className="text-sm font-semibold text-[#0C0A09] font-mono">
                  {st.title}
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TECHNICAL CAPABILITIES */}
      <section id="capabilities" className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Real developer tools, not marketing labels.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Every capability is implemented with concrete data structures, strict TypeScript schemas, and deterministic algorithms:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capability 1 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  1. Repository Ingestion & SHA Pinning
                </span>
                <Badge variant="success" size="sm">Implemented</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Prevents broken line references caused by dynamic branch drift.
                <br />
                <strong>How it works:</strong> Ingests GitHub URLs, checks SSRF safety, resolves default branch HEAD to an immutable commit SHA, and streams the tree up to 1,500 supported code files.
                <br />
                <strong>Output:</strong> Pinned revision metadata, language statistics, and filtered file tree.
                <br />
                <strong>Limitations:</strong> Capped at 60 unauthenticated requests/hr without a GitHub token.
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  2. Deterministic Symbol Extraction
                </span>
                <Badge variant="success" size="sm">Implemented</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Quickly jumping to class, function, or interface definitions without language server daemon overhead.
                <br />
                <strong>How it works:</strong> Multi-language regex & AST pattern extractors parse declarations and signatures across TS, JS, Python, Go, and Rust.
                <br />
                <strong>Output:</strong> Structured symbol table with start/end line coordinates and type kind.
                <br />
                <strong>Limitations:</strong> Macro expansions and dynamically generated metaprogramming symbols are not parsed.
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  3. Multi-Modal Ranked Code Search
                </span>
                <Badge variant="success" size="sm">Implemented</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Finding exact occurrences of strings, symbol names, or paths without hallucinated vector distance false positives.
                <br />
                <strong>How it works:</strong> Client-side deterministic search engine with path matching, symbol boosts, and language filters.
                <br />
                <strong>Output:</strong> Ranked search results with exact line numbers and code previews.
                <br />
                <strong>Limitations:</strong> Purely lexical and syntactic; does not perform semantic embeddings.
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  4. Architecture & Framework Detector
                </span>
                <Badge variant="success" size="sm">Implemented</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Understanding project scaffolding and conventions without manual inspection.
                <br />
                <strong>How it works:</strong> Inspects manifest files (package.json, pyproject.toml, go.mod, Cargo.toml) to identify Next.js, React, Flask, FastAPI, Express, entry points, and directory roles.
                <br />
                <strong>Output:</strong> Architecture summary with entry points, module directory roles, and dependencies.
                <br />
                <strong>Limitations:</strong> Bespoke proprietary directory layouts may be categorized as custom.
              </p>
            </div>

            {/* Capability 5 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  5. Evidence-Grounded Local AI (Ollama)
                </span>
                <Badge variant="cyan" size="sm">Optional Local AI</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Getting code explanations without paying per-token API bills or sending code to third-party clouds.
                <br />
                <strong>How it works:</strong> Retrieves relevant files, bounds prompt to 4,000 tokens, queries local Ollama, and validates returned file paths and line ranges against repository index.
                <br />
                <strong>Output:</strong> Concise explanation accompanied by clickable verified source citations.
                <br />
                <strong>Limitations:</strong> Requires local Ollama running on your machine; falls back gracefully to deterministic search if offline.
              </p>
            </div>

            {/* Capability 6 */}
            <div className="p-6 rounded-xl bg-[#F8F8F6] border border-[#E7E5E4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0C0A09] uppercase">
                  6. Stack Trace Parser & Bug Hypotheses
                </span>
                <Badge variant="success" size="sm">Implemented</Badge>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                <strong>What it addresses:</strong> Bridging the gap between a crash error message and the exact fix in code.
                <br />
                <strong>How it works:</strong> Parses Node/V8 and Python stack traces, filters vendor frames, correlates frames to repository files, and formulates ranked root cause hypotheses.
                <br />
                <strong>Output:</strong> Parsed frame list, ranked hypotheses, candidate unified diffs, and reproducible issue reports.
                <br />
                <strong>Limitations:</strong> Does not execute code automatically; human review is mandatory before PR submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRACTICAL USE CASES */}
      <section id="use-cases" className="px-6 lg:px-12 py-20 bg-[#F3F3EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Practical Use Cases
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Engineered for genuine developer workflows.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Real scenarios where RepoPilot accelerates understanding, investigation, and contribution:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                First-Time OSS Contributor
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Import an unfamiliar repository. RepoPilot surfaces the package manifest, locates test directories, flags contribution conventions, and helps you identify where your proposed feature or fix belongs.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Joining a New Codebase
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Discover application entry points, configuration schemas, and module directory roles within seconds. Search symbols across 1,000+ files without waiting for a bulky IDE indexing background task.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <Bug className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Investigating Production Bugs
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Paste an error log or stack trace from production or CI. RepoPilot maps stack frames to source files, pinpoints the likely culprit, formulates hypotheses, and drafts a candidate unified diff.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Learning from Best Practices
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Study how top open-source projects organize middleware, handle concurrency, or structure validation schemas. Every query is backed by exact file references and line numbers you can study directly.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <GitPullRequest className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Maintainers Preparing PRs
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Generate reproducible issue descriptions and regression testing guidelines. Review proposed candidate diffs before running test suites locally in your terminal.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-white">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-[#0C0A09] font-mono">
                Security & Dependency Audit
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Review package dependencies and production vs dev manifests without cloning unknown code or executing post-install hooks on your machine.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW THE TECHNOLOGY WORKS */}
      <section id="architecture" className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Technical Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Built with precision, bounds, and safety.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              RepoPilot is built as a modular monolith in Next.js 14 App Router, TypeScript strict mode, Tailwind CSS, Zod validation contracts, and Vitest test suites:
            </p>
          </div>

          <div className="p-6 md:p-8 bg-[#F8F8F6] border border-[#E7E5E4] rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono text-[#57534E] leading-relaxed">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    GitHub REST Ingestion & Rate-Limit Cache
                  </h4>
                  <p>
                    Calls the unauthenticated GitHub REST API (`/repos/{'{owner}'}/{'{repo}'}/git/trees/{'{sha}'}?recursive=1`). Tracks response headers (`x-ratelimit-remaining`, `x-ratelimit-limit`) to prevent unexpected HTTP 403s.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    Commit Revision Pinning
                  </h4>
                  <p>
                    Every analysis session is tied to the active commit SHA. Even if new commits are pushed to `main`, RepoPilot views and citations remain immutable.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    File Filtering & Safety Bounds
                  </h4>
                  <p>
                    Automatically excludes binaries (.png, .wasm, .zip), build directories (node_modules, dist, .next), and files over 100KB to protect browser responsiveness.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    Bounded RAG & Citation Validation
                  </h4>
                  <p>
                    Retrieval ranks files by query relevance, clips snippets with explicit line numbers, and prompts local Ollama with bounded token limits. Returned citations are regex-matched and validated against real indexed file paths.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    Execution Sandbox & Safety Boundary
                  </h4>
                  <p>
                    Arbitrary code execution is strictly disabled by default. RepoPilot never executes unvetted scripts from imported repositories on your server.
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-[#0C0A09] text-sm">
                    Zero Cloud Infrastructure Costs
                  </h4>
                  <p>
                    All indexing, search, symbol extraction, and UI rendering happen inside your browser and local Node.js process. Operating spend is ₹0 / $0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: ZERO-BUDGET AND PRIVACY MODEL */}
      <section id="zero-budget" className="px-6 lg:px-12 py-20 bg-[#F3F3EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Zero-Budget & Privacy Model
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              No credit card. No cloud bills. No telemetry tracking.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              We designed RepoPilot so any student, researcher, or open-source maintainer can run it without recurring expenses:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0C0A09] font-mono">
                No Mandatory Hosted AI API
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Core repository browsing, tree exploration, symbol discovery, and text searches work 100% without AI. You never pay OpenAI, Anthropic, or cloud providers to use the tool.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-[#F55036]">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0C0A09] font-mono">
                Local Ollama Integration
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                If you choose to enable AI synthesis, connect your local Ollama server running open-weights coding models like <code>qwen2.5-coder:1.5b</code>. Inference runs entirely on your machine.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-md bg-stone-100 flex items-center justify-center text-indigo-600">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#0C0A09] font-mono">
                Local-Only Secrets
              </h3>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Optional GitHub Personal Access Tokens are stored purely in your browser's LocalStorage and are never sent to external servers or logged in telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: PRODUCT INTERFACE PREVIEW */}
      <section className="px-6 lg:px-12 py-20 bg-white border-y border-[#E7E5E4]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Product Workspace Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              A purpose-built workspace for code comprehension.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Clean editorial typography, line-level source navigation, and verified symbol definitions:
            </p>
          </div>

          {/* Genuine Workspace Mockup Card (Zero Fake Data) */}
          <div className="border border-[#E7E5E4] rounded-2xl bg-[#F8F8F6] p-4 md:p-6 shadow-sm overflow-hidden font-mono text-xs">
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4] text-[#766F6B]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E7E5E4]" />
                <span className="w-3 h-3 rounded-full bg-[#E7E5E4]" />
                <span className="w-3 h-3 rounded-full bg-[#E7E5E4]" />
                <span className="ml-2 font-semibold text-[#0C0A09]">RepoPilot Developer Workspace</span>
              </div>
              <span className="text-[11px] text-[#A8A29E]">Deterministic Explorer · Port 3000</span>
            </div>

            {/* Split Workspace View */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-4">
              {/* File Tree Column */}
              <div className="md:col-span-4 bg-white border border-[#E7E5E4] rounded-xl p-3.5 space-y-2">
                <span className="text-[11px] text-[#A8A29E] uppercase tracking-wider block pb-1 border-b border-[#E7E5E4]">
                  Repository Tree (Pinned SHA)
                </span>
                <div className="space-y-1 text-xs text-[#57534E]">
                  <div className="flex items-center gap-2 py-0.5 text-[#0C0A09] font-medium">
                    <FolderTree className="w-3.5 h-3.5 text-[#F55036]" />
                    <span>packages/core/</span>
                  </div>
                  <div className="pl-4 space-y-1 text-[#766F6B]">
                    <div className="flex items-center gap-1.5 py-0.5 text-[#F55036] font-medium bg-orange-50 px-1.5 rounded">
                      <FileCode className="w-3 h-3" />
                      <span>schemas.ts</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-0.5">
                      <FileCode className="w-3 h-3" />
                      <span>types.ts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-0.5">
                    <FolderTree className="w-3.5 h-3.5 text-[#766F6B]" />
                    <span>packages/indexer/</span>
                  </div>
                  <div className="flex items-center gap-2 py-0.5">
                    <FolderTree className="w-3.5 h-3.5 text-[#766F6B]" />
                    <span>packages/debugging/</span>
                  </div>
                </div>
              </div>

              {/* Code Viewer Column */}
              <div className="md:col-span-8 bg-white border border-[#E7E5E4] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E7E5E4] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0C0A09]">packages/core/schemas.ts</span>
                    <Badge variant="cyan" size="sm">TypeScript</Badge>
                  </div>
                  <span className="text-[#A8A29E]">Pinned Commit L1-L12</span>
                </div>

                <div className="pt-2 text-xs text-[#1C1917] leading-relaxed select-none">
                  <div className="flex gap-3 py-0.5">
                    <span className="text-[#A8A29E] w-6 text-right select-none">1</span>
                    <span className="text-[#6366F1]">import</span> <span>&#123; z &#125;</span> <span className="text-[#6366F1]">from</span> <span className="text-emerald-700">&quot;zod&quot;</span>;
                  </div>
                  <div className="flex gap-3 py-0.5 bg-orange-50 border-l-2 border-[#F55036] px-1 -mx-1">
                    <span className="text-[#F55036] w-6 text-right select-none">2</span>
                    <span className="text-[#6366F1]">export const</span> <span className="font-bold text-[#0C0A09]">RepositoryFileSchema</span> = z.object(&#123;
                  </div>
                  <div className="flex gap-3 py-0.5 pl-6">
                    <span className="text-[#A8A29E] w-6 text-right select-none">3</span>
                    <span>path: z.string(),</span>
                  </div>
                  <div className="flex gap-3 py-0.5 pl-6">
                    <span className="text-[#A8A29E] w-6 text-right select-none">4</span>
                    <span>sha: z.string(),</span>
                  </div>
                  <div className="flex gap-3 py-0.5 pl-6">
                    <span className="text-[#A8A29E] w-6 text-right select-none">5</span>
                    <span>size: z.number().optional(),</span>
                  </div>
                  <div className="flex gap-3 py-0.5 pl-6">
                    <span className="text-[#A8A29E] w-6 text-right select-none">6</span>
                    <span>isBinary: z.boolean().default(false)</span>
                  </div>
                  <div className="flex gap-3 py-0.5">
                    <span className="text-[#A8A29E] w-6 text-right select-none">7</span>
                    <span>&#125;);</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: OPEN-SOURCE CONTRIBUTION */}
      <section id="open-source" className="px-6 lg:px-12 py-20 bg-[#F3F3EE]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
              Open-Source & Contributing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0C0A09]">
              Built in the open. Maintained by developers.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              RepoPilot is an open-source MIT-licensed portfolio project. We welcome code contributions, issue reports, and new language parser plugins:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-4 font-mono text-xs">
              <h3 className="text-sm font-semibold text-[#0C0A09] uppercase">
                Quick Local Setup (1 Minute)
              </h3>
              <p className="text-[#57534E] leading-relaxed">
                Clone the repository and run the local development server:
              </p>
              <pre className="p-3 bg-[#F8F8F6] border border-[#E7E5E4] rounded-lg text-[#0C0A09] overflow-x-auto leading-relaxed">
                git clone https://github.com/Mohit-Rocky-25/RepoPilot.git{'\n'}
                cd RepoPilot{'\n'}
                npm install{'\n'}
                npm run dev
              </pre>
              <p className="text-[11px] text-[#766F6B]">
                Open <code>http://localhost:3000</code> in your browser to begin exploring!
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E7E5E4] shadow-xs space-y-4 font-mono text-xs">
              <h3 className="text-sm font-semibold text-[#0C0A09] uppercase">
                Areas for Community Contribution
              </h3>
              <ul className="space-y-2 text-[#57534E]">
                <li className="flex items-start gap-2">
                  <span className="text-[#F55036]">●</span>
                  <span><strong>Language Extractors:</strong> Add Tree-sitter parsers for C++, Ruby, PHP, and Java.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F55036]">●</span>
                  <span><strong>Framework Heuristics:</strong> Expand detection for Svelte, Vue, Django, and Spring.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F55036]">●</span>
                  <span><strong>Ollama Prompt Engineering:</strong> Optimize few-shot prompts for 1B-3B lightweight models.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F55036]">●</span>
                  <span><strong>Integration Tests:</strong> Write Playwright end-to-end browser workflows.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CALL TO ACTION */}
      <section className="px-6 lg:px-12 py-24 bg-white border-t border-[#E7E5E4] text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mono text-[#F55036] font-semibold uppercase tracking-wider">
            Ready to explore?
          </span>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0C0A09] leading-tight">
            Stop guessing unfamiliar code.
            <br />
            Start with evidence.
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
            Import any public repository from GitHub, browse files, trace symbols, and formulate testable bug fixes with zero API bills.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1E1E1E] text-white text-sm font-semibold hover:bg-[#0C0A09] shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Import Public Repository</span>
              <ArrowRight className="w-4 h-4 text-[#F55036]" />
            </button>

            <Link href="/docs">
              <Button variant="secondary" size="lg">
                Read Documentation
              </Button>
            </Link>

            <a
              href="https://github.com/Mohit-Rocky-25/RepoPilot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#E7E5E4] bg-white text-xs font-mono font-medium text-[#0C0A09] hover:bg-[#F8F8F6] transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Inspect on GitHub</span>
            </a>
          </div>

          <div className="pt-12 text-xs font-mono text-[#A8A29E] flex flex-wrap items-center justify-center gap-6 border-t border-[#E7E5E4]">
            <span>MIT License</span>
            <span>·</span>
            <span>Zero Mandatory Cloud AI</span>
            <span>·</span>
            <span>Grounded In Pinned Commits</span>
            <span>·</span>
            <span>Open Source Portfolio Project</span>
          </div>
        </div>
      </section>
    </div>
  );
}
