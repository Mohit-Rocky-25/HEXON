"use client";

import React from "react";
import { BookOpen, ShieldCheck, Cpu, Terminal, Zap, AlertTriangle, Layers } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function DocsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-3 border-b border-stone-200">
        <h1 className="text-lg font-semibold text-stone-900 font-mono flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#F55036]" />
          <span>Documentation, User Guide & Limitations</span>
        </h1>
        <p className="text-xs text-stone-600 mt-0.5">
          Comprehensive guide to RepoPilot's zero-budget architecture, local AI integration, and capabilities.
        </p>
      </div>

      {/* Mission & Overview */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#F55036]" />
          <h2 className="text-sm font-semibold text-stone-900 uppercase">
            Product Mission & Philosophy
          </h2>
        </div>
        <p className="text-stone-600 leading-relaxed">
          RepoPilot is built for students, open-source contributors, and software engineers investigating unfamiliar codebases. It provides a complete, evidence-grounded workflow from URL import to code exploration, symbol navigation, 3D architecture discovery, bug analysis, and PR patch preparation — without requiring expensive cloud API subscriptions or credit cards.
        </p>
      </Card>

      {/* Core Capabilities */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#F55036]" />
          <h2 className="text-sm font-semibold text-stone-900 uppercase">
            Implemented Feature Matrix
          </h2>
        </div>

        <div className="divide-y divide-stone-100 border border-stone-200 rounded-md overflow-hidden">
          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">1. Public Repository Ingestion</span>
              <span className="text-stone-600">Validates public GitHub URLs, checks SSRF safety, pins commit revisions, and retrieves recursive file trees with rate-limit tracking.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">2. Code Explorer & Viewer</span>
              <span className="text-stone-600">Interactive directory tree, line numbers, syntax highlighting presentation, line highlighting, and symbol definition jump chips.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">3. Full-Text & Symbol Search</span>
              <span className="text-stone-600">Deterministic AST symbol extraction (functions, classes, interfaces) and ranked search without AI hallucination.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">4. Interactive 3D Spatial Architecture</span>
              <span className="text-stone-600">Interactive 3D orbital perspective map with 2D planar mode, automatic framework detection, entry points identification, and module roles.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>

          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">5. Grounded Code Assistant</span>
              <span className="text-stone-600">Optional local Ollama inference with bounded context prompts, verified citation validation, and deterministic offline fallback.</span>
            </div>
            <Badge variant="primary" size="sm">OPTIONAL LOCAL AI</Badge>
          </div>

          <div className="p-3 bg-white flex items-start justify-between gap-4">
            <div>
              <span className="font-semibold text-stone-900 block">6. Bug Investigation & Patch Review Handoff</span>
              <span className="text-stone-600">Maps runtime error stack traces to repository files, formulates ranked hypotheses, generates candidate patches, regression tests, and copyable PR drafts.</span>
            </div>
            <Badge variant="success" size="sm">FOSS / LIVE</Badge>
          </div>
        </div>
      </Card>

      {/* Honest Limitations & Hardware Requirements */}
      <Card className="p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-semibold text-stone-900 uppercase">
            Honest Limitations & Operating Constraints
          </h2>
        </div>

        <ul className="list-disc list-inside space-y-2 text-stone-600 leading-relaxed pl-1">
          <li>
            <strong className="text-stone-900">GitHub API Limits:</strong> Unauthenticated public GitHub access is capped by GitHub at 60 requests per hour per IP. To increase this to 5,000 req/hr, configure an optional Personal Access Token or GitHub CLI token in Settings.
          </li>
          <li>
            <strong className="text-stone-900">Repository Tree Bounds:</strong> For fast browser performance and zero-budget resource efficiency, repositories are indexed up to 1,500 source files. Binary assets and build artifacts (e.g. node_modules, dist) are automatically excluded.
          </li>
          <li>
            <strong className="text-stone-900">Local AI Hardware Requirements:</strong> If using Ollama, we recommend 8GB+ RAM for lightweight coding models like <code>qwen2.5-coder:1.5b</code> or <code>llama3.2:3b</code>. No GPU is required. The platform operates 100% fine without Ollama.
          </li>
          <li>
            <strong className="text-stone-900">Execution Security:</strong> Arbitrary code execution is strictly disabled. Proposed patches require human review and local execution via the provided reproduction instructions.
          </li>
        </ul>
      </Card>
    </div>
  );
}
