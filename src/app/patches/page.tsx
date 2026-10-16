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
  ExternalLink
} from "lucide-react";
import { useRepository } from "@/context/RepositoryContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PatchesPage() {
  const { currentRepo, setIsImportModalOpen } = useRepository();
  const [copied, setCopied] = useState(false);

  const sampleDiff = `--- a/src/components/Dashboard.tsx
+++ b/src/components/Dashboard.tsx
@@ -40,3 +40,7 @@ export function Dashboard({ items }) {
+  // Guard against undefined or empty items array
+  if (!items || !Array.isArray(items)) {
+    return <div className="text-muted">No items available to render.</div>;
+  }
   return (
     <div className="grid">
`;

  const prDraft = `## Description
This pull request addresses an unhandled TypeError occurring during dashboard rendering when the items collection is not yet initialized.

## Proposed Changes
- Added defensive array validation guard in \`src/components/Dashboard.tsx:42\`.
- Prevents runtime crash and gracefully presents fallback UI.

## Regression Testing
- Verified with empty items: Component renders fallback state.
- Verified with valid array: Component renders grid without error.

---
*Created with RepoPilot — Zero-Budget Open-Source Code Intelligence*`;

  const copyPR = () => {
    navigator.clipboard.writeText(prDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentRepo) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto my-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-console-accent/15 border border-console-accent/40 flex items-center justify-center text-console-accent mx-auto">
          <GitPullRequest className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-console-text">
            No Active Repository
          </h2>
          <p className="text-xs text-console-muted mt-1 leading-relaxed">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-console-border gap-2">
        <div>
          <h1 className="text-lg font-semibold text-console-text font-mono flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-console-accent" />
            <span>Patch Review & Pull Request Export</span>
          </h1>
          <p className="text-xs text-console-muted mt-0.5">
            Review candidate minimal unified diffs and prepare reproducible PR drafts for {currentRepo.owner}/{currentRepo.repo}.
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Human Review Required
        </Badge>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-lg bg-console-subtle border border-console-border flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-console-warning shrink-0 mt-0.5" />
        <div className="text-xs font-mono space-y-1">
          <span className="text-console-text font-semibold block">
            Zero-Budget Security Policy: No Arbitrary Auto-Patch Execution
          </span>
          <p className="text-console-muted leading-relaxed">
            In adherence to strict open-source security standards, RepoPilot does not execute or apply patches directly to arbitrary repositories without user oversight. Review the proposed diff below, run your tests locally, and export the PR draft.
          </p>
        </div>
      </div>

      {/* Candidate Patch Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-console-accent" />
            <span className="text-sm font-semibold text-console-text font-mono">
              src/components/Dashboard.tsx
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm">
              +4 lines
            </Badge>
            <Badge variant="warning" size="sm">
              Status: UNVERIFIED
            </Badge>
          </div>
        </div>

        {/* Unified Diff Box */}
        <div className="bg-[#07090e] border border-console-border rounded-md p-3 overflow-x-auto font-mono text-xs">
          <pre className="text-console-text">
            {sampleDiff.split("\n").map((line, idx) => {
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

        {/* PR Export Card */}
        <div className="pt-3 border-t border-console-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-console-text">
              Generated Pull Request Draft
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check className="w-3.5 h-3.5 text-console-success" /> : <Copy className="w-3.5 h-3.5" />}
              onClick={copyPR}
            >
              {copied ? "Copied PR Draft!" : "Copy PR Draft"}
            </Button>
          </div>

          <div className="bg-console-subtle p-3 rounded border border-console-border font-mono text-xs text-console-muted whitespace-pre-wrap leading-relaxed">
            {prDraft}
          </div>
        </div>
      </Card>
    </div>
  );
}
