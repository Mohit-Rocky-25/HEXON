import { describe, it, expect } from "vitest";
import { SearchEngine } from "../../packages/search/src/searchEngine";
import type { RepositoryFile, IndexedSymbol } from "@repopilot/core";

describe("Search Engine - Deterministic Code & Symbol Search", () => {
  const mockFiles: RepositoryFile[] = [
    {
      path: "src/index.ts",
      size: 1024,
      type: "blob",
      sha: "sha1",
      language: "TypeScript",
      extension: "ts",
      isBinary: false
    },
    {
      path: "src/components/Button.tsx",
      size: 2048,
      type: "blob",
      sha: "sha2",
      language: "TypeScript",
      extension: "tsx",
      isBinary: false
    },
    {
      path: "tests/Button.test.ts",
      size: 512,
      type: "blob",
      sha: "sha3",
      language: "TypeScript",
      extension: "ts",
      isBinary: false
    }
  ];

  const mockSymbols: IndexedSymbol[] = [
    {
      id: "sym-1",
      name: "Button",
      kind: "function",
      filePath: "src/components/Button.tsx",
      startLine: 12,
      endLine: 40,
      signature: "export const Button = () =>"
    },
    {
      id: "sym-2",
      name: "calculateTotal",
      kind: "function",
      filePath: "src/index.ts",
      startLine: 5,
      endLine: 10,
      signature: "function calculateTotal()"
    }
  ];

  const engine = new SearchEngine({
    files: mockFiles,
    symbols: mockSymbols
  });

  it("finds matching files by path with higher ranking for exact filename match", () => {
    const results = engine.search({
      query: "Button",
      type: "path"
    });

    expect(results.length).toBe(2);
    expect(results[0].filePath).toContain("Button");
    expect(results[0].matchType).toBe("path");
  });

  it("finds symbols by name", () => {
    const results = engine.search({
      query: "calculateTotal",
      type: "symbol"
    });

    expect(results.length).toBe(1);
    expect(results[0].filePath).toBe("src/index.ts");
    expect(results[0].lineNumber).toBe(5);
    expect(results[0].matchType).toBe("symbol");
  });

  it("respects language and pathPrefix filters", () => {
    const results = engine.search({
      query: "Button",
      type: "all",
      pathPrefix: "tests/"
    });

    expect(results.length).toBe(1);
    expect(results[0].filePath).toBe("tests/Button.test.ts");
  });
});
