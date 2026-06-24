export async function GET() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
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
