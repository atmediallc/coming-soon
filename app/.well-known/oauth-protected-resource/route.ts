export async function GET() {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const metadata = {
    resource: `${origin}/api`,
    authorization_servers: [
      origin
    ],
    scopes_supported: ["read", "write"]
  };

  return Response.json(metadata);
}
