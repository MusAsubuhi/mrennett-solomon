/** Environment helpers. NEXT_PUBLIC_ values are inlined at build time. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(/\D/g, "");
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "KES";
export const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID || "";

/**
 * True in development, on Vercel preview deployments, or when
 * NEXT_PUBLIC_SHOW_PLACEHOLDERS=true. In these cases the site shows
 * "Content needed" boxes, image-slot hints and Draft flags.
 * In a real production build it is false and placeholders stay hidden.
 */
export const SHOW_DEV_HINTS =
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "preview" ||
  process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";
