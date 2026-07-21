import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
};

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.projectType === "string" &&
    b.projectType.trim().length > 0 &&
    typeof b.message === "string" &&
    b.message.trim().length >= 10
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendViaResend(payload: ContactPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  // Resend requires a verified sending domain. Until one is set, its shared
  // "onboarding@resend.dev" sender works for testing without domain setup.
  const from = process.env.RESEND_FROM_EMAIL || "ZKR Portfolio <onboarding@resend.dev>";
  if (!apiKey || !to) return false;

  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    `Project type: ${payload.projectType}`,
    payload.budget ? `Budget: ${payload.budget}` : null,
    "",
    "Message:",
    payload.message,
  ].filter((l): l is string => l !== null);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email, // hit "reply" in your inbox to answer the client directly
      subject: `Project inquiry — ${payload.projectType} (${payload.name})`,
      text: lines.join("\n"),
      html: `<p>${lines.map((l) => escapeHtml(l)).join("<br/>")}</p>`,
    }),
  });

  return res.ok;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields." }, { status: 422 });
  }

  // 1) Real email delivery via Resend, if configured — this is what actually
  //    puts the message in your inbox.
  if (process.env.RESEND_API_KEY) {
    try {
      const sent = await sendViaResend(body);
      if (sent) return NextResponse.json({ ok: true });
      return NextResponse.json(
        { ok: false, fallback: "mailto", error: "Email service rejected the message." },
        { status: 502 }
      );
    } catch {
      return NextResponse.json(
        { ok: false, fallback: "mailto", error: "Could not reach the email service." },
        { status: 502 }
      );
    }
  }

  // 2) Generic webhook (Formspree, your own backend, etc.), if configured.
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  // 3) No backend configured yet — tell the client explicitly so it can fall
  // back to a pre-filled mailto link instead of pretending this succeeded.
  if (!endpoint) {
    return NextResponse.json(
      { ok: false, fallback: "mailto", error: "No contact backend configured." },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false, fallback: "mailto", error: "Upstream contact service rejected the message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, fallback: "mailto", error: "Could not reach the contact service." },
      { status: 502 }
    );
  }
}
