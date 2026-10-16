import { describe, it, expect } from "vitest";
import { ArchitectureAnalyzer } from "../../packages/analysis/src/architectureAnalyzer";
import type { RepositoryFile } from "@repopilot/core";

describe("Architecture Analyzer", () => {
  const mockFiles: RepositoryFile[] = [
    {
      path: "package.json",
      size: 500,
      type: "blob",
      sha: "sha0",
      isBinary: false
    },
    {
      path: "src/index.ts",
      size: 1000,
      type: "blob",
      sha: "sha1",
      language: "TypeScript",
      isBinary: false
    },
    {
      path: "src/components/Header.tsx",
      size: 800,
      type: "blob",
      sha: "sha2",
      language: "TypeScript",
      isBinary: false
    },
    {
      path: "tests/Header.test.ts",
      size: 400,
      type: "blob",
      sha: "sha3",
      language: "TypeScript",
      isBinary: false
    }
  ];

  const mockManifest = JSON.stringify({
    dependencies: {
      react: "^18.3.0",
      next: "^14.2.0"
    },
    devDependencies: {
      vitest: "^2.0.0"
    }
  });

  it("identifies frameworks, entry points, and primary languages", () => {
    const summary = ArchitectureAnalyzer.analyze(mockFiles, mockManifest);

    expect(summary.primaryLanguage).toBe("TypeScript");
    expect(summary.detectedFrameworks).toContain("React");
    expect(summary.detectedFrameworks).toContain("Next.js");
    expect(summary.entryPoints).toContain("src/index.ts");
    expect(summary.manifestFiles).toContain("package.json");

    expect(summary.dependencies.some((d) => d.name === "react" && !d.isDev)).toBe(true);
    expect(summary.dependencies.some((d) => d.name === "vitest" && d.isDev)).toBe(true);
  });

  it("classifies module directory roles accurately", () => {
    const summary = ArchitectureAnalyzer.analyze(mockFiles, mockManifest);
    const compMod = summary.keyModules.find((m) => m.directory === "src/components");
    expect(compMod).toBeDefined();
    expect(compMod?.description).toContain("Components");
  });

  it("generates deterministic 3D spatial graph with nodes and edges", () => {
    const graph = ArchitectureAnalyzer.generateGraph(mockFiles, "test/repo");
    expect(graph.nodes.length).toBeGreaterThanOrEqual(4);
    expect(graph.edges.length).toBeGreaterThan(0);

    const rootNode = graph.nodes.find((n) => n.id === "node-root");
    expect(rootNode).toBeDefined();
    expect(rootNode?.type).toBe("root");

    const entryNode = graph.nodes.find((n) => n.path === "src/index.ts");
    expect(entryNode).toBeDefined();
    expect(entryNode?.type).toBe("entry");

    const compNode = graph.nodes.find((n) => n.path === "src/components/Header.tsx");
    expect(compNode).toBeDefined();
    expect(compNode?.type).toBe("component");
  });
});
