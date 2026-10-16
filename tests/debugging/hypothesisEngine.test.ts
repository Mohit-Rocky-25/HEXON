import { describe, it, expect } from "vitest";
import { HypothesisEngine } from "../../packages/debugging/src/hypothesisEngine";
import type { ParsedTrace } from "../../packages/debugging/src/stackTraceParser";

describe("Hypothesis Engine", () => {
  it("ranks culprit files, produces minimal patch diffs, and reproducible reports", () => {
    const parsedTrace: ParsedTrace = {
      errorType: "TypeError",
      errorMessage: "Cannot read property of undefined",
      frames: [
        {
          raw: "at render (src/components/Dashboard.tsx:42:10)",
          filePath: "src/components/Dashboard.tsx",
          lineNumber: 42,
          isRepoFile: true
        }
      ]
    };

    const snippets = new Map<string, string>();
    snippets.set("src/components/Dashboard.tsx", "const val = items.length;");

    const analysis = HypothesisEngine.analyze(
      "test/repo",
      "abcdef123456",
      "Dashboard Crash",
      "Crash on mount",
      parsedTrace,
      snippets
    );

    expect(analysis.hypotheses.length).toBe(1);
    expect(analysis.hypotheses[0].rank).toBe(1);
    expect(analysis.hypotheses[0].culpritFile).toBe("src/components/Dashboard.tsx");
    expect(analysis.hypotheses[0].confidence).toBe("high");

    expect(analysis.candidatePatch).toBeDefined();
    expect(analysis.candidatePatch?.diff).toContain("--- a/src/components/Dashboard.tsx");
    expect(analysis.candidatePatch?.diff).toContain("+++ b/src/components/Dashboard.tsx");

    expect(analysis.reproducibleReport).toContain("# Bug Investigation Report");
    expect(analysis.reproducibleReport).toContain("TypeError");
  });
});
