import { describe, it, expect } from "vitest";
import { PromptBuilder } from "../../packages/ai/src/promptBuilder";

describe("Prompt Builder", () => {
  it("constructs bounded context prompts with exact line boundaries and strict grounding rules", () => {
    const chunks = [
      {
        filePath: "src/server.ts",
        startLine: 1,
        endLine: 25,
        content: "const app = express();\napp.listen(3000);"
      }
    ];

    const { systemPrompt, userPrompt } = PromptBuilder.buildGroundedPrompt(
      "How is the server started?",
      chunks,
      "test/repo"
    );

    expect(systemPrompt).toContain("STRICT RULES");
    expect(systemPrompt).toContain("ONLY answer based on the provided repository code");
    expect(userPrompt).toContain("src/server.ts (Lines 1-25)");
    expect(userPrompt).toContain("app.listen(3000)");
  });
});
