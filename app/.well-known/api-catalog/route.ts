export async function GET() {
  const catalog = {
    linkset: [
      {
        anchor: "https://example.com/api",
        "service-desc": [
          {
            href: "https://example.com/openapi.yaml",
            type: "application/vnd.oai.openapi"
          }
        ],
        "service-doc": [
          {
            href: "https://example.com/docs/api",
            type: "text/html"
          }
        ],
        status: [
          {
            href: "https://example.com/api/health",
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
