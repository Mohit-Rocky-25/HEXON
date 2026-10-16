"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  CheckCircle2,
  FileCode,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Trash2,
  GitCommit,
  Clock
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PatchesPage() {
  const { currentRepo, activeInvestigation, setActiveInvestigation, setIsImportModalOpen } = useRepository();
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [copiedPR, setCopiedPR] = useState(false);

  const copyDiff = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDiff(true);
    setTimeout(() => setCopiedDiff(false), 2000);
  };

  const copyPRMarkdown = (markdown: string) => {
    navigator.clipboard.writeText(markdown);
    setCopiedPR(true);
    setTimeout(() => setCopiedPR(false), 2000);
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F55036] mx-auto">
          <GitPullRequest className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-900">
            No Active Repository
          </h2>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Import a public GitHub repository to review proposed candidate diffs, regression test recommendations, and export reproducible PR drafts.
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

  // Generate reproducible PR markdown draft if candidate patch exists
  const candidate = activeInvestigation?.candidatePatch;
  const prDraft = activeInvestigation && candidate
    ? `### Summary of Changes
This pull request addresses the runtime exception discovered during investigation:
**${activeInvestigation.title}**

### Root Cause Analysis
${activeInvestigation.hypotheses?.[0]?.explanation || "Unchecked property access or boundary error identified during stack trace parsing."}

### Target File
\`${candidate.filePath}\`

### Proposed Unified Diff
\`\`\`diff
${candidate.diff}
\`\`\`

### Verification & Regression Tests
${activeInvestigation.suggestedTests?.map(t => `- [ ] ${t}`).join("\n") || "- [ ] Verify fix locally"}

---
*Generated autonomously by [RepoPilot](https://github.com/Mohit-Rocky-25/RepoPilot) Codebase Intelligence.*`
    : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
        <div>
          <h1 className="text-lg font-semibold text-stone-900 font-mono flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-[#F55036]" />
            <span>Patch Review & Pull Request Export</span>
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Review candidate minimal unified diffs and prepare reproducible PR drafts for {currentRepo.owner}/{currentRepo.repo}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeInvestigation && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5 text-stone-500" />}
              onClick={() => setActiveInvestigation(null)}
            >
              Clear Candidate
            </Button>
          )}
          <Badge variant="neutral" size="sm">
            Human Review Required
          </Badge>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-white border border-stone-200 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="text-stone-900 font-semibold block">
            Zero-Budget Security Policy: No Arbitrary Auto-Patch Execution
          </span>
          <p className="text-stone-600 leading-relaxed">
            In adherence to strict open-source developer safety standards, RepoPilot does not execute or apply patches directly to arbitrary repositories without explicit human approval. Review the proposed diff, run the suggested regression tests locally, and submit via GitHub PR.
          </p>
        </div>
      </div>

      {/* Active Investigation Handoff Card */}
      {activeInvestigation && candidate ? (
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    Active Candidate Patch
                  </Badge>
                  <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(activeInvestigation.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-stone-900 font-mono mt-1">
                  {activeInvestigation.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
                <GitCommit className="w-3.5 h-3.5 text-stone-400" />
                <span>Commit: {activeInvestigation.commitSha.slice(0, 7)}</span>
              </div>
            </div>

            {activeInvestigation.hypotheses?.[0] && (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-md space-y-1 font-mono text-xs">
                <span className="text-stone-900 font-semibold block">
                  Root Cause Rationale:
                </span>
                <p className="text-stone-600 leading-relaxed">
                  {activeInvestigation.hypotheses[0].explanation}
                </p>
              </div>
            )}
          </Card>

          {/* Unified Diff View */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#F55036]" />
                <span className="text-sm font-semibold text-stone-900 font-mono">
                  {candidate.filePath}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/explore?file=${encodeURIComponent(candidate.filePath)}`}
                  className="text-xs font-mono text-[#F55036] hover:underline flex items-center gap-1"
                >
                  <span>Open Source File</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Badge variant="warning" size="sm">
                  Candidate Diff
                </Badge>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              {candidate.rationale}
            </p>

            <div className="bg-[#FAFAF9] border border-stone-200 rounded-md p-3 overflow-x-auto font-mono text-xs">
              <pre className="text-stone-900 leading-relaxed">
                {candidate.diff.split("\n").map((line, idx) => {
                  const isAdd = line.startsWith("+");
                  const isDel = line.startsWith("-");
                  return (
                    <div
                      key={idx}
                      className={
                        isAdd
                          ? "bg-emerald-50 text-emerald-800 font-medium px-1 rounded-xs"
                          : isDel
                          ? "bg-red-50 text-red-800 font-medium px-1 rounded-xs"
                          : "text-stone-600"
                      }
                    >
                      {line || " "}
                    </div>
                  );
                })}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                icon={copiedDiff ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => copyDiff(candidate.diff)}
              >
                {copiedDiff ? "Copied Diff!" : "Copy Unified Diff"}
              </Button>
            </div>
          </Card>

          {/* Suggested Regression Tests */}
          {activeInvestigation.suggestedTests && activeInvestigation.suggestedTests.length > 0 && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F55036]" />
                <h2 className="text-sm font-semibold text-stone-900 font-mono uppercase">
                  Required Regression Verification
                </h2>
              </div>
              <ul className="space-y-1.5 font-mono text-xs text-stone-600">
                {activeInvestigation.suggestedTests.map((test, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#F55036] font-bold">✓</span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Pull Request Draft Markdown Export */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-[#F55036]" />
                <h2 className="text-sm font-semibold text-stone-900 font-mono uppercase">
                  Reproducible Pull Request Draft
                </h2>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={copiedPR ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => copyPRMarkdown(prDraft)}
              >
                {copiedPR ? "Copied PR Draft!" : "Copy PR Markdown Draft"}
              </Button>
            </div>

            <div className="bg-[#FAFAF9] border border-stone-200 rounded-md p-3 font-mono text-xs text-stone-700 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
              {prDraft}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 mx-auto">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-semibold text-stone-900 font-mono">
                No Candidate Patches Formulated Yet
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed max-w-lg mx-auto">
                Candidate patches are generated dynamically during bug investigation. Paste an exception log or stack trace from {currentRepo.owner}/{currentRepo.repo} into the Bug Investigation workspace to correlate source lines, formulate root causes, and propose a minimal unified diff.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/debugging">
                <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                  Launch Bug Investigation
                </Button>
              </Link>
            </div>
          </Card>

          {/* Workflow Guide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
            <Card className="p-4 space-y-2">
              <div className="text-xs font-mono text-[#F55036] font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>1. Correlate Traces</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Stack frames are parsed and mapped to exact indexed file paths and line numbers in the pinned repository commit.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="text-xs font-mono text-[#F55036] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Formulate Hypotheses</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ranked hypotheses identify missing null guards, unhandled keys, or broken module imports based on source evidence.
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <div className="text-xs font-mono text-[#F55036] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3. Human-Reviewed PR</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Candidate diffs and regression testing procedures are exported directly into markdown for submission to GitHub PRs.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
