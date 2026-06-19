import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const metadata = {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    jwks_uri: `${origin}/oauth/jwks`,
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code", "token"],
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: `${origin}/agent/register`,
      methods_supported: ["id_jag", "verified_email"]
    }
  };

  return Response.json(metadata);
}
