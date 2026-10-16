import { describe, it, expect } from "vitest";
import { StackTraceParser } from "../../packages/debugging/src/stackTraceParser";

describe("Stack Trace Parser", () => {
  it("parses Node.js stack traces with error type and file lines", () => {
    const trace = `TypeError: Cannot read properties of undefined (reading 'items')
    at renderDashboard (src/components/Dashboard.tsx:42:18)
    at App (src/app/page.tsx:28:12)`;

    const parsed = StackTraceParser.parse(trace, [
      "src/components/Dashboard.tsx",
      "src/app/page.tsx"
    ]);

    expect(parsed.errorType).toBe("TypeError");
    expect(parsed.errorMessage).toBe("Cannot read properties of undefined (reading 'items')");
    expect(parsed.frames.length).toBe(2);

    expect(parsed.frames[0].filePath).toBe("src/components/Dashboard.tsx");
    expect(parsed.frames[0].lineNumber).toBe(42);
    expect(parsed.frames[0].functionName).toBe("renderDashboard");
    expect(parsed.frames[0].isRepoFile).toBe(true);
  });

  it("parses Python tracebacks with line numbers and functions", () => {
    const pyTrace = `Traceback (most recent call last):
  File "src/server.py", line 18, in handle_request
  File "src/services/auth.py", line 45, in verify_token
KeyError: 'user_id'`;

    const parsed = StackTraceParser.parse(pyTrace, ["src/server.py", "src/services/auth.py"]);

    expect(parsed.errorType).toBe("KeyError");
    expect(parsed.errorMessage).toBe("'user_id'");
    expect(parsed.frames.length).toBe(2);

    expect(parsed.frames[0].filePath).toBe("src/server.py");
    expect(parsed.frames[0].lineNumber).toBe(18);

    expect(parsed.frames[1].filePath).toBe("src/services/auth.py");
    expect(parsed.frames[1].lineNumber).toBe(45);
  });
});
