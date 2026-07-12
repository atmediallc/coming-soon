import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const authorizationServer = process.env.OAUTH_AUTHORIZATION_SERVER?.trim();

  if (!authorizationServer) {
    return Response.json(
      { error: "OAuth protected resource metadata is not configured" },
      { status: 404 }
    );
  }

  const metadata = {
    resource: `${origin}/api`,
    authorization_servers: [
      new URL(authorizationServer, origin).toString()
    ],
    scopes_supported: ["read", "write"]
  };

  return Response.json(metadata);
}
