"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PLACE_ORDER } from "@/lib/catalog";
import type { Mood, PlaceInfo, ProductView } from "@/lib/types";
import { ProductCard } from "./ProductCard";

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`min-h-11 cursor-pointer rounded-full border px-4 text-[0.9375rem] font-medium transition-colors ${
        pressed ? "border-violet-700 bg-violet-700 text-cream-50" : "border-violet-700 bg-transparent text-violet-700 hover:bg-violet-100"
      }`}
    >
      {children}
    </button>
  );
}

export function ShopGrid({ views, places, moods }: { views: ProductView[]; places: PlaceInfo[]; moods: Mood[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialPlace = params.get("place") ?? "all";
  const initialMood = params.get("mood") ?? "all";
  const [place, setPlace] = useState(PLACE_ORDER.includes(initialPlace as never) ? initialPlace : "all");
  const [mood, setMood] = useState(moods.some((m) => m.id === initialMood) ? initialMood : "all");
  const [sort, setSort] = useState("default");

  function update(nextPlace: string, nextMood: string) {
    setPlace(nextPlace);
    setMood(nextMood);
    const q = new URLSearchParams();
    if (nextPlace !== "all") q.set("place", nextPlace);
    if (nextMood !== "all") q.set("mood", nextMood);
    router.replace(q.size ? `/shop?${q}` : "/shop", { scroll: false });
  }

  const shown = useMemo(() => {
    const list = views.filter(
      (v) => (place === "all" || v.product.place === place) && (mood === "all" || v.product.moods.includes(mood as never)),
    );
    if (sort === "name") return [...list].sort((a, b) => a.product.scentName.localeCompare(b.product.scentName));
    return list;
  }, [views, place, mood, sort]);

  return (
    <div>
      <div className="space-y-4">
        <div role="group" aria-label="Filter by place" className="flex flex-wrap gap-2">
          <Chip pressed={place === "all"} onClick={() => update("all", mood)}>
            All
          </Chip>
          {places.map((p) => (
            <Chip key={p.id} pressed={place === p.id} onClick={() => update(p.id, mood)}>
              {p.label}
            </Chip>
          ))}
        </div>
        <div role="group" aria-label="Filter by mood" className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Mood</span>
          <Chip pressed={mood === "all"} onClick={() => update(place, "all")}>
            Any
          </Chip>
          {moods.map((m) => (
            <Chip key={m.id} pressed={mood === m.id} onClick={() => update(place, m.id)}>
              {m.name}
            </Chip>
          ))}
        </div>
        {views.length > 6 && (
          <label className="flex items-center gap-2 text-sm">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="min-h-11 rounded-sm border border-violet-700 bg-white px-2">
              <option value="default">Featured</option>
              <option value="name">Scent name, A to Z</option>
            </select>
          </label>
        )}
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-sm">
        Showing {shown.length} of {views.length} products
      </p>

      {shown.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg">Nothing matches those filters.</p>
          <button
            type="button"
            onClick={() => update("all", "all")}
            className="mt-3 min-h-11 cursor-pointer text-violet-700 underline underline-offset-4"
          >
            Show all products
          </button>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((v) => (
            <li key={v.product.id}>
              <ProductCard view={v} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
