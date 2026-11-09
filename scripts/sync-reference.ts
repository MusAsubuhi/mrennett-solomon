/**
 * Runs before dev and build. If the owner's concept image is saved at
 * reference/solos-concept.jpg and there is no hero photo yet, copy it to
 * public/images/home/hero.jpg so it works as the temporary hero. The hero slot
 * stays marked "placeholder" until real photography replaces it.
 */
import fs from "node:fs";
import path from "node:path";

const ref = path.join(process.cwd(), "reference", "solos-concept.jpg");
const hero = path.join(process.cwd(), "public", "images", "home", "hero.jpg");

if (fs.existsSync(ref) && !fs.existsSync(hero)) {
  fs.mkdirSync(path.dirname(hero), { recursive: true });
  fs.copyFileSync(ref, hero);
  console.log("Copied reference/solos-concept.jpg to public/images/home/hero.jpg (temporary hero).");
} else if (!fs.existsSync(ref) && !fs.existsSync(hero)) {
  console.log("Note: reference/solos-concept.jpg not found, so the hero shows the branded placeholder.");
}
