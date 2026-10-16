import { GitHubUrlSchema } from "@repopilot/core";

export interface ParsedGitHubRepo {
  owner: string;
  repo: string;
  normalizedUrl: string;
}

/**
 * Validates and extracts owner and repository name from a public GitHub URL.
 * Enforces strict host validation (SSRF prevention).
 */
export function parseGitHubUrl(rawUrl: string): ParsedGitHubRepo {
  const normalizedUrl = GitHubUrlSchema.parse(rawUrl);

  const match = normalizedUrl.match(
    /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/
  );

  if (!match) {
    throw new Error(
      `Invalid GitHub repository URL: "${rawUrl}". Expected format: https://github.com/owner/repo`
    );
  }

  const [, owner, repo] = match;

  // Sanitize path traversal attempts in names
  if (owner.includes("..") || repo.includes("..") || owner === "." || repo === ".") {
    throw new Error("Malicious repository identifier detected.");
  }

  return {
    owner,
    repo,
    normalizedUrl
  };
}
