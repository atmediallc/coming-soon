import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const origin = getSiteUrl();
  const catalog = {
    linkset: [
      {
        anchor: `${origin}/api`,
        "service-desc": [
          {
            href: `${origin}/openapi.yaml`,
            type: "application/vnd.oai.openapi"
          }
        ],
        "service-doc": [
          {
            href: `${origin}/docs/api`,
            type: "text/html"
          }
        ],
        status: [
          {
            href: `${origin}/api/health`,
            type: "application/json"
          }
        ]
      }
    ]
  };

  return Response.json(catalog, {
    headers: {
      'Content-Type': 'application/linkset+json',
    },
  });
}
