import { NextResponse } from "next/server";
import { EMAIL_RE, clientKey, rateLimited } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (rateLimited(`sub:${clientKey(req)}`)) {
    return NextResponse.json({ ok: false, error: "Too many attempts. Please try again later." }, { status: 429 });
  }
  let body: { email?: string; consent?: boolean; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot: real people never fill the hidden "website" field.
  if (body.website) return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ ok: false, error: "Please tick the box to agree to receive emails." }, { status: 400 });
  }

  // HOOK: connect an email provider here (for example Brevo).
  // The key is read on the server only: process.env.NEWSLETTER_PROVIDER_KEY
  // Example: await fetch("https://api.brevo.com/v3/contacts", { headers: { "api-key": key, ... }, body: ... })
  // Until then we only log that a consented sign-up arrived (no email address is written to logs).
  if (!process.env.NEWSLETTER_PROVIDER_KEY) {
    console.info("[subscribe] consented sign-up received; no provider configured, nothing stored.");
  }

  return NextResponse.json({ ok: true });
}
