import { describe, it, expect } from "vitest";
import { extractSymbols } from "../../packages/indexer/src/symbolExtractor";

describe("Symbol Extractor - TypeScript / JavaScript", () => {
  it("extracts functions, classes, interfaces, and types with exact line numbers", () => {
    const code = `
export function calculateVelocity(points: number, days: number): number {
  return points / days;
}

export class RepositoryManager {
  constructor(public repo: string) {}
}

export interface UserConfig {
  theme: string;
}

export type Status = "active" | "inactive";
`;

    const symbols = extractSymbols("src/utils.ts", code, "TypeScript");

    expect(symbols.length).toBe(4);

    const fn = symbols.find((s) => s.name === "calculateVelocity");
    expect(fn).toBeDefined();
    expect(fn?.kind).toBe("function");
    expect(fn?.startLine).toBe(2);

    const cls = symbols.find((s) => s.name === "RepositoryManager");
    expect(cls).toBeDefined();
    expect(cls?.kind).toBe("class");
    expect(cls?.startLine).toBe(6);

    const iface = symbols.find((s) => s.name === "UserConfig");
    expect(iface).toBeDefined();
    expect(iface?.kind).toBe("interface");
    expect(iface?.startLine).toBe(10);

    const typ = symbols.find((s) => s.name === "Status");
    expect(typ).toBeDefined();
    expect(typ?.kind).toBe("type");
    expect(typ?.startLine).toBe(14);
  });
});

describe("Symbol Extractor - Python", () => {
  it("extracts def and class statements", () => {
    const pyCode = `
class DataPipeline:
    def process_records(self, data):
        pass

def standalone_helper(x, y):
    return x + y
`;

    const symbols = extractSymbols("pipeline.py", pyCode, "Python");

    expect(symbols.length).toBe(3);
    expect(symbols[0].name).toBe("DataPipeline");
    expect(symbols[0].kind).toBe("class");

    expect(symbols[1].name).toBe("process_records");
    expect(symbols[1].kind).toBe("function");

    expect(symbols[2].name).toBe("standalone_helper");
    expect(symbols[2].kind).toBe("function");
  });
});
