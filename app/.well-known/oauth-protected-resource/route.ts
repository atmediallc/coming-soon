export async function GET() {
  const metadata = {
    resource: "https://example.com/api",
    authorization_servers: [
      "https://example.com"
    ],
    scopes_supported: ["read", "write"]
  };

  return Response.json(metadata);
}
