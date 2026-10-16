import type { RepositoryFile, ArchitectureSummary } from "@repopilot/core";

export class ArchitectureAnalyzer {
  static analyze(files: RepositoryFile[], manifestContent?: string): ArchitectureSummary {
    const frameworks = new Set<string>();
    const entryPoints: string[] = [];
    const manifestFiles: string[] = [];
    const dependencies: { name: string; version?: string; isDev?: boolean }[] = [];

    // Tally languages
    const langCounts = new Map<string, number>();
    for (const f of files) {
      if (f.language) {
        langCounts.set(f.language, (langCounts.get(f.language) || 0) + 1);
      }
    }

    let topLang = "Unknown";
    let maxCount = 0;
    for (const [lang, count] of langCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        topLang = lang;
      }
    }

    // Identify entry points
    const ENTRY_CANDIDATES = new Set([
      "src/index.ts",
      "src/index.js",
      "src/main.ts",
      "src/main.js",
      "src/app/page.tsx",
      "src/app/layout.tsx",
      "app/page.tsx",
      "pages/index.tsx",
      "pages/index.js",
      "index.html",
      "index.js",
      "main.py",
      "app.py",
      "wsgi.py",
      "asgi.py",
      "main.go",
      "cmd/main.go",
      "src/main.rs",
      "src/lib.rs"
    ]);

    for (const file of files) {
      if (ENTRY_CANDIDATES.has(file.path.toLowerCase())) {
        entryPoints.push(file.path);
      }

      // Check config / manifest files
      const baseName = file.path.split("/").pop()?.toLowerCase();
      if (
        baseName === "package.json" ||
        baseName === "tsconfig.json" ||
        baseName === "requirements.txt" ||
        baseName === "pyproject.toml" ||
        baseName === "cargo.toml" ||
        baseName === "go.mod" ||
        baseName === "dockerfile" ||
        baseName === "docker-compose.yml" ||
        baseName === "vite.config.ts" ||
        baseName === "next.config.mjs" ||
        baseName === "next.config.js"
      ) {
        manifestFiles.push(file.path);
      }
    }

    // Inspect manifestContent (e.g. package.json)
    if (manifestContent) {
      try {
        const pkg = JSON.parse(manifestContent);
        const deps = pkg.dependencies || {};
        const devDeps = pkg.devDependencies || {};

        const allDepKeys = Object.keys(deps).concat(Object.keys(devDeps));

        if (allDepKeys.includes("react")) frameworks.add("React");
        if (allDepKeys.includes("next")) frameworks.add("Next.js");
        if (allDepKeys.includes("vue")) frameworks.add("Vue");
        if (allDepKeys.includes("svelte")) frameworks.add("Svelte");
        if (allDepKeys.includes("express")) frameworks.add("Express");
        if (allDepKeys.includes("fastify")) frameworks.add("Fastify");
        if (allDepKeys.includes("tailwindcss")) frameworks.add("Tailwind CSS");
        if (allDepKeys.includes("vitest")) frameworks.add("Vitest");
        if (allDepKeys.includes("jest")) frameworks.add("Jest");

        for (const [dep, ver] of Object.entries(deps)) {
          dependencies.push({ name: dep, version: String(ver), isDev: false });
        }
        for (const [dep, ver] of Object.entries(devDeps)) {
          dependencies.push({ name: dep, version: String(ver), isDev: true });
        }
      } catch (e) {
        // Not JSON, could be requirements.txt or go.mod
        if (manifestContent.includes("flask")) frameworks.add("Flask");
        if (manifestContent.includes("django")) frameworks.add("Django");
        if (manifestContent.includes("fastapi")) frameworks.add("FastAPI");
        if (manifestContent.includes("gin-gonic")) frameworks.add("Gin");
        if (manifestContent.includes("actix")) frameworks.add("Actix");
      }
    }

    // Infer modules from directory hierarchy
    const dirMap = new Map<string, number>();
    for (const f of files) {
      const parts = f.path.split("/");
      if (parts.length > 1) {
        const topDir = parts[0] === "src" && parts.length > 2 ? `src/${parts[1]}` : parts[0];
        dirMap.set(topDir, (dirMap.get(topDir) || 0) + 1);
      }
    }

    const keyModules = Array.from(dirMap.entries())
      .filter(([dir]) => !dir.startsWith("."))
      .map(([dir, count]) => ({
        directory: dir,
        description: getModuleDescription(dir),
        fileCount: count
      }))
      .sort((a, b) => b.fileCount - a.fileCount);

    return {
      primaryLanguage: topLang,
      detectedFrameworks: Array.from(frameworks),
      entryPoints,
      manifestFiles,
      keyModules,
      dependencies: dependencies.slice(0, 50)
    };
  }
}

function getModuleDescription(dir: string): string {
  const lower = dir.toLowerCase();
  if (lower.includes("component")) return "UI Presentational & Interactive Components";
  if (lower.includes("hook")) return "Custom React State & Lifecycle Hooks";
  if (lower.includes("api") || lower.includes("route")) return "Server API Endpoints & Route Handlers";
  if (lower.includes("lib") || lower.includes("util")) return "Shared Helper Functions & Utilities";
  if (lower.includes("test")) return "Test Suites & Mock Fixtures";
  if (lower.includes("doc")) return "Documentation & Guides";
  if (lower.includes("style")) return "Design System, CSS & Theme Tokens";
  if (lower.includes("package")) return "Modular Packages & Domain Libraries";
  if (lower.includes("core")) return "Core Domain Models & Business Logic";
  return "Module directory";
}
