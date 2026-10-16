import type { BugHypothesis, PatchProposal, SourceReference } from "@repopilot/core";
import type { StackFrame, ParsedTrace } from "./stackTraceParser";

export interface BugAnalysisResult {
  hypotheses: BugHypothesis[];
  candidatePatch?: PatchProposal;
  suggestedTests: string[];
  reproducibleReport: string;
}

export class HypothesisEngine {
  static analyze(
    repoKey: string,
    commitSha: string,
    issueTitle: string,
    issueDescription: string,
    parsedTrace: ParsedTrace,
    fileSnippets: Map<string, string>
  ): BugAnalysisResult {
    const hypotheses: BugHypothesis[] = [];
    const suggestedTests: string[] = [];

    // Filter frames that belong to the repository or project
    const repoFrames = parsedTrace.frames.filter((f) => f.isRepoFile || !f.filePath.includes("node_modules"));

    // Culprit frame: usually the deepest repository frame in stack trace
    const culpritFrame = repoFrames[0] || parsedTrace.frames[0];

    if (culpritFrame) {
      const snippet = fileSnippets.get(culpritFrame.filePath) || "";

      const citation: SourceReference = {
        repoKey,
        commitSha,
        filePath: culpritFrame.filePath,
        startLine: culpritFrame.lineNumber,
        endLine: culpritFrame.lineNumber + 4,
        codeSnippet: snippet
      };

      hypotheses.push({
        id: "hypo-1",
        rank: 1,
        culpritFile: culpritFrame.filePath,
        startLine: culpritFrame.lineNumber,
        endLine: culpritFrame.lineNumber + 4,
        confidence: "high",
        explanation: `Execution failure in "${culpritFrame.filePath}" at line ${culpritFrame.lineNumber}${
          culpritFrame.functionName ? ` inside "${culpritFrame.functionName}()"` : ""
        }. ${
          parsedTrace.errorMessage
            ? `Root cause matches: "${parsedTrace.errorMessage}". Probable unhandled null reference or missing guard condition.`
            : "Probable boundary violation or missing validation."
        }`,
        evidenceCitations: [citation]
      });

      // Secondary hypothesis if caller frame exists
      if (repoFrames.length > 1) {
        const caller = repoFrames[1];
        hypotheses.push({
          id: "hypo-2",
          rank: 2,
          culpritFile: caller.filePath,
          startLine: caller.lineNumber,
          endLine: caller.lineNumber + 2,
          confidence: "medium",
          explanation: `Caller "${caller.filePath}" at line ${caller.lineNumber} passed an unexpected or undefined argument to "${culpritFrame.filePath}".`,
          evidenceCitations: [
            {
              repoKey,
              commitSha,
              filePath: caller.filePath,
              startLine: caller.lineNumber,
              endLine: caller.lineNumber,
              codeSnippet: fileSnippets.get(caller.filePath) || ""
            }
          ]
        });
      }
    } else {
      hypotheses.push({
        id: "hypo-fallback",
        rank: 1,
        culpritFile: "Unknown",
        confidence: "low",
        explanation: "No stack frames directly mapped to repository files. Review external dependency versions.",
        evidenceCitations: []
      });
    }

    // Candidate Patch Proposal
    let candidatePatch: PatchProposal | undefined;
    if (culpritFrame) {
      const patchDiff = `--- a/${culpritFrame.filePath}
+++ b/${culpritFrame.filePath}
@@ -${Math.max(1, culpritFrame.lineNumber - 1)},3 +${Math.max(1, culpritFrame.lineNumber - 1)},5 @@
+  // Guard: Ensure operand is defined before property access
+  if (!target || typeof target !== "object") {
+    return undefined;
+  }
`;

      suggestedTests.push(
        `Verify "${culpritFrame.filePath}" handles null/undefined input gracefully without throwing ${
          parsedTrace.errorType || "Error"
        }.`,
        `Add regression test in tests/${culpritFrame.filePath.split("/").pop()?.replace(/\.[^.]+$/, "") || "app"}.test.ts.`
      );

      candidatePatch = {
        id: "patch-" + Date.now(),
        bugId: "bug-" + Date.now(),
        filePath: culpritFrame.filePath,
        diff: patchDiff,
        rationale: `Introduce defensive validation check at ${culpritFrame.filePath}:${culpritFrame.lineNumber} to prevent unhandled ${parsedTrace.errorType || "exceptions"}.`,
        suggestedTests,
        verificationStatus: "unverified"
      };
    }

    // Markdown Reproducible Report
    const reproducibleReport = `# Bug Investigation Report

**Target Repository**: \`${repoKey}\`
**Commit Revision**: \`${commitSha.slice(0, 7)}\`
**Issue Title**: ${issueTitle}

## Error Classification
- **Exception**: \`${parsedTrace.errorType || "Runtime Exception"}\`
- **Message**: ${parsedTrace.errorMessage || "See trace for details"}

## Culprit Identification
${hypotheses
  .map(
    (h) => `### Rank ${h.rank}: \`${h.culpritFile}:${h.startLine}\` (${h.confidence.toUpperCase()} confidence)
${h.explanation}
`
  )
  .join("\n")}

## Recommended Regression Tests
${suggestedTests.map((t) => `- [ ] ${t}`).join("\n")}

---
*Generated by RepoPilot — Evidence-Grounded Zero-Budget Code Intelligence*`;

    return {
      hypotheses,
      candidatePatch,
      suggestedTests,
      reproducibleReport
    };
  }
}
