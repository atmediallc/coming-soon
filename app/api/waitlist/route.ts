export async function POST(request: Request) {
  // Security Enhancement: Prevent resource exhaustion from overly large payloads
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 2048) {
    return Response.json({ error: "Payload Too Large" }, { status: 413 });
  }

  // Enforce Content-Type to prevent CSRF via simple requests
  const contentType = request.headers.get("content-type");
  const mimeType = contentType?.split(";")[0].trim();
  if (mimeType !== "application/json") {
    return Response.json({ error: "Unsupported Media Type" }, { status: 415 });
  }

  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    // Simulate backend processing
    await new Promise((resolve) => setTimeout(resolve, 1400));

    return Response.json({ success: true, message: "Email added to waitlist" });
  } catch (error) {
    // Securely log the error server-side without exposing details to the client
    console.error("Waitlist submission failed:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
