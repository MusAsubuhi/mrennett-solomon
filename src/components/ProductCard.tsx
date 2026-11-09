import Link from "next/link";
import { priceLabel, productTitle } from "@/lib/catalog";
import type { ProductView } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { SlotView } from "./SlotView";

/** Product tile: packshot (swaps to lifestyle on hover, desktop only), name, scent, size, price. */
export function ProductCard({
  view,
  tone = "light",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 80vw",
}: {
  view: ProductView;
  tone?: "light" | "dark";
  sizes?: string;
}) {
  const { product: p } = view;
  const swap = view.lifestyle.show === "image";
  const dark = tone === "dark";
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/shop/${p.slug}`} className="block" aria-label={productTitle(p)}>
        <div className="relative overflow-hidden rounded-sm">
          <SlotView slot={view.packshot} sizes={sizes} />
          {swap && (
            <div className="absolute inset-0 hidden opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100">
              <SlotView slot={view.lifestyle} sizes={sizes} className="!aspect-auto h-full" />
            </div>
          )}
        </div>
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="eyebrow">{p.name}</p>
        <h3 className="mt-1 text-2xl">
          <Link href={`/shop/${p.slug}`} className={`underline-offset-4 hover:underline ${dark ? "text-cream-50" : "text-violet-700"}`}>
            {p.scentName}
          </Link>
        </h3>
        <p className="text-sm">
          {p.sizeLabel} · {priceLabel(p)}
        </p>
        <div className="mt-3 pt-1">
          <AddToCartButton product={p} variant="secondary" tone={tone} />
        </div>
      </div>
    </article>
  );
}
