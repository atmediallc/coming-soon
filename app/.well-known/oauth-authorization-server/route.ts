export async function GET() {
  const metadata = {
    issuer: "https://example.com",
    authorization_endpoint: "https://example.com/oauth/authorize",
    token_endpoint: "https://example.com/oauth/token",
    jwks_uri: "https://example.com/oauth/jwks",
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code", "token"],
    agent_auth: {
      skill: "https://example.com/auth.md",
      register_uri: "https://example.com/agent/register",
      methods_supported: ["id_jag", "verified_email"]
    }
  };

  return Response.json(metadata);
}
