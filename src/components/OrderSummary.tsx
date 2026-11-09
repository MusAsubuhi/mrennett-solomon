"use client";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useMounted } from "@/lib/useMounted";
import { formatMoney, hasPrice, productTitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { Button } from "./Button";

export function OrderSummary({ products }: { products: Product[] }) {
  const lines = useCart((s) => s.lines);
  const ready = useMounted();
  useEffect(() => {
    useCart.persist.rehydrate();
  }, []);
  const rows = lines.flatMap((l) => {
    const p = products.find((x) => x.id === l.productId);
    return p ? [{ p, qty: l.qty }] : [];
  });
  const allPriced = rows.length > 0 && rows.every((r) => hasPrice(r.p));
  if (!ready) return <p>Loading…</p>;
  if (rows.length === 0) return <p>Your ritual is empty.</p>;
  return (
    <div>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-900/30">
            <th className="py-2">Product</th>
            <th className="py-2">Size</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ p, qty }) => (
            <tr key={p.id} className="border-b border-ink-900/15">
              <td className="py-2">{productTitle(p)}</td>
              <td className="py-2">{p.sizeLabel}</td>
              <td className="py-2 text-right">{qty}</td>
              <td className="py-2 text-right">{hasPrice(p) ? formatMoney(p.price * qty) : "Ask for price"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-right text-lg">
        Total: <strong>{allPriced ? formatMoney(rows.reduce((n, r) => n + (r.p.price as number) * r.qty, 0)) : "Ask for price"}</strong>
      </p>
      <div className="mt-6 print:hidden">
        <Button onClick={() => window.print()}>Print this summary</Button>
      </div>
    </div>
  );
}
