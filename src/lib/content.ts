/**
 * Server-side content loaders. Reads /content with fs so the same code works in
 * Next.js and in the scripts. Everything is validated; a bad file fails the build
 * with a message that names the file and the field.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  aboutSchema,
  faqSchema,
  imagesSchema,
  moodsSchema,
  placesSchema,
  productsSchema,
  quizSchema,
  reviewsSchema,
  scentsSchema,
  siteSchema,
} from "./schema";
import type { FaqItem, JournalPost, Mood, PlaceInfo, Product, QuizData, Scent, SlotEntry } from "./types";
import { SHOW_DEV_HINTS } from "./env";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export function readJson<T>(file: string, schema: z.ZodType<T>): T {
  const full = path.join(CONTENT_DIR, file);
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    throw new Error(`content/${file}: could not read or parse the file. ${(e as Error).message}`);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`);
    throw new Error(`content/${file} is invalid:\n${lines.join("\n")}`);
  }
  return result.data;
}

export const getSite = () => readJson("site.json", siteSchema);
export const getProducts = (): Product[] => readJson("products.json", productsSchema) as Product[];
export const getMoods = (): Mood[] => readJson("moods.json", moodsSchema);
export const getPlaces = (): PlaceInfo[] => readJson("places.json", placesSchema);
export const getQuiz = (): QuizData => readJson("quiz.json", quizSchema);
export const getFaq = (): FaqItem[] => readJson("faq.json", faqSchema);
export const getScents = (): Scent[] => readJson("scents.json", scentsSchema);
export const getReviews = () => readJson("reviews.json", reviewsSchema);
export const getImages = (): Record<string, SlotEntry> => readJson("images.json", imagesSchema);

export const getProduct = (slug: string) => getProducts().find((p) => p.slug === slug);
export const getPlace = (id: string) => getPlaces().find((p) => p.id === id);

/* ---- Journal ------------------------------------------------------------- */

export function getJournalPosts(): JournalPost[] {
  const dir = path.join(CONTENT_DIR, "journal");
  if (!fs.existsSync(dir)) return [];
  const posts = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      for (const key of ["title", "date", "excerpt"]) {
        if (!data[key]) throw new Error(`content/journal/${f}: front matter is missing "${key}"`);
      }
      const words = content.trim().split(/\s+/).length;
      return {
        slug: f.replace(/\.mdx?$/, ""),
        title: String(data.title),
        date: new Date(data.date).toISOString().slice(0, 10),
        excerpt: String(data.excerpt),
        draft: data.draft === true,
        products: Array.isArray(data.products) ? data.products.map(String) : [],
        body: content,
        readingMinutes: Math.max(1, Math.round(words / 200)),
      } satisfies JournalPost;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  // Drafts are hidden in a real production build, visible (flagged) otherwise.
  return posts.filter((p) => !p.draft || SHOW_DEV_HINTS);
}

export const getJournalPost = (slug: string) => getJournalPosts().find((p) => p.slug === slug);

export const getAbout = () => readJson("about.json", aboutSchema);

/** Legal pages are Markdown files in /content (privacy.md, terms.md). */
export function getLegal(name: "privacy" | "terms"): { title: string; updated: string; body: string } {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${name}.md`), "utf8");
  const { data, content } = matter(raw);
  return { title: String(data.title ?? name), updated: String(data.updated ?? ""), body: content };
}
