"use client";
import { useState } from "react";
import { MAX_QTY, useCart } from "@/lib/cart";
import { track } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { buildOrderMessage } from "@/lib/whatsapp";
import { Button } from "./Button";
import { WhatsAppLink } from "./WhatsAppLink";

export function ProductActions({ product, prompt }: { product: Product; prompt: string }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  const message = buildOrderMessage([{ product, qty }], { prompt });
  const out = product.inStock === false;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span id="qty-label" className="text-sm font-medium">
          Quantity
        </span>
        <div role="group" aria-labelledby="qty-label" className="flex items-center">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="size-11 cursor-pointer rounded-sm border border-violet-700 text-lg text-violet-700 hover:bg-violet-100 disabled:opacity-40"
          >
            −
          </button>
          <output aria-live="polite" className="w-10 text-center text-lg">
            {qty}
          </output>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={qty >= MAX_QTY}
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            className="size-11 cursor-pointer rounded-sm border border-violet-700 text-lg text-violet-700 hover:bg-violet-100 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {out && <p className="font-medium">Currently out of stock. Ask us on WhatsApp about availability.</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          disabled={out}
          onClick={() => {
            add(product.id, qty, `${product.name}, ${product.scentName}`);
            track("add_to_cart", { product: product.id });
            setOpen(true);
          }}
        >
          Add to ritual
        </Button>
        <WhatsAppLink message={message} variant="secondary" source="product">
          Order on WhatsApp
        </WhatsAppLink>
      </div>
    </div>
  );
}
