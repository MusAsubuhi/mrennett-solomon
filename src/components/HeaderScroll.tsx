"use client";
import { useEffect } from "react";

/** Marks the sticky header as scrolled so CSS can shrink it. Renders nothing. */
export function HeaderScroll() {
  useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;
    const update = () => el.setAttribute("data-scrolled", String(window.scrollY > 24));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return null;
}
