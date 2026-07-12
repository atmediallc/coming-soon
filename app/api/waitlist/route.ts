import { getDb, type WaitlistStore } from "@/lib/db/waitlist";

export const runtime = "nodejs";

function checkAuth(request: Request): boolean {
  const token = process.env.WAITLIST_ENDPOINT_TOKEN?.trim();
  if (!token) return true;
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${token}`;
}

function getStore(): WaitlistStore {
  return getDb();
}

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength || !/^\d+$/.test(contentLength)) {
    return Response.json({ error: "Length Required" }, { status: 411 });
  }
  if (parseInt(contentLength, 10) > 1024) {
    return Response.json({ error: "Payload Too Large" }, { status: 413 });
  }

  const contentType = request.headers.get("content-type");
  const mimeType = contentType?.split(";")[0].trim();
  if (mimeType !== "application/json") {
    return Response.json({ error: "Unsupported Media Type" }, { status: 415 });
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

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    try {
      getStore().insertEmail(email, process.env.WAITLIST_SOURCE || "coming-soon");
    } catch (dbError) {
      console.error("Waitlist local store insert failed:", dbError);
    }

    const waitlistEndpoint = process.env.WAITLIST_ENDPOINT_URL?.trim();

    if (!waitlistEndpoint) {
      return Response.json({ success: true, message: "Email added to waitlist" });
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
        { status: 502 },
      );
    }

    return Response.json({ success: true, message: "Email added to waitlist" });
  } catch (error) {
    console.error("Waitlist submission failed:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const entries = getStore().getAllEmails();
    return Response.json({ entries });
  } catch (error) {
    console.error("Waitlist read failed:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
