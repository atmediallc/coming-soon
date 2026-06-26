export async function POST(request: Request) {
  // Enforce Content-Type to prevent CSRF via simple requests
  const contentType = request.headers.get("content-type");
  const mimeType = contentType?.split(";")[0].trim();
  if (mimeType !== "application/json") {
    return Response.json({ error: "Unsupported Media Type" }, { status: 415 });
  }

  // Prevent DoS via Payload Exhaustion
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 1024) {
    return Response.json({ error: "Payload Too Large" }, { status: 413 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  try {
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const waitlistEndpoint = process.env.WAITLIST_ENDPOINT_URL?.trim();

    if (!waitlistEndpoint) {
      console.error("Waitlist submission failed: WAITLIST_ENDPOINT_URL is not configured");
      return Response.json(
        { error: "Waitlist backend is not configured" },
        { status: 503 }
      );
    }

    const headers = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    const waitlistToken = process.env.WAITLIST_ENDPOINT_TOKEN?.trim();

    if (waitlistToken) {
      headers.set("Authorization", `Bearer ${waitlistToken}`);
    }

    const upstreamResponse = await fetch(waitlistEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email,
        source: process.env.WAITLIST_SOURCE || "coming-soon",
        submittedAt: new Date().toISOString(),
        userAgent: request.headers.get("user-agent") || undefined,
      }),
    });

    if (!upstreamResponse.ok) {
      console.error("Waitlist upstream rejected submission", {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
      });

      return Response.json(
        { error: "Waitlist backend rejected submission" },
        { status: 502 }
      );
    }

    return Response.json({ success: true, message: "Email added to waitlist" });
  } catch (error) {
    // Securely log the error server-side without exposing details to the client
    console.error("Waitlist submission failed:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
