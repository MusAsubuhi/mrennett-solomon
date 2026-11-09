"use client";
import { track } from "@/lib/analytics";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { Button } from "./Button";

export function AddToCartButton({
  product,
  qty = 1,
  variant = "primary",
  tone = "light",
  className,
  label = "Add to ritual",
  openDrawer = false,
}: {
  product: Product;
  qty?: number;
  variant?: "primary" | "secondary";
  tone?: "light" | "dark";
  className?: string;
  label?: string;
  openDrawer?: boolean;
}) {
  const add = useCart((s) => s.add);
  const setOpen = useCart((s) => s.setOpen);
  return (
    <Button
      variant={variant}
      tone={tone}
      className={className}
      aria-label={`${label}: ${product.name}, ${product.scentName}`}
      onClick={() => {
        add(product.id, qty, `${product.name}, ${product.scentName}`);
        track("add_to_cart", { product: product.id });
        if (openDrawer) setOpen(true);
      }}
    >
      {label}
    </Button>
  );
}
