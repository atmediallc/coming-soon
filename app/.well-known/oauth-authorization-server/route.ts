import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const authorizationEndpoint = process.env.OAUTH_AUTHORIZATION_ENDPOINT?.trim();
  const tokenEndpoint = process.env.OAUTH_TOKEN_ENDPOINT?.trim();
  const jwksUri = process.env.OAUTH_JWKS_URI?.trim();
  const registrationUri = process.env.AGENT_REGISTRATION_URI?.trim();

  if (!authorizationEndpoint || !tokenEndpoint || !jwksUri || !registrationUri) {
    return Response.json(
      { error: "OAuth metadata is not configured" },
      { status: 404 }
    );
  }

  const metadata = {
    issuer: origin,
    authorization_endpoint: new URL(authorizationEndpoint, origin).toString(),
    token_endpoint: new URL(tokenEndpoint, origin).toString(),
    jwks_uri: new URL(jwksUri, origin).toString(),
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code", "token"],
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: new URL(registrationUri, origin).toString(),
      methods_supported: ["id_jag", "verified_email"]
    }
  };

  return Response.json(metadata);
}
