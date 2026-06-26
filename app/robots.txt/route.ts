import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: Claude-Web
User-agent: Google-Extended
User-agent: Amazonbot
User-agent: anthropic-ai
User-agent: Bytespider
User-agent: CCBot
User-agent: Applebot-Extended
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=no

Sitemap: ${origin}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
