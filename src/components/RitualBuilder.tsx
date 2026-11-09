"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import { formatMoney, hasPrice, productTitle } from "@/lib/catalog";
import type { ProductView, ResolvedSlot } from "@/lib/types";
import { buildOrderMessage } from "@/lib/whatsapp";
import { Botanical } from "./Botanicals";
import { Button } from "./Button";
import { LabelFrame } from "./LabelFrame";
import { SlotView } from "./SlotView";
import { WhatsAppLink } from "./WhatsAppLink";

const ART = { shower: "lavender", hands: "jasmine", laundry: "lavender", home: "eucalyptus" } as const;

export function RitualBuilder({
  views,
  discountPercent,
  prompt,
  box,
  card,
}: {
  views: ProductView[];
  discountPercent: number;
  prompt: string;
  box: ResolvedSlot;
  card: ResolvedSlot;
}) {
  const params = useSearchParams();
  const preset = (params.get("items") ?? "").split(",").filter(Boolean);
  const [selected, setSelected] = useState<string[]>(() => views.filter((v) => preset.includes(v.product.id)).map((v) => v.product.id));
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);

  const chosen = views.filter((v) => selected.includes(v.product.id));
  const allPriced = chosen.length > 0 && chosen.every((v) => hasPrice(v.product));
  const subtotal = allPriced ? chosen.reduce((n, v) => n + (v.product.price as number), 0) : null;
  const saving = subtotal !== null && discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const message = buildOrderMessage(
    chosen.map((v) => ({ product: v.product, qty: 1 })),
    { prompt, title: "a Solo's set", discountPercent },
  );

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
      <div>
        <SlotView slot={box} sizes="(min-width: 1024px) 55vw, 100vw" className="mb-8 rounded-sm" />
        <fieldset>
          <legend className="font-display text-3xl text-violet-700">Choose your moments</legend>
          <ul className="mt-4 space-y-3">
            {views.map((v) => {
              const on = selected.includes(v.product.id);
              return (
                <li key={v.product.id}>
                  <label
                    className={`flex min-h-16 cursor-pointer items-center gap-4 border p-3 ${on ? "border-violet-700 bg-violet-100" : "border-violet-700/30 hover:bg-violet-100/60"}`}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(v.product.id)} className="size-6 shrink-0 accent-violet-700" />
                    <span className="w-14 shrink-0 sm:w-16">
                      <SlotView slot={v.packshot} sizes="64px" className="rounded-sm" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl font-semibold leading-tight text-violet-700">{productTitle(v.product)}</span>
                      <span className="block text-sm">{v.product.sizeLabel}</span>
                    </span>
                    <span className="text-sm font-medium">{hasPrice(v.product) ? formatMoney(v.product.price) : "Ask for price"}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <LabelFrame innerClassName="text-center">
          <p className="eyebrow">Your set</p>
          <h2 className="mt-1 text-4xl text-cream-50">Gift box</h2>
          <div aria-live="polite" className="mt-5 min-h-28">
            {chosen.length === 0 ? (
              <p>Tick a product to start your set.</p>
            ) : (
              <ul className="space-y-3">
                {chosen.map((v) => (
                  <li key={v.product.id} className="flex items-center justify-center gap-3 border-b border-gold-500/30 pb-3">
                    <Botanical name={ART[v.product.place]} className="h-9 w-6 shrink-0 text-gold-500" />
                    <span className="text-left">
                      <span className="block font-display text-xl leading-tight text-gold-300">{v.product.scentName}</span>
                      <span className="block text-sm">
                        {v.product.name}, {v.product.sizeLabel}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5 space-y-1 text-lg" aria-live="polite">
            {chosen.length > 0 && (
              <>
                {saving > 0 && subtotal !== null && (
                  <p className="text-base">
                    Set saving ({discountPercent}%): <strong>{formatMoney(saving)}</strong>
                  </p>
                )}
                <p>
                  Total: <strong>{subtotal !== null ? formatMoney(subtotal - saving) : "Ask for price"}</strong>
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              tone="dark"
              disabled={chosen.length === 0}
              onClick={() => {
                chosen.forEach((v) => {
                  add(v.product.id, 1, productTitle(v.product));
                  track("add_to_cart", { product: v.product.id });
                });
                setOpen(true);
              }}
            >
              Add set to cart
            </Button>
            {chosen.length === 0 ? (
              <Button tone="dark" variant="secondary" disabled>
                Send this set on WhatsApp
              </Button>
            ) : (
              <WhatsAppLink message={message} tone="dark" variant="secondary" source="ritual">
                Send this set on WhatsApp
              </WhatsAppLink>
            )}
          </div>
        </LabelFrame>
        {card.show === "image" && <SlotView slot={card} sizes="300px" className="mt-6 hidden max-w-xs rounded-sm lg:block" />}
      </div>
    </div>
  );
}
