import type { Product } from "@/lib/types";

/**
 * Key-notes chips (derived from the product name), or, only when the owner has
 * confirmed them, the layered top / heart / base notes.
 */
export function ScentNotes({ product, tone = "light" }: { product: Product; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const chip = dark ? "border-gold-500 text-cream-50" : "border-violet-700 text-violet-700";

  if (product.notesConfirmed && product.notes) {
    const layers: Array<[string, string[]]> = [
      ["Top", product.notes.top],
      ["Heart", product.notes.heart],
      ["Base", product.notes.base],
    ];
    return (
      <ol aria-label="Scent notes, top to base" className="space-y-2" style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
        {layers.map(([label, items], i) => (
          <li
            key={label}
            className="flex items-baseline gap-3 border-b border-current/20 pb-2"
            style={{ paddingLeft: `${i * 0.75}rem` }}
          >
            <span className="eyebrow w-14 shrink-0">{label}</span>
            <span>{items.join(", ")}</span>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul aria-label="Key notes" className="flex flex-wrap gap-2" style={{ listStyle: "none", padding: 0, marginTop: 0 }}>
      {product.keyNotes.map((n) => (
        <li key={n} className={`rounded-full border px-3 py-1 text-sm ${chip}`}>
          {n}
        </li>
      ))}
    </ul>
  );
}
