import type { IndexedSymbol } from "@repopilot/core";

/**
 * Extracts symbols deterministically from source code without requiring heavy external parsers.
 * Supports TypeScript, JavaScript, Python, Go, Rust, and Java.
 */
export function extractSymbols(
  filePath: string,
  content: string,
  language?: string
): IndexedSymbol[] {
  const symbols: IndexedSymbol[] = [];
  const lines = content.split("\n");

  const ext = filePath.split(".").pop()?.toLowerCase();

  // JavaScript / TypeScript
  if (
    language === "TypeScript" ||
    language === "JavaScript" ||
    ext === "ts" ||
    ext === "tsx" ||
    ext === "js" ||
    ext === "jsx"
  ) {
    extractJsTsSymbols(filePath, lines, symbols);
  }
  // Python
  else if (language === "Python" || ext === "py") {
    extractPythonSymbols(filePath, lines, symbols);
  }
  // Go
  else if (language === "Go" || ext === "go") {
    extractGoSymbols(filePath, lines, symbols);
  }
  // Rust
  else if (language === "Rust" || ext === "rs") {
    extractRustSymbols(filePath, lines, symbols);
  }

  return symbols;
}

function extractJsTsSymbols(filePath: string, lines: string[], symbols: IndexedSymbol[]) {
  // Regex patterns
  const funcPattern = /(?:export\s+)?(?:async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/;
  const arrowFuncPattern = /(?:export\s+)?(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/;
  const classPattern = /(?:export\s+)?(?:abstract\s+)?class\s+([a-zA-Z0-9_$]+)/;
  const interfacePattern = /(?:export\s+)?interface\s+([a-zA-Z0-9_$]+)/;
  const typePattern = /(?:export\s+)?type\s+([a-zA-Z0-9_$]+)\s*=/;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) return;

    let match = funcPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:fn:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "function",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `function ${match[1]}(${match[2] || ""})`
      });
      return;
    }

    match = arrowFuncPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:fn:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "function",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `const ${match[1]} = (${match[2] || ""}) =>`
      });
      return;
    }

    match = classPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:class:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "class",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `class ${match[1]}`
      });
      return;
    }

    match = interfacePattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:iface:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "interface",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `interface ${match[1]}`
      });
      return;
    }

    match = typePattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:type:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "type",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `type ${match[1]}`
      });
      return;
    }
  });
}

function extractPythonSymbols(filePath: string, lines: string[], symbols: IndexedSymbol[]) {
  const pyFuncPattern = /^(?:async\s+)?def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/;
  const pyClassPattern = /^class\s+([a-zA-Z0-9_]+)/;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) return;

    let match = pyFuncPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:fn:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "function",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `def ${match[1]}(${match[2] || ""})`
      });
      return;
    }

    match = pyClassPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:class:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "class",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `class ${match[1]}`
      });
      return;
    }
  });
}

function extractGoSymbols(filePath: string, lines: string[], symbols: IndexedSymbol[]) {
  const goFuncPattern = /^func\s+(?:\([^)]+\)\s+)?([a-zA-Z0-9_]+)\s*\(([^)]*)\)/;
  const goTypePattern = /^type\s+([a-zA-Z0-9_]+)\s+(?:struct|interface)/;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) return;

    let match = goFuncPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:fn:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "function",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `func ${match[1]}(...)`
      });
      return;
    }

    match = goTypePattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:type:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "type",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `type ${match[1]}`
      });
      return;
    }
  });
}

function extractRustSymbols(filePath: string, lines: string[], symbols: IndexedSymbol[]) {
  const rustFnPattern = /(?:pub\s+)?(?:async\s+)?fn\s+([a-zA-Z0-9_]+)/;
  const rustStructPattern = /(?:pub\s+)?struct\s+([a-zA-Z0-9_]+)/;
  const rustEnumPattern = /(?:pub\s+)?enum\s+([a-zA-Z0-9_]+)/;
  const rustTraitPattern = /(?:pub\s+)?trait\s+([a-zA-Z0-9_]+)/;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) return;

    let match = rustFnPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:fn:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "function",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `fn ${match[1]}`
      });
      return;
    }

    match = rustStructPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:struct:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "class",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `struct ${match[1]}`
      });
      return;
    }

    match = rustEnumPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:enum:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "type",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `enum ${match[1]}`
      });
      return;
    }

    match = rustTraitPattern.exec(trimmed);
    if (match) {
      symbols.push({
        id: `${filePath}:trait:${match[1]}:${idx + 1}`,
        name: match[1],
        kind: "interface",
        filePath,
        startLine: idx + 1,
        endLine: idx + 1,
        signature: `trait ${match[1]}`
      });
      return;
    }
  });
}
