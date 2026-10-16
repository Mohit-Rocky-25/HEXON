import { describe, it, expect } from "vitest";
import { ExecutionPolicy, DEFAULT_EXECUTION_POLICY } from "../../packages/execution/src/executionPolicy";

describe("Execution Policy & Safety Sandbox", () => {
  it("defaults to execution disabled for safety", () => {
    expect(DEFAULT_EXECUTION_POLICY.executionEnabled).toBe(false);
    expect(DEFAULT_EXECUTION_POLICY.allowNetwork).toBe(false);
  });

  it("generates verified Node.js manual reproduction steps", () => {
    const plan = ExecutionPolicy.generateReproductionPlan("facebook/react", "abcdef123456", "TypeScript");

    expect(plan.environment).toBe("Node.js");
    expect(plan.commands).toContain("git clone https://github.com/facebook/react.git");
    expect(plan.commands).toContain("git checkout abcdef1");
    expect(plan.commands).toContain("npm test");
    expect(plan.safetyNotes.length).toBeGreaterThan(0);
  });

  it("generates verified Python reproduction steps with virtual environment", () => {
    const plan = ExecutionPolicy.generateReproductionPlan("pallets/flask", "1234567890ab", "Python");

    expect(plan.environment).toBe("Python");
    expect(plan.commands.some((c) => c.includes("venv"))).toBe(true);
    expect(plan.commands).toContain("pytest");
  });
});
