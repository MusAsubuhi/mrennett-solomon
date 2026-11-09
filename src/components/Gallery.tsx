"use client";
import { useEffect, useRef, useState } from "react";
import type { ResolvedSlot } from "@/lib/types";
import { SlotView } from "./SlotView";

export type GalleryItem = { slot: ResolvedSlot; label: string };

/** Product gallery: main image (tap to zoom) plus keyboard-accessible thumbnails. */
export function Gallery({ items, title }: { items: GalleryItem[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const current = items[index] ?? items[0];
  const canZoom = current.slot.show === "image";

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
  }, [zoom]);

  return (
    <div>
      <div className="relative">
        <SlotView slot={current.slot} priority sizes="(min-width: 1024px) 50vw, 100vw" className="rounded-sm" />
        {canZoom && (
          <button
            type="button"
            onClick={() => setZoom(true)}
            className="absolute inset-0 cursor-zoom-in"
            aria-label={`Zoom in: ${current.label}, ${title}`}
          />
        )}
      </div>

      {items.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2" aria-label="Product pictures">
          {items.map((it, i) => (
            <li key={it.slot.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${it.label}`}
                aria-current={i === index}
                className={`block w-full cursor-pointer rounded-sm border-2 ${i === index ? "border-violet-700" : "border-transparent"}`}
              >
                <SlotView slot={{ ...it.slot, mobileRatio: undefined, ratio: "1/1" }} sizes="120px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onClose={() => setZoom(false)}
        onClick={(e) => e.target === dialogRef.current && setZoom(false)}
        aria-label={`${current.label}, ${title}`}
        className="m-auto max-h-[92dvh] w-[min(92vw,56rem)] bg-cream-50 p-2 backdrop:bg-ink-900/70"
      >
        <div className="relative mx-auto max-w-[min(100%,calc(88dvh*0.8))]">
          {zoom && <SlotView slot={current.slot} sizes="90vw" />}
        </div>
        <button
          type="button"
          onClick={() => setZoom(false)}
          className="absolute right-2 top-2 inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-violet-700 text-2xl text-cream-50"
          aria-label="Close zoomed picture"
        >
          <span aria-hidden="true">×</span>
        </button>
      </dialog>
    </div>
  );
}
