"use client";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during server render and hydration, true afterwards. Avoids setState-in-effect. */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/** Reads a browser-only value without a hydration mismatch (server value is `serverValue`). */
export function useClientValue<T>(read: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribe, read, () => serverValue);
}
