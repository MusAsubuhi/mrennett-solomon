import fs from "node:fs";
import path from "node:path";
import { getImages } from "../src/lib/content";

const rows = Object.entries(getImages()).map(([id, s]) => {
  const exists = /^https?:/.test(s.src) || fs.existsSync(path.join(process.cwd(), s.devOnly ? "" : "public", s.src));
  return { slot: id, status: s.status, file: exists ? "yes" : "MISSING", required: s.required ? "yes" : "no", path: s.src };
});

const w = (k: keyof (typeof rows)[number]) => Math.max(k.length, ...rows.map((r) => r[k].length));
const cols = (["slot", "status", "file", "required", "path"] as const).map((k) => [k, w(k)] as const);
const line = (r: Record<string, string>) => cols.map(([k, n]) => r[k].padEnd(n)).join("  ");
console.log(line({ slot: "slot", status: "status", file: "file", required: "required", path: "path" }));
console.log(cols.map(([, n]) => "-".repeat(n)).join("  "));
for (const r of rows) console.log(line(r));

const final = rows.filter((r) => r.status === "final").length;
console.log(`\n${final} of ${rows.length} slots are final. ${rows.filter((r) => r.required === "yes" && r.status !== "final").length} required slots still need images.`);
