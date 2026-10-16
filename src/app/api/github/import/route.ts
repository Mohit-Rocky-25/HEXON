import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUrl, GitHubClient } from "@repopilot/github";
import { z } from "zod";

const ImportRequestSchema = z.object({
  url: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = ImportRequestSchema.parse(body);

    const { owner, repo } = parseGitHubUrl(url);

    const client = new GitHubClient();

    // 1. Fetch Repository Metadata
    const repository = await client.fetchRepository(owner, repo);

    // 2. Resolve Head Revision & Tree SHA
    const revision = await client.resolveRevision(owner, repo, repository.defaultBranch);

    // 3. Fetch Repository Tree
    const tree = await client.fetchTree(owner, repo, revision.treeSha);

    return NextResponse.json({
      success: true,
      repository: {
        ...repository,
        selectedRevision: revision.commitSha
      },
      revision,
      tree,
      rateLimit: client.lastRateLimit
    });
  } catch (error: any) {
    console.error("API /api/github/import error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to import repository."
      },
      { status: error.status || 400 }
    );
  }
}
