export async function GET() {
  const metadata = {
    serverInfo: {
      name: "TraderAdd MCP Server",
      version: "1.0.0"
    },
    endpoint: "https://example.com/mcp",
    capabilities: {
      tools: true,
      resources: true,
      prompts: false
    }
  };

  return Response.json(metadata);
}
