import Link from "next/link";
import { getScents } from "@/lib/content";
import type { ProductView } from "@/lib/types";
import { Botanical } from "./Botanicals";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { ScentNotes } from "./ScentNotes";
import { Section, SectionHeading } from "./Section";

/** Home: ingredient tiles for each scent, then each product's notes (layered only when confirmed). */
export function ScentStory({ views, eyebrow, heading, intro }: { views: ProductView[]; eyebrow: string; heading: string; intro: string }) {
  const scents = getScents();
  return (
    <Section tone="dark" labelledBy="scent-story">
      <SectionHeading id="scent-story" eyebrow={eyebrow} title={heading} intro={intro} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5">
        {scents.map((s, i) => (
          <li key={s.id}>
            <Reveal delay={(i % 3) * 100}>
              <div className="relative overflow-hidden rounded-sm">
                <ImageSlot id={s.slot} sizes="(min-width: 768px) 33vw, 50vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-violet-900/90 to-transparent p-3 pt-10">
                  <p className="font-display text-2xl text-cream-50">{s.name}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {views.map(({ product: p }, i) => (
          <Reveal key={p.id} delay={(i % 2) * 120}>
            <div className="h-full border border-gold-500/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{p.name}</p>
                  <h3 className="mt-1 text-3xl text-gold-300">{p.scentName}</h3>
                </div>
                <Botanical name={p.place === "home" ? "eucalyptus" : p.place === "hands" ? "jasmine" : "lavender"} className="h-14 w-8 shrink-0 text-gold-500" />
              </div>
              <div className="mt-4">
                <ScentNotes product={p} tone="dark" />
              </div>
              <p className="mt-4">
                <Link href={`/shop/${p.slug}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
                  See {p.name.toLowerCase()}
                </Link>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
