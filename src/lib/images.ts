/**
 * Image slot resolution (server only: it checks the file system).
 * Components never hard-code image paths; they ask for a slot ID.
 */
import fs from "node:fs";
import path from "node:path";
import { getImages, getProducts } from "./content";
import { SHOW_DEV_HINTS } from "./env";
import type { ProductView, ResolvedSlot } from "./types";

export function fileExists(src: string): boolean {
  if (/^https?:/.test(src)) return true;
  return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

export function resolveSlot(id: string): ResolvedSlot {
  const entry = getImages()[id];
  if (!entry) {
    throw new Error(`Unknown image slot "${id}". Add it to content/images.json (see README).`);
  }
  const exists = fileExists(entry.src);
  const showImage = exists && (entry.status === "final" || entry.showWhilePlaceholder === true);
  return {
    id,
    src: entry.src,
    alt: entry.decorative ? "" : entry.alt,
    ratio: entry.ratio,
    mobileRatio: entry.mobileRatio,
    focal: entry.focal,
    decorative: entry.decorative === true,
    show: showImage ? "image" : "placeholder",
    minWidth: entry.minWidth,
    description: entry.description,
    hints: SHOW_DEV_HINTS,
  };
}

/** First slot in the list that has a real image, otherwise the first slot (placeholder). */
export function resolveFirst(ids: string[]): ResolvedSlot {
  const all = ids.map(resolveSlot);
  return all.find((s) => s.show === "image") ?? all[0];
}

export function getProductViews(): ProductView[] {
  return getProducts().map((product) => ({
    product,
    packshot: resolveSlot(product.images.packshot),
    lifestyle: resolveSlot(product.images.lifestyle),
  }));
}
