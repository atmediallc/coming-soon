import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const endpoint = process.env.MCP_ENDPOINT_URL?.trim();

  if (!endpoint) {
    return Response.json(
      { error: "MCP endpoint is not configured" },
      { status: 404 }
    );
  }

  const metadata = {
    serverInfo: {
      name: "TraderAdd MCP Server",
      version: "1.0.0"
    },
    endpoint: new URL(endpoint, origin).toString(),
    capabilities: {
      tools: true,
      resources: true,
      prompts: false
    }
  };

  return Response.json(metadata);
}
