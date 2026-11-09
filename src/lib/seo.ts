import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { getImages, getSite } from "./content";
import { SITE_URL } from "./env";

export const abs = (p: string) => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;

/** Open Graph image: a final slot file if it exists, otherwise the generated /opengraph-image. */
export function ogImage(slotId = "brand.og"): string {
  const slot = getImages()[slotId];
  if (slot && slot.status === "final" && fs.existsSync(path.join(process.cwd(), "public", slot.src))) {
    return abs(slot.src);
  }
  return abs("/opengraph-image");
}

type PageMeta = { title: string; description: string; path: string; image?: string; noindex?: boolean };

/** Full metadata for a page: title, description, canonical, Open Graph, Twitter. */
export function pageMetadata({ title, description, path: p, image, noindex }: PageMeta): Metadata {
  const brand = getSite().brand.name;
  const img = image ?? ogImage();
  return {
    title,
    description,
    alternates: {
      canonical: abs(p),
      // Ready for a Kiswahili version: add { sw: abs("/sw" + p) } here when it exists.
      languages: { "en": abs(p), "x-default": abs(p) },
    },
    openGraph: { title, description, url: abs(p), siteName: brand, type: "website", images: [{ url: img }], locale: "en" },
    twitter: { card: "summary_large_image", title, description, images: [img] },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}
