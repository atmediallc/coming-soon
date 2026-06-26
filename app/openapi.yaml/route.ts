const openApiDocument = `openapi: 3.1.0
info:
  title: TraderAdd Coming Soon API
  version: 1.0.0
paths:
  /api/health:
    get:
      summary: Health check
      responses:
        "200":
          description: Service is available
  /api/waitlist:
    post:
      summary: Submit a waitlist request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
              properties:
                email:
                  type: string
                  format: email
      responses:
        "200":
          description: Email accepted by the configured waitlist backend
        "400":
          description: Invalid email
        "415":
          description: Unsupported media type
        "503":
          description: Waitlist backend is not configured
`;

export async function GET() {
  return new Response(openApiDocument, {
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
    },
  });
}
