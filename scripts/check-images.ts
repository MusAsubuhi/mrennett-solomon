/**
 * Launch gate. Exits with an error if any slot is still "placeholder" or any
 * image has empty alt text (or a "final" slot has no file).
 *   npm run check:images
 *   npm run check:images -- --allow-placeholders   (staging)
 */
import fs from "node:fs";
import path from "node:path";
import { getImages } from "../src/lib/content";

const allowPlaceholders = process.argv.includes("--allow-placeholders");
const errors: string[] = [];
const warnings: string[] = [];

for (const [id, s] of Object.entries(getImages())) {
  if (s.devOnly) continue;
  if (s.status === "placeholder") {
    (allowPlaceholders ? warnings : errors).push(`${id}: still a placeholder${s.required ? " (required)" : " (optional)"}`);
  }
  if (!s.decorative && s.alt.trim() === "") errors.push(`${id}: empty alt text (write a concrete description, or set decorative: true)`);
  if (!s.decorative && (s.alt.trim() === id || /^(image|photo|picture)$/i.test(s.alt.trim()))) {
    errors.push(`${id}: alt text must describe what the picture shows, not "${s.alt.trim()}"`);
  }
  const file = path.join(process.cwd(), "public", s.src);
  if (s.status === "final" && !fs.existsSync(file)) errors.push(`${id}: marked final but ${s.src} does not exist`);
  if (s.status === "final" && fs.existsSync(file)) {
    const kb = fs.statSync(file).size / 1024;
    if (kb > 1536) errors.push(`${id}: ${s.src} is ${Math.round(kb)} KB, over the 1.5 MB limit`);
    else if (kb > (id === "home.hero" ? 700 : 400) && !s.src.endsWith(".mp4")) {
      warnings.push(`${id}: ${s.src} is ${Math.round(kb)} KB (target under ${id === "home.hero" ? 700 : 400} KB)`);
    }
  }
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} problem${errors.length === 1 ? "" : "s"} blocking launch:\n`);
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log("All image slots are ready.");
