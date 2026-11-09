/** Validates every content file. Runs automatically before `npm run build`. */
import {
  getFaq, getImages, getJournalPosts, getMoods, getPlaces, getProducts, getQuiz, getReviews, getScents, getSite,
} from "../src/lib/content";

const problems: string[] = [];
const run = (name: string, fn: () => void) => {
  try {
    fn();
  } catch (e) {
    problems.push((e as Error).message);
    void name;
  }
};

run("site", getSite);
run("moods", getMoods);
run("quiz", getQuiz);
run("faq", getFaq);
run("reviews", getReviews);

let images: ReturnType<typeof getImages> = {};
run("images", () => {
  images = getImages();
});

run("products", () => {
  const products = getProducts();
  for (const p of products) {
    for (const [k, slot] of Object.entries(p.images)) {
      if (!images[slot]) problems.push(`content/products.json: product "${p.id}" uses image slot "${slot}" (${k}) which is not in content/images.json`);
    }
  }
});
run("places", () => {
  const ids = new Set(getProducts().map((p) => p.id));
  for (const pl of getPlaces()) {
    if (!ids.has(pl.productId)) problems.push(`content/places.json: "${pl.id}" points at unknown product "${pl.productId}"`);
  }
});
run("scents", () => {
  for (const s of getScents()) {
    if (!images[s.slot]) problems.push(`content/scents.json: scent "${s.id}" uses missing image slot "${s.slot}"`);
  }
});
run("journal", () => {
  const ids = new Set(getProducts().map((p) => p.id));
  for (const post of getJournalPosts()) {
    if (!images[`journal.${post.slug}.cover`]) {
      problems.push(`content/journal/${post.slug}.mdx: add an image slot "journal.${post.slug}.cover" to content/images.json`);
    }
    for (const id of post.products) {
      if (!ids.has(id)) problems.push(`content/journal/${post.slug}.mdx: unknown product "${id}"`);
    }
  }
});

if (problems.length) {
  console.error("\nContent validation failed:\n");
  for (const p of problems) console.error(`✗ ${p}\n`);
  process.exit(1);
}
console.log("Content OK.");
