"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { WhatsAppLink } from "./WhatsAppLink";

/** Mobile / tablet menu (nav links are always visible on large screens). */
export function MenuToggle({ nav }: { nav: Array<{ label: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();

  // Close the menu when the page changes (state adjusted during render, not in an effect).
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-violet-700 hover:bg-violet-100"
      >
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <nav
        id={id}
        aria-label="Main menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-violet-700/20 bg-cream-50 shadow-lg"
      >
        <ul className="mx-auto max-w-page px-4 py-3 sm:px-6">
          {nav.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={pathname === n.href ? "page" : undefined}
                className="flex min-h-12 items-center font-display text-2xl text-violet-700"
              >
                {n.label}
              </Link>
            </li>
          ))}
          <li className="pb-2 pt-3">
            <WhatsAppLink source="menu" className="w-full">
              Order on WhatsApp
            </WhatsAppLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
