const BACKEND_URL =
  process.env.CHATBOT_BACKEND_URL ||
  process.env.NEXT_PUBLIC_CHATBOT_API_URL ||
  "http://127.0.0.1:4000";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const forwardedFor = request.headers.get("x-forwarded-for") || "127.0.0.1";

    const upstream = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": forwardedFor,
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok || !upstream.body) {
      const errJson = await upstream.json().catch(() => ({
        error: "Sales Concierge backend returned an error.",
      }));
      return Response.json(errJson, { status: upstream.status });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "Unable to reach the TEC Chatbot Backend server (port 4000). Make sure TEC-chatbot-backend is running (`npm run dev`).",
      },
      { status: 503 }
    );
  }
}

