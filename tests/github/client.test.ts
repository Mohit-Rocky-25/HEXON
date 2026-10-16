import { describe, it, expect, beforeEach } from "vitest";
import { parseGitHubUrl, gitHubCache } from "../../packages/github/src";

describe("GitHub Module - URL Validator", () => {
  it("correctly extracts owner and repository from valid URLs", () => {
    const res1 = parseGitHubUrl("https://github.com/facebook/react");
    expect(res1.owner).toBe("facebook");
    expect(res1.repo).toBe("react");

    const res2 = parseGitHubUrl("https://github.com/pallets/flask.git");
    expect(res2.owner).toBe("pallets");
    expect(res2.repo).toBe("flask");

    const res3 = parseGitHubUrl("https://github.com/fastapi/fastapi/");
    expect(res3.owner).toBe("fastapi");
    expect(res3.repo).toBe("fastapi");
  });

  it("rejects invalid hosts and malicious traversal strings", () => {
    expect(() => parseGitHubUrl("https://gitlab.com/owner/repo")).toThrow();
    expect(() => parseGitHubUrl("https://github.com/../malicious")).toThrow();
    expect(() => parseGitHubUrl("http://localhost:3000/owner/repo")).toThrow();
  });
});

describe("GitHub Module - Rate-Limit & In-Memory Cache", () => {
  beforeEach(() => {
    gitHubCache.clear();
  });

  it("stores and retrieves cached items with TTL", () => {
    gitHubCache.set("test:key", { value: "cached_data" }, 10);
    const retrieved = gitHubCache.get<{ value: string }>("test:key");
    expect(retrieved?.value).toBe("cached_data");
  });

  it("returns null for non-existent or expired cache items", () => {
    expect(gitHubCache.get("non_existent")).toBeNull();
  });
});
