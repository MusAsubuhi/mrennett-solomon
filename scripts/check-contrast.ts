/** Checks every text/background colour pair the site uses against WCAG AA. */
const C = {
  "violet-900": "#2A1745", "violet-800": "#3B2463", "violet-700": "#523977", "violet-500": "#7B5AA6", "violet-100": "#EDE7F6",
  "gold-500": "#D1AA74", "gold-300": "#E8CC94", "cream-50": "#FAF6EF", "cream-200": "#EFE6D8", "ink-900": "#1E1330",
} as const;
type K = keyof typeof C;

const lum = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: K, b: K) => {
  const [x, y] = [lum(C[a]), lum(C[b])].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum ratio, where it is used]
const pairs: Array<[K, K, number, string]> = [
  ["ink-900", "cream-50", 4.5, "body text"],
  ["ink-900", "cream-200", 4.5, "body text on alternate panels"],
  ["ink-900", "violet-100", 4.5, "body text on tint panels"],
  ["violet-700", "cream-50", 4.5, "eyebrows, links, outlined buttons"],
  ["violet-700", "cream-200", 4.5, "eyebrows on alternate panels"],
  ["violet-700", "violet-100", 4.5, "outlined button hover"],
  ["cream-50", "violet-700", 4.5, "primary button, label frames"],
  ["cream-50", "violet-500", 4.5, "primary button hover"],
  ["cream-50", "violet-800", 4.5, "text on dark sections"],
  ["cream-50", "violet-900", 4.5, "text on footer"],
  ["gold-300", "violet-700", 4.5, "small gold text on label frames"],
  ["gold-300", "violet-800", 4.5, "eyebrows on dark"],
  ["gold-300", "violet-900", 4.5, "eyebrows on footer"],
  ["gold-500", "violet-800", 3, "large display text on dark"],
  ["gold-500", "violet-900", 3, "large display text on footer"],
  ["violet-900", "gold-500", 4.5, "button on dark (gold fill)"],
  ["violet-900", "gold-300", 4.5, "button hover on dark"],
];

let failed = 0;
for (const [fg, bg, min, use] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (needs ${min})  ${fg} on ${bg}  ${use}`);
}
console.log(failed ? `\n${failed} pair(s) fail WCAG AA` : "\nAll pairs pass WCAG AA.");
process.exit(failed ? 1 : 0);
