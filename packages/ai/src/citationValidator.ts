import type { SourceReference, RepositoryFile } from "@repopilot/core";

export interface ParsedCitation {
  filePath: string;
  startLine: number;
  endLine: number;
  isValid: boolean;
  reason?: string;
}

export class CitationValidator {
  /**
   * Extracts citations in format [path/to/file:10-25] or [path/to/file:10] from text
   */
  static extractCitations(text: string): { filePath: string; startLine: number; endLine: number }[] {
    const citations: { filePath: string; startLine: number; endLine: number }[] = [];
    const regex = /\[([a-zA-Z0-9_\-./]+):(\d+)(?:-(\d+))?\]/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const filePath = match[1];
      const startLine = parseInt(match[2], 10);
      const endLine = match[3] ? parseInt(match[3], 10) : startLine;

      citations.push({ filePath, startLine, endLine });
    }

    return citations;
  }

  /**
   * Validates citations against the actual repository tree.
   */
  static validate(
    extracted: { filePath: string; startLine: number; endLine: number }[],
    validFiles: RepositoryFile[]
  ): ParsedCitation[] {
    const fileMap = new Map<string, RepositoryFile>();
    for (const f of validFiles) {
      fileMap.set(f.path, f);
    }

    return extracted.map((cit) => {
      const file = fileMap.get(cit.filePath);
      if (!file) {
        return {
          ...cit,
          isValid: false,
          reason: `File "${cit.filePath}" does not exist in the indexed repository revision.`
        };
      }

      if (cit.startLine < 1 || cit.endLine < cit.startLine) {
        return {
          ...cit,
          isValid: false,
          reason: `Invalid line range ${cit.startLine}-${cit.endLine}.`
        };
      }

      return {
        ...cit,
        isValid: true
      };
    });
  }
}
