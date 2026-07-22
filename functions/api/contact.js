export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const type = String(body.type || "contact").slice(0, 30);
    const email = String(body.email || "").trim();

    if (!email || !email.includes("@")) {
      return Response.json({ ok: false, error: "A valid email address is required." }, { status: 400 });
    }

    // This endpoint deliberately validates and acknowledges forms without storing
    // personal information. Connect D1, KV, an email provider, or a helpdesk before launch.
    return Response.json({
      ok: true,
      type,
      message: "Request accepted. No personal data was persisted by this demo function."
    }, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }
}

export function onRequestGet() {
  return Response.json({ ok: true, service: "EcoLearn Pages Function" }, {
    headers: { "Cache-Control": "no-store" }
  });
}
