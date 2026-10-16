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
  FolderTree,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { PatchProposal } from "@repopilot/core";

export default function PatchesPage() {
  const { currentRepo, setIsImportModalOpen } = useRepository();
  const [copied, setCopied] = useState(false);
  const [activePatch, setActivePatch] = useState<PatchProposal | null>(null);

  const copyPR = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        <Badge variant="neutral" size="sm">
          Human Review Required
        </Badge>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-white border border-stone-200 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="text-stone-900 font-semibold block">
            Zero-Budget Security Policy: No Arbitrary Auto-Patch Execution
          </span>
          <p className="text-stone-600 leading-relaxed">
            In adherence to strict open-source developer safety standards, RepoPilot does not execute or apply patches directly to arbitrary repositories without user oversight. Review the proposed diff, run your tests locally, and export the PR draft.
          </p>
        </div>
      </div>

      {/* Real Active Patch OR Intentional Empty State (Zero Fake Data) */}
      {activePatch ? (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#F55036]" />
              <span className="text-sm font-semibold text-stone-900 font-mono">
                {activePatch.filePath}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">
                Status: UNVERIFIED CANDIDATE
              </Badge>
            </div>
          </div>

          <p className="text-xs text-stone-600">
            {activePatch.rationale}
          </p>

          {/* Unified Diff Box */}
          <div className="bg-[#FAFAF9] border border-stone-200 rounded-md p-3 overflow-x-auto font-mono text-xs">
            <pre className="text-stone-900 leading-relaxed">
              {activePatch.diff.split("\n").map((line, idx) => {
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

          {/* PR Export Card */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-stone-900">
                Generated Pull Request Draft
              </span>
              <Button
                variant="secondary"
                size="sm"
                icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => copyPR(activePatch.diff)}
              >
                {copied ? "Copied Diff!" : "Copy Diff"}
              </Button>
            </div>
          </div>
        </Card>
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
