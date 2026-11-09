/**
 * Generates content/images.json from the slot table (brief section 8.3).
 * It refuses to overwrite an existing manifest (so owner edits are safe)
 * unless you pass --force.
 *
 *   npm run images:generate            (first run only)
 *   npm run images:generate -- --force (rebuild from scratch)
 */
import fs from "node:fs";
import path from "node:path";
import type { SlotEntry } from "../src/lib/types";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "content", "images.json");

if (fs.existsSync(OUT) && !process.argv.includes("--force")) {
  console.log("content/images.json already exists. Use --force to rebuild it (this loses edits).");
  process.exit(0);
}

const slots: Record<string, SlotEntry> = {};

type Opts = Partial<SlotEntry> & { description: string };

function add(id: string, file: string, ratio: string, minWidth: number, required: boolean, o: Opts) {
  slots[id] = {
    src: file.startsWith("/") ? file : `/images/${file}`,
    alt: o.alt ?? o.description,
    ratio,
    focal: "50% 50%",
    status: "placeholder",
    minWidth,
    required,
    ...o,
  } as SlotEntry;
}

/* ---- Brand and global ---------------------------------------------------- */
add("brand.logo-gold", "/brand/logo-gold.svg", "5/1", 400, true, {
  description: "Mrennett wordmark in gold serif, transparent SVG",
  alt: "Mrennett",
  showWhilePlaceholder: true,
  note: "Draft wordmark made for the build. Replace with the real logo artwork.",
});
add("brand.logo-violet", "/brand/logo-violet.svg", "5/1", 400, true, {
  description: "Mrennett wordmark in violet serif, transparent SVG",
  alt: "Mrennett",
  showWhilePlaceholder: true,
  note: "Draft wordmark made for the build. Replace with the real logo artwork.",
});
add("brand.favicon", "/brand/favicon-512.png", "1/1", 512, true, {
  description: "Simple S or the wordmark initial on violet, 512 x 512",
  alt: "Mrennett icon, a gold M on violet",
  decorative: true,
  note: "src/app/icon.svg is the stand-in. Add the real 512 px PNG here and an icon file in src/app.",
});
add("brand.og", "brand/og.jpg", "1200/630", 1200, true, {
  description: "Wordmark and tagline over the botanical pattern, 1200 x 630",
  alt: "Mrennett. Your moment, Mrennett.",
  note: "src/app/opengraph-image.tsx generates a stand-in until this is final.",
});
add("brand.pattern-botanical", "/brand/pattern-botanical.svg", "1/1", 240, true, {
  description: "Seamless gold line-art lavender and leaf pattern, SVG tile",
  alt: "",
  decorative: true,
  showWhilePlaceholder: true,
  note: "Original line art made for the build. Replace with the owner's label illustrations if supplied.",
});
slots["reference.concept"] = {
  src: "/reference/solos-concept.jpg",
  alt: "The owner's concept image of the four products (its labels still show the earlier working name)",
  ratio: "3/2",
  focal: "50% 50%",
  status: "placeholder",
  minWidth: 1599,
  required: false,
  devOnly: true,
  description: "The owner's concept image, for development only. Lives in /reference, not shown on the site.",
};

/* ---- Home ---------------------------------------------------------------- */
add("home.hero", "home/hero.jpg", "16/9", 2400, true, {
  mobileRatio: "4/5",
  focal: "50% 45%",
  description: "The four products grouped on a wooden surface beside a sunlit garden window",
  alt: "Mrennett shower gel, hand wash, fabric softener and reed diffuser on a wooden table by a sunlit garden window",
  showWhilePlaceholder: true,
  note: "Reference concept image used until real photography is ready",
});
add("home.hero-video", "home/hero.mp4", "16/9", 1920, false, {
  description: "Slow pan across the products with drifting light and water droplets. MP4 + WebM, 1080p, under 4 MB, 6 to 8 s loop, muted. Poster is home.hero",
  alt: "",
  decorative: true,
});
const moments: Array<[string, string]> = [
  ["shower", "Bathroom or shower setting with the shower gel, steam and a towel"],
  ["hands", "Hands lathering with the hand wash at a basin"],
  ["laundry", "Folded soft linen and the fabric softener in a bright laundry area"],
  ["home", "The reed diffuser on a shelf or side table in a calm living space"],
];
for (const [p, d] of moments) {
  add(`home.moment.${p}`, `home/moment-${p}.jpg`, "4/5", 1200, true, { description: d });
}
const scents: Array<[string, string]> = [
  ["lavender", "lavender sprigs"],
  ["orchid", "an orchid bloom"],
  ["jasmine", "jasmine flowers"],
  ["apple-blossom", "apple blossom"],
  ["eucalyptus", "eucalyptus leaves"],
  ["sage", "sage leaves"],
];
for (const [s, d] of scents) {
  add(`scent.${s}`, `scents/${s}.jpg`, "1/1", 800, true, { description: `Close-up of ${d}` });
}
add("home.bundle", "home/bundle.jpg", "3/2", 1800, true, {
  description: "Flat-lay of all four products with botanicals",
});
add("home.story", "home/story.jpg", "4/5", 1200, true, {
  description: "Portrait of the founder or maker at work, in natural light",
});
for (let i = 1; i <= 6; i++) {
  add(`home.proof.${i}`, `home/proof-${i}.jpg`, "1/1", 800, false, {
    description: "A real customer photo with the products (only with the customer's consent)",
  });
}
for (let i = 1; i <= 3; i++) {
  add(`home.journal.${i}`, `home/journal-${i}.jpg`, "16/9", 1200, true, {
    description: `Cover image matching journal post ${i} on the home page`,
    note: "Home page teaser. Falls back to the post's own cover slot when this one is a placeholder.",
  });
}

