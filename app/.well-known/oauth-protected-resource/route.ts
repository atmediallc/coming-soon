import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const metadata = {
    resource: `${origin}/api`,
    authorization_servers: [
      origin
    ],
    scopes_supported: ["read", "write"]
  };

  return Response.json(metadata);
}
