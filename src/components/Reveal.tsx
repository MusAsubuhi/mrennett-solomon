"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Fades content in as it scrolls into view. Content stays visible without
 * JavaScript and with reduced motion (the CSS in globals.css switches it off).
 */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // No layout reads (they force reflow). The observer's first report tells us whether the
    // element is already on screen: if so leave it alone, otherwise hide it until it scrolls in.
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!first) el.classList.add("reveal-in");
          io.disconnect();
        } else if (first) {
          el.classList.add("reveal-hidden");
        }
        first = false;
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
