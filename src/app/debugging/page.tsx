"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bug,
  AlertOctagon,
  FileCode,
  ArrowRight,
  Copy,
  Check,
  GitPullRequest,
  CheckCircle2,
  Loader2,
  FileText
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { BugHypothesis, PatchProposal } from "@repopilot/core";
import type { ParsedTrace, StackFrame } from "@repopilot/debugging";

const SAMPLE_NODE_TRACE = `TypeError: Cannot read properties of undefined (reading 'items')
    at renderDashboard (src/components/Dashboard.tsx:42:18)
    at App (src/app/page.tsx:28:12)
    at mountRoot (node_modules/react-dom/cjs/react-dom.production.min.js:12:4)`;

const SAMPLE_PY_TRACE = `Traceback (most recent call last):
  File "src/server.py", line 18, in handle_request
  File "src/services/auth.py", line 45, in verify_token
KeyError: 'user_id'`;

export default function DebuggingPage() {
  const { currentRepo, setIsImportModalOpen } = useRepository();

  const [title, setTitle] = useState("Unhandled TypeError in component rendering");
  const [description, setDescription] = useState("Dashboard crashes when navigating without initialized items array.");
  const [stackTrace, setStackTrace] = useState(SAMPLE_NODE_TRACE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<{
    parsedTrace: ParsedTrace;
    hypotheses: BugHypothesis[];
    candidatePatch?: PatchProposal;
    suggestedTests: string[];
    reproducibleReport: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!currentRepo || !stackTrace.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/debugging/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: currentRepo.owner,
          repo: currentRepo.repo,
          sha: currentRepo.selectedRevision,
          title,
          description,
          stackTrace
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");

      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze bug report.");
    } finally {
      setLoading(false);
    }
  };

  const copyReport = () => {
    if (analysisResult?.reproducibleReport) {
      navigator.clipboard.writeText(analysisResult.reproducibleReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent mx-auto">
          <Bug className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-console-text">
            No Active Repository
          </h2>
          <p className="text-xs text-console-muted mt-1 leading-relaxed">
            Import a public GitHub repository to map error stack traces directly to source code lines and formulate candidate bug fixes.
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
      {/* Header */}
      <div className="pb-3 border-b border-console-border">
        <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
          <Bug className="w-5 h-5 text-console-danger" />
          <span>Bug Investigation & Stack Trace Analyzer</span>
        </h1>
        <p className="text-xs text-console-muted mt-0.5">
          Correlate runtime exceptions with repository source lines, formulate root causes, and propose testable patches.
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-console-muted mb-1">
              Issue Title / Summary
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cannot read property of undefined"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-console-muted mb-1">
              Issue Context / Description
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Triggered on dashboard page load"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono text-console-muted">
              Stack Trace / Error Log
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-console-dim">
                Quick Sample:
              </span>
              <button
                type="button"
                onClick={() => setStackTrace(SAMPLE_NODE_TRACE)}
                className="text-[11px] font-mono text-console-accent hover:underline"
              >
                Node/TS Trace
              </button>
              <span className="text-console-dim">·</span>
              <button
                type="button"
                onClick={() => setStackTrace(SAMPLE_PY_TRACE)}
                className="text-[11px] font-mono text-console-accent hover:underline"
              >
                Python Trace
              </button>
            </div>
          </div>
          <textarea
            rows={5}
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            className="w-full bg-[#07090e] border border-console-border text-console-text font-mono text-xs p-3 rounded focus:outline-none focus:border-console-accent"
            placeholder="Paste stack trace or error log here..."
          />
        </div>

        {error && (
          <p className="text-xs text-console-danger font-mono">{error}</p>
        )}

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="md"
            isLoading={loading}
            icon={<AlertOctagon className="w-4 h-4" />}
            onClick={handleAnalyze}
          >
            Investigate Root Cause
          </Button>
        </div>
      </Card>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Parsed Frames */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-console-danger" />
                <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                  Parsed Stack Frames ({analysisResult.parsedTrace.frames.length})
                </h2>
              </div>
              {analysisResult.parsedTrace.errorType && (
                <Badge variant="danger" size="sm">
                  {analysisResult.parsedTrace.errorType}
                </Badge>
              )}
            </div>

            <div className="divide-y divide-console-border border border-console-border rounded-md overflow-hidden font-mono text-xs">
              {analysisResult.parsedTrace.frames.map((frame: StackFrame, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-console-surface hover:bg-console-subtle/60 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-console-dim w-6 text-right">
                      #{idx + 1}
                    </span>
                    <FileCode className="w-3.5 h-3.5 text-console-accent shrink-0" />
                    <span className="text-console-text font-medium truncate">
                      {frame.filePath}
                    </span>
                    <span className="text-console-dim">
                      :line {frame.lineNumber}
                    </span>
                    {frame.functionName && (
                      <span className="text-[11px] text-console-muted">
                        in {frame.functionName}()
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/explore?file=${encodeURIComponent(frame.filePath)}&line=${frame.lineNumber}`}
                    className="text-[11px] text-console-accent hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>View in Code</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          {/* Hypotheses */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-console-dim">
              Ranked Root-Cause Hypotheses
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {analysisResult.hypotheses.map((hypo) => (
                <Card key={hypo.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="cyan" size="sm">
                        Rank #{hypo.rank}
                      </Badge>
                      <span className="text-xs font-mono font-semibold text-console-text">
                        {hypo.culpritFile}
                        {hypo.startLine ? `:line ${hypo.startLine}` : ""}
                      </span>
                    </div>

                    <Badge
                      variant={
                        hypo.confidence === "high"
                          ? "success"
                          : hypo.confidence === "medium"
                          ? "warning"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {hypo.confidence.toUpperCase()} CONFIDENCE
                    </Badge>
                  </div>

                  <p className="text-xs font-mono text-console-muted leading-relaxed">
                    {hypo.explanation}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Candidate Patch Proposal */}
          {analysisResult.candidatePatch && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-console-success" />
                  <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                    Proposed Minimal Candidate Patch
                  </h2>
                </div>
                <Badge variant="neutral" size="sm">
                  Human Review Required
                </Badge>
              </div>

              <p className="text-xs text-console-muted">
                {analysisResult.candidatePatch.rationale}
              </p>

              {/* Unified Diff View */}
              <div className="bg-[#07090e] border border-console-border rounded-md p-3 overflow-x-auto font-mono text-xs">
                <pre className="text-console-text">
                  {analysisResult.candidatePatch.diff.split("\n").map((line, idx) => {
                    const isAdd = line.startsWith("+");
                    const isDel = line.startsWith("-");
                    return (
                      <div
                        key={idx}
                        className={
                          isAdd
                            ? "bg-console-success/15 text-console-success"
                            : isDel
                            ? "bg-console-danger/15 text-console-danger"
                            : "text-console-dim"
                        }
                      >
                        {line || " "}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </Card>
          )}

          {/* Regression Test Suggestions */}
          {analysisResult.suggestedTests.length > 0 && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-console-accent" />
                <h2 className="text-sm font-semibold text-console-text font-mono uppercase">
                  Suggested Regression Tests
                </h2>
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-console-muted">
                {analysisResult.suggestedTests.map((test, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-console-accent">✓</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Actions: Copy Report & PR draft */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-console-success" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={copyReport}
            >
              {copied ? "Copied Report!" : "Copy Markdown Report"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
