"use client";
/**
 * Privacy-respecting analytics (Plausible-style, no cookies). Only active when
 * NEXT_PUBLIC_ANALYTICS_ID is set (see AnalyticsScript in the layout).
 * Events: quiz_started, quiz_completed, add_to_cart, whatsapp_order_clicked.
 */
type Plausible = (event: string, opts?: { props?: Record<string, string | number> }) => void;

export function track(event: string, props?: Record<string, string | number>) {
  try {
    const fn = (window as unknown as { plausible?: Plausible }).plausible;
    if (fn) fn(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the site */
  }
}
