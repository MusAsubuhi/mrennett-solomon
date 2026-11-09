import { NextResponse } from "next/server";
import { EMAIL_RE, clientKey, rateLimited } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (rateLimited(`contact:${clientKey(req)}`, 3)) {
    return NextResponse.json({ ok: false, error: "Too many messages. Please try again later." }, { status: 429 });
  }
  let body: { name?: string; email?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();
  if (!name || name.length > 120) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  if (message.length < 5 || message.length > 3000) {
    return NextResponse.json({ ok: false, error: "Please write a short message." }, { status: 400 });
  }

  // HOOK: forward the message to the owner here (email service, CRM, or a WhatsApp Business API).
  // Stubbed for phase one: nothing is stored or sent.
  console.info("[contact] message received (stub, not stored).");
  return NextResponse.json({ ok: true });
}
