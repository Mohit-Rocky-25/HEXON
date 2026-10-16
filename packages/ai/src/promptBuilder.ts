import type { SourceReference } from "@repopilot/core";

export interface ContextChunk {
  filePath: string;
  startLine: number;
  endLine: number;
  content: string;
}

export class PromptBuilder {
  static buildGroundedPrompt(
    question: string,
    chunks: ContextChunk[],
    repoName: string
  ): { systemPrompt: string; userPrompt: string } {
    const systemPrompt = `You are RepoPilot, an evidence-grounded code intelligence engine.
You are analyzing the repository "${repoName}".

STRICT RULES:
1. ONLY answer based on the provided repository code snippets below.
2. If the answer cannot be determined from the code snippets, explicitly state: "Based on the indexed files, there is insufficient evidence to confirm this."
3. Every claim MUST include an exact citation in the format [file/path:startLine-endLine].
4. State any technical limitations, version boundaries, or uncertainties honestly.
5. NEVER fabricate or guess function implementations or non-existent files.`;

    const contextText = chunks
      .map(
        (c) =>
          `--- File: ${c.filePath} (Lines ${c.startLine}-${c.endLine}) ---\n${c.content}\n`
      )
      .join("\n");

    const userPrompt = `Context from indexed repository files:\n\n${contextText}\n\nUser Question: ${question}\n\nProvide an evidence-grounded explanation citing exact file paths and line ranges:`;

    return { systemPrompt, userPrompt };
  }
}
