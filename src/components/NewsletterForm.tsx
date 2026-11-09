"use client";
import { useState } from "react";
import { Button } from "./Button";

type State = { status: "idle" | "sending" | "done" | "error"; message?: string };

/** Email sign-up with an explicit consent box and a honeypot. Posts to /api/subscribe. */
export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, setState] = useState<State>({ status: "idle" });
  const dark = tone === "dark";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const data = await res.json();
      setState(data.ok ? { status: "done" } : { status: "error", message: data.error ?? "Something went wrong." });
    } catch {
      setState({ status: "error", message: "We could not send that. Please try again." });
    }
  }

  if (state.status === "done") {
    return (
      <p role="status" className="font-display text-xl">
        Thank you. You are on the list.
      </p>
    );
  }

  const input = dark
    ? "border-gold-500 bg-white/5 text-cream-50 placeholder:text-cream-50/70"
    : "border-violet-700 bg-white text-ink-900";

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-md space-y-3">
      <div>
        <label htmlFor="nl-email" className="mb-1 block text-sm font-medium">
          Email address
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`min-h-11 w-full rounded-sm border px-3 ${input}`}
          aria-describedby={state.status === "error" ? "nl-error" : undefined}
        />
      </div>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-violet-700" />
        <span>I agree to receive occasional emails from Solo&apos;s. I can unsubscribe at any time.</span>
      </label>
      <Button type="submit" tone={tone} disabled={state.status === "sending"}>
        {state.status === "sending" ? "Sending…" : "Sign up"}
      </Button>
      {state.status === "error" && (
        <p id="nl-error" role="alert" className="text-sm font-medium">
          {state.message}
        </p>
      )}
    </form>
  );
}
