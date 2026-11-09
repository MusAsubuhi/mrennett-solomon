import type { MetadataRoute } from "next";
import { getJournalPosts, getPlaces, getProducts } from "@/lib/content";
import { abs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["/", "/shop", "/quiz", "/ritual", "/about", "/journal", "/help", "/contact", "/privacy", "/terms"];
  const urls = [
    ...fixed,
    ...getProducts().map((p) => `/shop/${p.slug}`),
    ...getPlaces().map((p) => `/moments/${p.id}`),
    ...getJournalPosts().filter((p) => !p.draft).map((p) => `/journal/${p.slug}`),
  ];
  return urls.map((u) => ({ url: abs(u), changeFrequency: u === "/" ? "weekly" : "monthly", priority: u === "/" ? 1 : u.startsWith("/shop") ? 0.8 : 0.6 }));
}
