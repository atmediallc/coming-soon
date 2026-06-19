import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const metadata = {
    serverInfo: {
      name: "TraderAdd MCP Server",
      version: "1.0.0"
    },
    endpoint: `${origin}/mcp`,
    capabilities: {
      tools: true,
      resources: true,
      prompts: false
    }
  };

  return Response.json(metadata);
}
