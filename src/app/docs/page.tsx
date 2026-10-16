"use client";

import React from "react";
import { BookOpen, ShieldCheck, Cpu, Terminal, Zap, AlertTriangle, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function DocsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-3 border-b border-console-border">
        <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-console-accent" />
          <span>Documentation, User Guide & Limitations</span>
        </h1>
        <p className="text-xs text-console-muted mt-0.5">
          Everything you need to know about RepoPilot's zero-budget architecture, local AI integration, and capabilities.
        </p>
      </div>

      {/* Mission & Overview */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-console-accent" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            Product Mission & Philosophy
          </h2>
        </div>
        <p className="text-console-muted leading-relaxed">
          RepoPilot is built for students, open-source contributors, and software engineers investigating unfamiliar codebases. It provides a complete, evidence-grounded workflow from URL import to code exploration, symbol navigation, architecture discovery, bug analysis, and PR patch preparation — without requiring expensive cloud API subscriptions or credit cards.
        </p>
      </Card>

      {/* Core Capabilities */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-console-accent" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            Implemented Feature Matrix
          </h2>
        </div>

        <div className="divide-y divide-console-border border border-console-border rounded-md overflow-hidden">
          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">1. Public Repository Ingestion</span>
              <span className="text-console-muted">Validates public GitHub URLs, checks SSRF safety, pins commit revisions, and retrieves recursive file trees with rate-limit tracking.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">2. Code Explorer & Viewer</span>
              <span className="text-console-muted">Interactive directory tree, line numbers, syntax highlighting presentation, line highlighting, and symbol definition jump chips.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">3. Full-Text & Symbol Search</span>
              <span className="text-console-muted">Deterministic regex symbol extraction (functions, classes, interfaces) and ranked search without AI hallucination.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">4. Architecture Intelligence</span>
              <span className="text-console-muted">Automatic framework detection (React, Next.js, Flask, FastAPI, etc.), entry points identification, and module roles.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">5. Grounded Code Assistant</span>
              <span className="text-console-muted">Optional local Ollama inference with bounded context prompts, verified citation validation, and deterministic offline fallback.</span>
            </div>
            <Badge variant="cyan" size="sm">OPTIONAL LOCAL AI</Badge>
          </div>

          <div className="p-3 bg-console-surface flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-console-text block">6. Bug Investigation & Stack Trace Analyzer</span>
              <span className="text-console-muted">Maps runtime error stack traces to repository files, formulates ranked hypotheses, generates candidate patches and test suggestions.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>
        </div>
      </Card>

      {/* Honest Limitations & Hardware Requirements */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-console-warning" />
          <h2 className="text-sm font-semibold text-console-text uppercase">
            Honest Limitations & Operating Constraints
          </h2>
        </div>

        <ul className="list-disc list-inside space-y-2 text-console-muted leading-relaxed pl-1">
          <li>
            <strong className="text-console-text">GitHub API Limits:</strong> Unauthenticated public GitHub access is capped by GitHub at 60 requests per hour per IP. To increase this to 5,000 req/hr, configure an optional Personal Access Token in Settings.
          </li>
          <li>
            <strong className="text-console-text">Repository Tree Bounds:</strong> For fast browser performance and zero-budget resource efficiency, repositories are indexed up to 1,500 source files. Binary assets and build artifacts (e.g. node_modules, dist) are automatically excluded.
          </li>
          <li>
            <strong className="text-console-text">Local AI Hardware Requirements:</strong> If using Ollama, we recommend 8GB+ RAM for lightweight coding models like <code>qwen2.5-coder:1.5b</code> or <code>llama3.2:3b</code>. No GPU is required. The platform operates 100% fine without Ollama.
          </li>
          <li>
            <strong className="text-console-text">Execution Security:</strong> Arbitrary code execution is strictly disabled. Proposed patches require human review and local execution via the provided reproduction instructions.
          </li>
        </ul>
      </Card>
    </div>
  );
}
