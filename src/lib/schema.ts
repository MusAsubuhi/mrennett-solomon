import { z } from "zod";

const place = z.enum(["shower", "hands", "laundry", "home"]);
const mood = z.enum(["calm", "bright", "fresh"]);
const nullableString = z.string().nullable();

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  scentName: z.string().min(1),
  place,
  sizeLabel: z.string().min(1),
  moods: z.array(mood).min(1),
  price: z.number().nonnegative().nullable(),
  priceConfirmed: z.boolean(),
  shortDescription: nullableString,
  howToUse: nullableString,
  keyNotes: z.array(z.string()),
  notes: z.object({ top: z.array(z.string()), heart: z.array(z.string()), base: z.array(z.string()) }).nullable(),
  notesConfirmed: z.boolean(),
  ingredients: nullableString,
  claims: z.array(z.object({ text: z.string().min(1), evidence: z.string().min(1, "a claim needs an evidence note") })),
  images: z.object({
    packshot: z.string().min(1),
    labelDetail: z.string().min(1),
    lifestyle: z.string().min(1),
    inUse: z.string().min(1),
  }),
  inStock: z.boolean().nullable(),
});

export const productsSchema = z
  .array(productSchema)
  .superRefine((list, ctx) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    list.forEach((p, i) => {
      if (ids.has(p.id)) ctx.addIssue({ code: "custom", message: `duplicate id "${p.id}"`, path: [i, "id"] });
      if (slugs.has(p.slug)) ctx.addIssue({ code: "custom", message: `duplicate slug "${p.slug}"`, path: [i, "slug"] });
      ids.add(p.id);
      slugs.add(p.slug);
      if (p.price !== null && !p.priceConfirmed) {
        // allowed (price entered but not yet confirmed); it will not display
      }
      if (p.notesConfirmed && !p.notes) {
        ctx.addIssue({ code: "custom", message: "notesConfirmed is true but notes is null", path: [i, "notes"] });
      }
    });
  });

export const moodsSchema = z.array(
  z.object({ id: mood, name: z.string(), description: z.string(), illustration: z.enum(["lavender", "jasmine", "eucalyptus"]) }),
);

export const placesSchema = z.array(
  z.object({
    id: place,
    label: z.string(),
    productId: z.string(),
    momentLine: z.string(),
    heading: z.string(),
    intro: z.string(),
    body: z.string(),
    metaDescription: z.string(),
  }),
);

export const quizSchema = z.object({
  tieOrder: z.array(mood).length(3),
  questions: z
    .array(
      z.object({
        id: z.string(),
        prompt: z.string(),
        answers: z.array(z.object({ label: z.string(), moods: z.array(mood).min(1) })).min(2),
      }),
    )
    .min(1),
});

export const faqSchema = z.array(
  z.object({ id: z.string(), group: z.string(), question: z.string(), answer: z.string() }),
);

export const scentsSchema = z.array(z.object({ id: z.string(), name: z.string(), slot: z.string(), match: z.string() }));

export const siteSchema = z
  .object({
    brand: z.object({
      name: z.string().min(1),
      tagline: z.string(),
      supportingLine: z.string(),
      metaTitle: z.string(),
      metaDescription: z.string(),
    }),
    currency: z.string().length(3),
    contact: z.object({ phone: z.string(), email: z.string(), location: z.string(), hours: z.string() }),
    socials: z.array(z.object({ label: z.string(), href: z.string().url() })),
    bundleDiscountPercent: z.number().min(0).max(100),
    delivery: z.object({ summary: z.string(), payment: z.string(), areas: z.string(), returns: z.string() }),
    promise: z.object({
      show: z.boolean(),
      heading: z.string(),
      items: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
    }),
    story: z.object({ heading: z.string(), short: z.string() }),
    nav: z.array(z.object({ label: z.string(), href: z.string() })),
    home: z.record(z.string(), z.string()),
    ordering: z.object({ whatsappPrompt: z.string() }),
  })
  .passthrough();

export const slotSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  ratio: z.string().regex(/^\d+(\.\d+)?\/\d+(\.\d+)?$/, 'ratio must look like "16/9"'),
  mobileRatio: z.string().regex(/^\d+\/\d+$/).optional(),
  focal: z.string(),
  status: z.enum(["placeholder", "final"]),
  minWidth: z.number(),
  required: z.boolean(),
  description: z.string(),
  decorative: z.boolean().optional(),
  devOnly: z.boolean().optional(),
  showWhilePlaceholder: z.boolean().optional(),
  note: z.string().optional(),
});
export const imagesSchema = z.record(z.string(), slotSchema);

export const reviewsSchema = z.array(
  z.object({ id: z.string(), quote: z.string(), name: z.string(), imageSlot: z.string().optional() }),
);

export const aboutSchema = z.object({
  heading: z.string(),
  intro: z.string(),
  founder: z.object({ name: z.string(), story: z.string() }),
  stands: z.string(),
  making: z.string(),
  ingredients: z.string(),
});
