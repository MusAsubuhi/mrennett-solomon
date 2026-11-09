"use client";
import { useEffect } from "react";
import { useToast } from "@/lib/toast";

/** One polite live region for short messages. Dismisses itself. */
export function Toaster() {
  const { message, id, hide } = useToast();
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 5000);
    return () => clearTimeout(t);
  }, [message, id, hide]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      {message && (
        <p className="on-dark pointer-events-auto max-w-md rounded-sm border border-gold-500 bg-violet-900 px-4 py-3 text-center text-sm text-cream-50 shadow-lg">
          {message}
        </p>
      )}
    </div>
  );
}
