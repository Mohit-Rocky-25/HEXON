import { NextRequest, NextResponse } from "next/server";
import { GitHubClient } from "@repopilot/github";
import { StackTraceParser, HypothesisEngine } from "@repopilot/debugging";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo, sha, title, description, stackTrace } = body;

    if (!owner || !repo || !stackTrace) {
      return NextResponse.json(
        { error: "owner, repo, and stackTrace are required." },
        { status: 400 }
      );
    }

    const token = req.headers.get("x-github-token") || process.env.GITHUB_TOKEN;
    const client = new GitHubClient({ token });
    const tree = await client.fetchTree(owner, repo, sha || "HEAD");
    const repoFilePaths = tree.map((f) => f.path);

    // 1. Parse Stack Trace
    const parsedTrace = StackTraceParser.parse(stackTrace, repoFilePaths);

    // 2. Fetch snippets for culprit frames
    const fileSnippets = new Map<string, string>();
    for (const frame of parsedTrace.frames.slice(0, 3)) {
      try {
        const content = await client.fetchFileContent(owner, repo, sha || "HEAD", frame.filePath);
        fileSnippets.set(frame.filePath, content.slice(0, 1000));
      } catch (e) {
        // Continue
      }
    }

    // 3. Formulate Hypotheses & Candidate Patch
    const analysis = HypothesisEngine.analyze(
      `${owner}/${repo}`,
      sha || "HEAD",
      title || "Runtime Issue",
      description || "",
      parsedTrace,
      fileSnippets
    );

    return NextResponse.json({
      success: true,
      parsedTrace,
      ...analysis,
      rateLimit: client.lastRateLimit
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to analyze bug report." },
      { status: 500 }
    );
  }
}
