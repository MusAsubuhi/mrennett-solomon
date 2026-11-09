import { hasPrice, formatMoney } from "./catalog";
import { WHATSAPP_NUMBER } from "./env";
import type { Product } from "./types";

export type OrderLine = { product: Product; qty: number };

export const whatsappEnabled = WHATSAPP_NUMBER.length > 0;

/** Plain-text order message. Prices appear only when confirmed. */
export function buildOrderMessage(lines: OrderLine[], opts: { prompt: string; title?: string; discountPercent?: number }): string {
  const rows = lines.map(({ product: p, qty }) => {
    const price = hasPrice(p) ? `  (${formatMoney(p.price)} each)` : "";
    return `- ${qty} x ${p.name}, ${p.scentName}, ${p.sizeLabel}${price}`;
  });
  const allPriced = lines.length > 0 && lines.every((l) => hasPrice(l.product));
  const out = [`Hello Solo's, I would like to order${opts.title ? ` (${opts.title})` : ""}:`, "", ...rows];
  if (allPriced) {
    const subtotal = lines.reduce((n, l) => n + (l.product.price as number) * l.qty, 0);
    const pct = opts.discountPercent ?? 0;
    if (pct > 0) {
      out.push("", `Total: ${formatMoney(subtotal * (1 - pct / 100))} (set saving of ${pct}% included)`);
    } else {
      out.push("", `Total: ${formatMoney(subtotal)}`);
    }
  }
  out.push("", opts.prompt);
  return out.join("\n");
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** A plain "chat with us" link with no order. */
export function whatsappChatUrl(): string {
  return whatsappUrl("Hello Solo's, I have a question.");
}