/* ---- Products ------------------------------------------------------------ */
const products: Array<[string, string, string]> = [
  ["shower-gel", "Shower Gel", "on a bath ledge"],
  ["hand-wash", "Hand Wash", "beside a basin"],
  ["fabric-softener", "Fabric Softener", "on a laundry shelf"],
  ["home-scent", "Reed Diffuser", "on a side table"],
];
for (const [id, name, where] of products) {
  add(`product.${id}.packshot`, `products/${id}-packshot.jpg`, "1/1", 2000, true, {
    description: `${name}, single product, front on, seamless cream background, soft shadow`,
  });
  add(`product.${id}.label-detail`, `products/${id}-label.jpg`, "1/1", 1600, true, {
    description: `Macro of the gold-framed ${name} label showing wordmark, scent and size`,
  });
  add(`product.${id}.lifestyle`, `products/${id}-lifestyle.jpg`, "4/5", 1600, true, {
    description: `${name} in its natural place, ${where}`,
  });
  add(`product.${id}.in-use`, `products/${id}-in-use.jpg`, "4/5", 1600, false, {
    description: `Hands or a person using the ${name}, face optional`,
  });
}

/* ---- Moment pages -------------------------------------------------------- */
const heroes: Array<[string, string]> = [
  ["shower", "Wide, airy bathroom scene with the shower gel"],
  ["hands", "Basin and hand wash with window light"],
  ["laundry", "Line-dried or folded linens with the fabric softener"],
  ["home", "Living space with the diffuser and eucalyptus"],
];
for (const [p, d] of heroes) {
  add(`moment.${p}.hero`, `moments/${p}-hero.jpg`, "16/9", 2000, true, { description: d });
}

/* ---- Ritual, About, Contact, Journal ------------------------------------- */
add("ritual.box", "ritual/box.jpg", "3/2", 1800, true, {
  description: "Gift box or ribbon-tied set of the products",
});
add("ritual.card", "ritual/card.jpg", "1/1", 1000, false, {
  description: "Hand-written gift card beside a product",
});
add("about.hero", "about/hero.jpg", "16/9", 2000, true, {
  description: "Wide image of the workspace, ingredients or garden",
});
add("about.maker", "about/maker.jpg", "4/5", 1200, true, {
  description: "Founder or maker portrait",
});
add("about.workshop", "about/workshop.jpg", "3/2", 1600, false, {
  description: "Production or filling in progress, tidy and clean",
});
add("about.ingredients", "about/ingredients.jpg", "3/2", 1600, false, {
  description: "Raw botanicals, oils or ingredients laid out",
});
add("contact.banner", "contact/banner.jpg", "21/9", 2000, false, {
  description: "Soft lifestyle banner behind the contact block",
});
for (const slug of ["choose-a-scent-for-a-room", "folding-fresh-laundry", "a-calm-evening-routine"]) {
  add(`journal.${slug}.cover`, `journal/${slug}.jpg`, "16/9", 1200, true, {
    description: `Cover image for the journal post "${slug.replace(/-/g, " ")}"`,
  });
}

fs.writeFileSync(OUT, JSON.stringify(slots, null, 2) + "\n");
console.log(`Wrote ${Object.keys(slots).length} slots to content/images.json`);
