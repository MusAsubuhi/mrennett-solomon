"use client";
import dynamic from "next/dynamic";
import type { ProductView } from "@/lib/types";

// Lazy-loaded so the cart code stays out of the first page load.
const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });

export function CartDrawerLoader(props: { views: ProductView[]; prompt: string }) {
  return <CartDrawer {...props} />;
}
