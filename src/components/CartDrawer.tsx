"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { MAX_QTY, cartCount, useCart } from "@/lib/cart";
import { formatMoney, hasPrice, productTitle } from "@/lib/catalog";
import type { ProductView } from "@/lib/types";
import { buildOrderMessage } from "@/lib/whatsapp";
import { Button } from "./Button";
import { SlotView } from "./SlotView";
import { WhatsAppLink } from "./WhatsAppLink";

/** Cart drawer, a native <dialog> (focus trap and Escape for free). Lazy-loaded from the layout. */
export default function CartDrawer({ views, prompt }: { views: ProductView[]; prompt: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { lines, open, setOpen, setQty, remove, clear, announcement } = useCart();

  // Cart lives in localStorage; restore it after mount so server and client HTML match.
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const byId = new Map(views.map((v) => [v.product.id, v]));
  const rows = lines.flatMap((l) => {
    const v = byId.get(l.productId);
    return v ? [{ v, qty: l.qty }] : [];
  });
  const count = cartCount(lines);
  const allPriced = rows.length > 0 && rows.every((r) => hasPrice(r.v.product));
  const total = allPriced ? rows.reduce((n, r) => n + (r.v.product.price as number) * r.qty, 0) : null;
  const message = buildOrderMessage(
    rows.map((r) => ({ product: r.v.product, qty: r.qty })),
    { prompt },
  );

  return (
    <>
      <div className="sr-only-live" role="status" aria-live="polite">
        {announcement}
      </div>
      <dialog
        ref={ref}
        className="drawer"
        aria-labelledby="cart-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) setOpen(false);
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-violet-700/20 px-4 py-3">
            <h2 id="cart-title" className="text-2xl text-violet-700">
              Your ritual{count ? ` (${count})` : ""}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-sm text-2xl text-violet-700 hover:bg-violet-100"
              aria-label="Close your ritual"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {rows.length === 0 ? (
              <div className="py-8 text-center">
                <p>Your ritual is empty.</p>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Button href="/shop" onClick={() => setOpen(false)}>
                    Shop the range
                  </Button>
                  <Button href="/quiz" variant="ghost" onClick={() => setOpen(false)}>
                    Find your scent
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-violet-700/15">
                {rows.map(({ v, qty }) => (
                  <li key={v.product.id} className="flex gap-3 py-4">
                    <div className="w-20 shrink-0">
                      <SlotView slot={v.packshot} sizes="80px" className="rounded-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop/${v.product.slug}`}
                        onClick={() => setOpen(false)}
                        className="font-display text-lg font-semibold leading-tight text-violet-700 underline-offset-4 hover:underline"
                      >
                        {productTitle(v.product)}
                      </Link>
                      <p className="text-sm">{v.product.sizeLabel}</p>
                      <p className="text-sm">
                        {hasPrice(v.product) ? formatMoney(v.product.price * qty) : "Ask for price"}
                      </p>
                      <div className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          className="size-11 cursor-pointer rounded-sm border border-violet-700 text-lg text-violet-700 hover:bg-violet-100"
                          aria-label={`Decrease quantity of ${v.product.name}`}
                          onClick={() => setQty(v.product.id, qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center" aria-live="polite" aria-label={`Quantity ${qty}`}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="size-11 cursor-pointer rounded-sm border border-violet-700 text-lg text-violet-700 hover:bg-violet-100 disabled:opacity-40"
                          aria-label={`Increase quantity of ${v.product.name}`}
                          disabled={qty >= MAX_QTY}
                          onClick={() => setQty(v.product.id, qty + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-2 min-h-11 cursor-pointer px-2 text-sm text-violet-700 underline underline-offset-4"
                          onClick={() => remove(v.product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {rows.length > 0 && (
            <div className="space-y-3 border-t border-violet-700/20 bg-cream-200 px-4 py-4">
              <p className="flex justify-between text-lg">
                <span>Total</span>
                <strong>{total !== null ? formatMoney(total) : "Ask for price"}</strong>
              </p>
              <WhatsAppLink message={message} source="cart" className="w-full">
                Order on WhatsApp
              </WhatsAppLink>
              <div className="flex items-center justify-between">
                <Button href="/order-summary" variant="ghost" onClick={() => setOpen(false)}>
                  Print summary
                </Button>
                <button
                  type="button"
                  onClick={clear}
                  className="min-h-11 cursor-pointer px-2 text-sm text-violet-700 underline underline-offset-4"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
