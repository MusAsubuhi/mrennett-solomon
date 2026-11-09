export type Place = "shower" | "hands" | "laundry" | "home";
export type MoodId = "calm" | "bright" | "fresh";

export type Product = {
  id: string;
  slug: string;
  name: string;
  scentName: string;
  place: Place;
  sizeLabel: string;
  moods: MoodId[];
  price: number | null; // null shows "Ask for price"
  priceConfirmed: boolean;
  shortDescription: string | null;
  howToUse: string | null;
  keyNotes: string[];
  notes: { top: string[]; heart: string[]; base: string[] } | null;
  notesConfirmed: boolean; // layered display only when true
  ingredients: string | null; // hidden when null
  claims: Array<{ text: string; evidence: string }>; // evidence is required
  images: { packshot: string; labelDetail: string; lifestyle: string; inUse: string }; // slot IDs
  inStock: boolean | null;
};

export type Mood = { id: MoodId; name: string; description: string; illustration: "lavender" | "jasmine" | "eucalyptus" };

export type PlaceInfo = {
  id: Place;
  label: string;
  productId: string;
  momentLine: string;
  heading: string;
  intro: string;
  body: string;
  metaDescription: string;
};

export type Scent = { id: string; name: string; slot: string; match: string };

export type QuizData = {
  tieOrder: MoodId[];
  questions: Array<{ id: string; prompt: string; answers: Array<{ label: string; moods: MoodId[] }> }>;
};

export type FaqItem = { id: string; group: string; question: string; answer: string };

export type SlotEntry = {
  src: string;
  alt: string;
  ratio: string; // "16/9"
  mobileRatio?: string;
  focal: string; // CSS object-position
  status: "placeholder" | "final";
  minWidth: number;
  required: boolean;
  description: string;
  decorative?: boolean;
  devOnly?: boolean;
  /** Show the file even while status is "placeholder" (used for the concept hero and draft logos). */
  showWhilePlaceholder?: boolean;
  note?: string;
};

/** Serializable result of looking up a slot on the server. Safe to pass to client components. */
export type ResolvedSlot = {
  id: string;
  src: string;
  alt: string;
  ratio: string;
  mobileRatio?: string;
  focal: string;
  decorative: boolean;
  show: "image" | "placeholder";
  minWidth: number;
  description: string;
  hints: boolean; // show technical text in the placeholder (dev / preview)
};

/** A product plus the image slots the lists need, resolved on the server. */
export type ProductView = {
  product: Product;
  packshot: ResolvedSlot;
  lifestyle: ResolvedSlot;
};

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  draft: boolean;
  products: string[];
  body: string;
  readingMinutes: number;
};
