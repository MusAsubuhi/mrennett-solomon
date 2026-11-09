"use client";
import { create } from "zustand";

type ToastState = { message: string; id: number; show: (message: string) => void; hide: () => void };

export const useToast = create<ToastState>((set) => ({
  message: "",
  id: 0,
  show: (message) => set((s) => ({ message, id: s.id + 1 })),
  hide: () => set({ message: "" }),
}));
