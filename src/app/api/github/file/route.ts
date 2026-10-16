import { NextRequest, NextResponse } from "next/server";
import { GitHubClient } from "@repopilot/github";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const sha = searchParams.get("sha");
    const path = searchParams.get("path");

    if (!owner || !repo || !sha || !path) {
      return NextResponse.json(
        { error: "Missing required parameters: owner, repo, sha, path" },
        { status: 400 }
      );
    }

    // SSRF & Traversal protection
    if (path.includes("..") || path.startsWith("/") || path.startsWith("\\")) {
      return NextResponse.json({ error: "Invalid path traversal attempt" }, { status: 400 });
    }

    const client = new GitHubClient();
    const content = await client.fetchFileContent(owner, repo, sha, path);

    return NextResponse.json({
      success: true,
      path,
      content,
      rateLimit: client.lastRateLimit
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve file content." },
      { status: 500 }
    );
  }
}
