export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    // Simulate backend processing
    await new Promise((resolve) => setTimeout(resolve, 1400));

    return Response.json({ success: true, message: "Email added to waitlist" });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
