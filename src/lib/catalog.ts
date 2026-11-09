/**
 * Isomorphic product helpers (safe in server and client components).
 * No file-system access here.
 */
import { CURRENCY } from "./env";
import type { Product } from "./types";

export const PLACE_ORDER = ["shower", "hands", "laundry", "home"] as const;

/** A price is only shown when it exists AND the owner confirmed it. */
export function hasPrice(p: Product): p is Product & { price: number } {
  return p.priceConfirmed && typeof p.price === "number";
}

export function formatMoney(amount: number, currency: string = CURRENCY): string {
  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export function priceLabel(p: Product): string {
  return hasPrice(p) ? formatMoney(p.price) : "Ask for price";
}

export function productTitle(p: Product): string {
  return `${p.name}, ${p.scentName}`;
}

/** Neutral description used for SEO / sharing when no copy has been supplied. No claims. */
export function fallbackDescription(p: Product): string {
  return `Mrennett ${p.name} in ${p.scentName}, ${p.sizeLabel}.`;
}

/** Two other products: same mood first, then a different place. */
export function pairsWith(all: Product[], p: Product): Product[] {
  const others = all.filter((o) => o.id !== p.id);
  const score = (o: Product) =>
    (o.moods.some((m) => p.moods.includes(m)) ? 2 : 0) + (o.place !== p.place ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 2);
}
