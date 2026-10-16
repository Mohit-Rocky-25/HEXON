import { NextRequest, NextResponse } from "next/server";
import { GitHubClient } from "@repopilot/github";
import { ArchitectureAnalyzer } from "@repopilot/analysis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo, sha } = body;

    if (!owner || !repo) {
      return NextResponse.json({ error: "owner and repo are required." }, { status: 400 });
    }

    const client = new GitHubClient();
    const tree = await client.fetchTree(owner, repo, sha || "HEAD");

    // Attempt to load package.json or requirements.txt if present
    let manifestContent: string | undefined;
    const manifestFile = tree.find(
      (f) => f.path === "package.json" || f.path === "requirements.txt" || f.path === "go.mod"
    );

    if (manifestFile) {
      try {
        manifestContent = await client.fetchFileContent(
          owner,
          repo,
          sha || "HEAD",
          manifestFile.path
        );
      } catch (e) {
        // Continue even if manifest retrieval fails
      }
    }

    const summary = ArchitectureAnalyzer.analyze(tree, manifestContent);

    return NextResponse.json({
      success: true,
      summary,
      rateLimit: client.lastRateLimit
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Architecture analysis failed." },
      { status: 500 }
    );
  }
}
