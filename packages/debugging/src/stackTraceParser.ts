export interface StackFrame {
  raw: string;
  filePath: string;
  lineNumber: number;
  columnNumber?: number;
  functionName?: string;
  isRepoFile: boolean;
}

export interface ParsedTrace {
  errorType?: string;
  errorMessage?: string;
  frames: StackFrame[];
}

export class StackTraceParser {
  static parse(traceText: string, repoFilePaths: string[] = []): ParsedTrace {
    const lines = traceText.split("\n");
    const frames: StackFrame[] = [];
    let errorType: string | undefined;
    let errorMessage: string | undefined;

    const repoPathSet = new Set(repoFilePaths);

    // Node.js pattern: at Object.<anonymous> (src/app/api/auth.ts:42:15) or at render (components/Button.tsx:18:5)
    const nodePattern = /^\s*at\s+(?:([a-zA-Z0-9_$.<>]+)\s+\()?([a-zA-Z0-9_\-./\\]+\.[a-zA-Z0-9]+):(\d+):(\d+)\)?$/;

    // Python pattern: File "src/pipeline.py", line 42, in process_data
    const pyPattern = /^\s*File\s+"([a-zA-Z0-9_\-./\\]+\.py)",\s+line\s+(\d+)(?:,\s+in\s+([a-zA-Z0-9_]+))?$/;

    // Go pattern: /path/to/main.go:85 +0x1a
    const goPattern = /^\s*([a-zA-Z0-9_\-./\\]+\.go):(\d+)(?:\s+\+0x[0-9a-fA-F]+)?$/;

    for (const rawLine of lines) {
      const line = rawLine.trim();

      // Check for error header e.g. TypeError: Cannot read properties of undefined
      if (!errorType && line.includes(":")) {
        const parts = line.split(":");
        if (parts[0].endsWith("Error") || parts[0].endsWith("Exception")) {
          errorType = parts[0].trim();
          errorMessage = parts.slice(1).join(":").trim();
          continue;
        }
      }

      // Helper to resolve and match relative repo path
      const resolveRepoPath = (rawPath: string): { resolvedPath: string; isRepo: boolean } => {
        const normalized = rawPath.replace(/\\/g, "/");
        if (repoPathSet.has(normalized)) {
          return { resolvedPath: normalized, isRepo: true };
        }
        const matching = repoFilePaths.find((p) => normalized.endsWith(p) || p.endsWith(normalized));
        if (matching) {
          return { resolvedPath: matching, isRepo: true };
        }
        return { resolvedPath: normalized, isRepo: false };
      };

      // 1. Try Node.js
      let match = nodePattern.exec(line);
      if (match) {
        const fnName = match[1] || undefined;
        const rawFilePath = match[2];
        const lineNum = parseInt(match[3], 10);
        const colNum = parseInt(match[4], 10);
        const { resolvedPath, isRepo } = resolveRepoPath(rawFilePath);

        frames.push({
          raw: line,
          filePath: resolvedPath,
          lineNumber: lineNum,
          columnNumber: colNum,
          functionName: fnName,
          isRepoFile: isRepo
        });
        continue;
      }

      // 2. Try Python
      match = pyPattern.exec(line);
      if (match) {
        const rawFilePath = match[1];
        const lineNum = parseInt(match[2], 10);
        const fnName = match[3] || undefined;
        const { resolvedPath, isRepo } = resolveRepoPath(rawFilePath);

        frames.push({
          raw: line,
          filePath: resolvedPath,
          lineNumber: lineNum,
          functionName: fnName,
          isRepoFile: isRepo
        });
        continue;
      }

      // 3. Try Go
      match = goPattern.exec(line);
      if (match) {
        const rawFilePath = match[1];
        const lineNum = parseInt(match[2], 10);
        const { resolvedPath, isRepo } = resolveRepoPath(rawFilePath);

        frames.push({
          raw: line,
          filePath: resolvedPath,
          lineNumber: lineNum,
          isRepoFile: isRepo
        });
        continue;
      }
    }

    return {
      errorType,
      errorMessage,
      frames
    };
  }
}
