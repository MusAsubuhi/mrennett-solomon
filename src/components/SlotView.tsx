import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import type { ResolvedSlot } from "@/lib/types";
import { Botanical } from "./Botanicals";

type Props = {
  slot: ResolvedSlot;
  sizes?: string;
  /** Hero images only: eager load, preload and high fetch priority. */
  priority?: boolean;
  fit?: "cover" | "contain";
  className?: string;
  imgClassName?: string;
};

/**
 * Renders a resolved image slot. Pure (no hooks, no fs), so it works in server and
 * client components. Use <ImageSlot id="..."/> from server components; use this
 * with a `ResolvedSlot` passed down as a prop from client components.
 * Layout is reserved with CSS aspect-ratio, so swapping a placeholder for a photo never shifts the page.
 */
export function SlotView({ slot, sizes = "100vw", priority = false, fit = "cover", className, imgClassName }: Props) {
  const style = {
    "--ratio": slot.ratio,
    ...(slot.mobileRatio ? { "--ratio-mobile": slot.mobileRatio } : {}),
  } as CSSProperties;
  const isSvg = slot.src.endsWith(".svg");

  return (
    <div className={cn("slot", className)} style={style} data-slot={slot.id} data-slot-state={slot.show}>
      {slot.show === "image" ? (
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          unoptimized={isSvg}
          {...(priority ? { preload: true, loading: "eager" as const, fetchPriority: "high" as const } : {})}
          className={cn(fit === "cover" ? "object-cover" : "object-contain", imgClassName)}
          style={{ objectPosition: slot.focal }}
        />
      ) : (
        <PlaceholderPanel slot={slot} />
      )}
    </div>
  );
}

function PlaceholderPanel({ slot }: { slot: ResolvedSlot }) {
  const [w, h] = slot.ratio.split("/").map(Number);
  const height = Math.round(slot.minWidth / (w / h));
  return (
    <div
      aria-hidden="true"
      className="bg-botanical on-dark absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-800 via-violet-700 to-violet-900 p-3"
    >
      <div className="pointer-events-none absolute inset-2 border border-gold-500/70" />
      <div className="pointer-events-none absolute inset-3.5 border border-gold-500/40" />
      <div className="relative z-10 flex max-w-full flex-col items-center gap-2 text-center text-cream-50">
        <Botanical name="lavender" className="h-10 w-6 text-gold-500 opacity-80 sm:h-14 sm:w-8" />
        {slot.hints && (
          <div className="max-w-xs text-[11px] leading-snug text-cream-50 sm:text-xs">
            <p className="font-medium tracking-wide text-gold-300">{slot.id}</p>
            <p>
              {slot.ratio.replace("/", ":")} · min {slot.minWidth} x {height}px
            </p>
            <p className="mt-1 hidden opacity-90 sm:block">{slot.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
