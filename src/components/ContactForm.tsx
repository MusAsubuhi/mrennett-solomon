"use client";
import { useState } from "react";
import { Button } from "./Button";

type State = { status: "idle" | "sending" | "done" | "error"; message?: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(f)),
      });
      const data = await res.json();
      setState(data.ok ? { status: "done" } : { status: "error", message: data.error ?? "Something went wrong." });
    } catch {
      setState({ status: "error", message: "We could not send that. Please try again." });
    }
  }

  if (state.status === "done") {
    return (
      <p role="status" className="font-display text-2xl">
        Thank you. Your message has been received.
      </p>
    );
  }

  const field = "min-h-11 w-full rounded-sm border border-violet-700 bg-white px-3 py-2 text-ink-900";
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="c-name" className="mb-1 block text-sm font-medium">
          Your name
        </label>
        <input id="c-name" name="name" autoComplete="name" required className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-1 block text-sm font-medium">
          Email address
        </label>
        <input id="c-email" name="email" type="email" autoComplete="email" required className={field} />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-1 block text-sm font-medium">
          Message
        </label>
        <textarea id="c-message" name="message" rows={5} required className={field} />
      </div>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Button type="submit" disabled={state.status === "sending"}>
        {state.status === "sending" ? "Sending…" : "Send message"}
      </Button>
      {state.status === "error" && (
        <p role="alert" className="font-medium">
          {state.message}
        </p>
      )}
    </form>
  );
}
