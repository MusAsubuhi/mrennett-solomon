/**
 * Writes TODO-CONTENT.md: every placeholder still in /content and every image
 * slot that is not final, grouped by page.   npm run todo
 */
import fs from "node:fs";
import path from "node:path";
import { getImages, getJournalPosts, getSite, getReviews, CONTENT_DIR } from "../src/lib/content";

type Item = { where: string; need: string };
const byPage = new Map<string, Item[]>();
const add = (page: string, where: string, need: string) => {
  if (!byPage.has(page)) byPage.set(page, []);
  byPage.get(page)!.push({ where, need });
};

/** What each unfilled field needs, by field name. */
const HINTS: Record<string, string> = {
  price: "Price as a number in the site currency. Then set priceConfirmed to true.",
  shortDescription: "1 to 2 sentence description (no unevidenced claims).",
  howToUse: "Plain-language usage instructions from the maker.",
  notes: "Top, heart and base notes (arrays). Then set notesConfirmed to true.",
  ingredients: "Full ingredient list as printed on the pack. Hidden until supplied.",
  inStock: "true or false (optional; leave null if you do not track stock).",
};

function pageFor(file: string, keyPath: string): string {
  if (file === "products.json") return "Shop and product pages";
  if (file === "about.json") return "About (/about)";
  if (file === "faq.json") return "Help (/help)";
  if (file === "site.json") {
    if (keyPath.startsWith("contact")) return "Contact and footer";
    if (keyPath.startsWith("delivery")) return "Help, product pages and home closing band";
    if (keyPath.startsWith("promise")) return "Home: Solo's promise strip";
    if (keyPath.startsWith("story")) return "Home: our story";
  }
  return `Other (${file})`;
}

function scan(file: string, node: unknown, trail: string[]) {
  const here = trail.join(".");
  if (node === null || (typeof node === "string" && node.trim().startsWith("[[TODO"))) {
    const key = trail[trail.length - 1];
    // For arrays of objects (products, faq) label by id.
    const need =
      typeof node === "string"
        ? node.replace(/^\[\[TODO:?\s*/, "").replace(/\]\]$/, "")
        : (HINTS[key] ?? "Value needed (currently null).");
    add(pageFor(file, here), `content/${file} → ${here}`, need);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => {
      const label = v && typeof v === "object" && "id" in v ? String((v as { id: string }).id) : String(i);
      scan(file, v, [...trail, label]);
    });
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) if (!k.startsWith("_")) scan(file, v, [...trail, k]);
  }
}

for (const f of fs.readdirSync(CONTENT_DIR).filter((x) => x.endsWith(".json") && x !== "images.json")) {
  scan(f, JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")), []);
}

/* ---- Structural items that are hidden or incomplete by design ------------- */
const site = getSite();
if (!site.promise.show) add("Home: Solo's promise strip", "content/site.json → promise.show", "Strip is hidden. Fill the three items, then set show to true.");
if (getReviews().length === 0) add("Home: proof", "content/reviews.json", "No reviews yet, so the section is hidden. Add real, permitted customer quotes and photos only.");
if (site.bundleDiscountPercent === 0) add("Ritual builder", "content/site.json → bundleDiscountPercent", "Optional: set a set-discount percentage. At 0 only the total is shown.");
if (!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) add("Ordering", ".env.local → NEXT_PUBLIC_WHATSAPP_NUMBER", "WhatsApp number in international format, no plus sign. Until set, order buttons say \"ordering opens soon\".");
if (!process.env.NEXT_PUBLIC_SITE_URL) add("SEO", ".env.local → NEXT_PUBLIC_SITE_URL", "The live site address, used for canonical links, sitemap and sharing.");
add("Quiz", "content/products.json", "Each scent mood currently has only one product (calm has two). Results feel thin until each scent is offered in more products.");
add("Privacy and Terms", "content/legal (src/app/privacy, src/app/terms)", "Draft templates. Need owner and legal review, including Kenya Data Protection Act, 2019 consent wording if the business operates in Kenya.");
add("Brand", "public/brand/*", "Logo, favicon and botanical art are draft stand-ins. Supply the real label artwork (vector) to replace them.");
for (const p of getJournalPosts().filter((p) => p.draft)) {
  add("Journal", `content/journal/${p.slug}.mdx`, 'Draft post. Owner to review, edit and approve, then remove "draft: true" to publish.');
}

/* ---- Images ---------------------------------------------------------------- */
const pageForSlot = (id: string) => {
  const head = id.split(".")[0];
  const map: Record<string, string> = {
    brand: "Brand and global images", home: "Home images", scent: "Home images", product: "Product pages: images",
    moment: "Moment pages: images", ritual: "Ritual builder: images", about: "About: images", contact: "Contact: images",
    journal: "Journal: images", reference: "",
  };
  return map[head] ?? "Other images";
};
for (const [id, s] of Object.entries(getImages())) {
  if (s.devOnly || s.status === "final") continue;
  const page = pageForSlot(id);
  const px = `${s.minWidth}px wide minimum, ratio ${s.ratio.replace("/", ":")}`;
  add(page, `${id} → public${s.src}`, `${s.required ? "REQUIRED" : "optional"}. ${s.description}. ${px}. Then set status to "final" in content/images.json.`);
}

const order = [...byPage.keys()].sort((a, b) => {
  const img = (s: string) => (/images/.test(s) ? 1 : 0);
  return img(a) - img(b) || a.localeCompare(b);
});

let md = `# Content still needed\n\n_Generated by \`npm run todo\` on ${new Date().toISOString().slice(0, 10)}. Do not edit by hand._\n\n`;
const total = [...byPage.values()].reduce((n, v) => n + v.length, 0);
md += `**${total} open items** across ${byPage.size} areas.\n`;
for (const page of order) {
  md += `\n## ${page}\n\n`;
  for (const it of byPage.get(page)!) md += `- [ ] \`${it.where}\`: ${it.need}\n`;
}
fs.writeFileSync(path.join(process.cwd(), "TODO-CONTENT.md"), md);
console.log(`Wrote TODO-CONTENT.md (${total} open items).`);
