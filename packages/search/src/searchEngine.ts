import type {
  RepositoryFile,
  IndexedSymbol,
  SearchQuery,
  SearchResult
} from "@repopilot/core";

export interface SearchCorpus {
  files: RepositoryFile[];
  symbols: IndexedSymbol[];
  fileContents?: Map<string, string>;
}

export class SearchEngine {
  constructor(private corpus: SearchCorpus) {}

  search(queryObj: SearchQuery): SearchResult[] {
    const { query, type = "all", pathPrefix, language, caseSensitive = false, limit = 30 } =
      queryObj;
    const q = caseSensitive ? query : query.toLowerCase();

    const results: SearchResult[] = [];

    // Filter files based on pathPrefix and language
    const eligibleFiles = this.corpus.files.filter((file) => {
      if (pathPrefix && !file.path.startsWith(pathPrefix)) return false;
      if (language && file.language?.toLowerCase() !== language.toLowerCase()) return false;
      return true;
    });

    const eligibleFilePaths = new Set(eligibleFiles.map((f) => f.path));

    // 1. Search File Paths
    if (type === "all" || type === "path") {
      for (const file of eligibleFiles) {
        const target = caseSensitive ? file.path : file.path.toLowerCase();
        if (target.includes(q)) {
          // Calculate score based on exact match vs directory match
          const score = target.endsWith("/" + q) || target === q ? 100 : 70;
          results.push({
            filePath: file.path,
            lineNumber: 1,
            matchType: "path",
            previewText: file.path,
            score
          });
        }
      }
    }

    // 2. Search Symbols
    if (type === "all" || type === "symbol") {
      for (const sym of this.corpus.symbols) {
        if (!eligibleFilePaths.has(sym.filePath)) continue;

        const name = caseSensitive ? sym.name : sym.name.toLowerCase();
        if (name.includes(q)) {
          const score = name === q ? 95 : 80;
          results.push({
            filePath: sym.filePath,
            lineNumber: sym.startLine,
            matchType: "symbol",
            previewText: sym.signature || `${sym.kind} ${sym.name}`,
            symbolKind: sym.kind,
            score
          });
        }
      }
    }

    // 3. Search Raw Text in fileContents (if available)
    if ((type === "all" || type === "text") && this.corpus.fileContents) {
      for (const [filePath, content] of this.corpus.fileContents.entries()) {
        if (!eligibleFilePaths.has(filePath)) continue;

        const lines = content.split("\n");
        lines.forEach((line, idx) => {
          const targetLine = caseSensitive ? line : line.toLowerCase();
          if (targetLine.includes(q)) {
            // Trim preview line
            const previewText = line.trim();
            results.push({
              filePath,
              lineNumber: idx + 1,
              matchType: "exact",
              previewText,
              score: 60
            });
          }
        });
      }
    }

    // Sort by score descending, then by file path
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.filePath.localeCompare(b.filePath);
    });

    return results.slice(0, limit);
  }
}
