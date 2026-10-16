import { describe, it, expect } from "vitest";
import { CitationValidator } from "../../packages/ai/src/citationValidator";
import type { RepositoryFile } from "@repopilot/core";

describe("Citation Validator", () => {
  const validFiles: RepositoryFile[] = [
    {
      path: "src/index.ts",
      size: 500,
      type: "blob",
      sha: "sha1",
      isBinary: false
    },
    {
      path: "src/utils.ts",
      size: 300,
      type: "blob",
      sha: "sha2",
      isBinary: false
    }
  ];

  it("extracts formatted citations from model output", () => {
    const text =
      "Initialization occurs in [src/index.ts:1-20] while helper functions are in [src/utils.ts:45].";

    const extracted = CitationValidator.extractCitations(text);
    expect(extracted.length).toBe(2);

    expect(extracted[0].filePath).toBe("src/index.ts");
    expect(extracted[0].startLine).toBe(1);
    expect(extracted[0].endLine).toBe(20);

    expect(extracted[1].filePath).toBe("src/utils.ts");
    expect(extracted[1].startLine).toBe(45);
    expect(extracted[1].endLine).toBe(45);
  });

  it("validates existing files and flags hallucinated citations", () => {
    const citations = [
      { filePath: "src/index.ts", startLine: 5, endLine: 10 },
      { filePath: "fake/nonexistent.ts", startLine: 1, endLine: 10 }
    ];

    const validated = CitationValidator.validate(citations, validFiles);

    expect(validated[0].isValid).toBe(true);
    expect(validated[1].isValid).toBe(false);
    expect(validated[1].reason).toContain("does not exist");
  });
});
