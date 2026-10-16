import { NextRequest, NextResponse } from "next/server";
import { OllamaClient } from "@repopilot/ai";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const baseUrl = searchParams.get("baseUrl") || "http://localhost:11434";

  const client = new OllamaClient(baseUrl);
  const status = await client.checkStatus();

  return NextResponse.json(status);
}
