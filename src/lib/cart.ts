"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { productId: string; qty: number };

type CartState = {
  lines: CartLine[];
  open: boolean;
  announcement: string; // read out by an aria-live region
  add: (productId: string, qty?: number, label?: string) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  announce: (msg: string) => void;
};

export const MAX_QTY = 20;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      announcement: "",
      add: (productId, qty = 1, label) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === productId);
          const lines = existing
            ? s.lines.map((l) => (l.productId === productId ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l))
            : [...s.lines, { productId, qty: Math.min(MAX_QTY, qty) }];
          return { lines, announcement: `${label ?? "Item"} added to your ritual.` };
        }),
      setQty: (productId, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) => (l.productId === productId ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
        })),
      remove: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId), announcement: "Item removed." })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
      announce: (announcement) => set({ announcement }),
    }),
    {
      name: "mrennett-cart",
      partialize: (s) => ({ lines: s.lines }),
      // Rehydrated in CartDrawer after mount so server and client HTML match.
      skipHydration: true,
    },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0);
