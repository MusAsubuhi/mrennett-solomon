import Link from "next/link";
import type { PlaceInfo } from "@/lib/types";
import { ImageSlot } from "./ImageSlot";

/** A place for a moment: shower, hands, laundry or home. Links to the shop filtered by that place. */
export function MomentCard({ place }: { place: PlaceInfo }) {
  return (
    <Link
      href={`/shop?place=${place.id}`}
      className="on-dark group relative block overflow-hidden rounded-sm"
      aria-label={`${place.label}. ${place.momentLine}`}
    >
      <ImageSlot id={`home.moment.${place.id}`} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 via-violet-900/30 to-transparent transition-opacity group-hover:opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-cream-50">
        <h3 className="text-3xl text-cream-50">{place.label}</h3>
        <p className="mt-1 text-sm leading-snug">{place.momentLine}</p>
      </div>
    </Link>
  );
}
