"use client";
import { cartCount, useCart } from "@/lib/cart";
import { useMounted } from "@/lib/useMounted";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const mounted = useMounted();
  const count = mounted ? cartCount(lines) : 0;

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={count ? `Open your ritual, ${count} item${count === 1 ? "" : "s"}` : "Open your ritual, empty"}
      className="relative inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-violet-700 hover:bg-violet-100"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
        <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-violet-700 text-[11px] font-semibold text-cream-50"
        >
          {count}
        </span>
      )}
    </button>
  );
}
