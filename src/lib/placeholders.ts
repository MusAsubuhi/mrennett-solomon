/** Placeholder policy (brief section 12). Unknown content is null or "[[TODO: ...]]". */

export function isTodo(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "" || value.trim().startsWith("[[TODO");
  return false;
}

/** The text a visitor may see, or null if it is still a placeholder. */
export function real(value: string | null | undefined): string | null {
  return isTodo(value) ? null : (value as string);
}

/** Pulls the instruction out of "[[TODO: something]]" for the dev-only label. */
export function todoLabel(value: string | null | undefined): string {
  if (!value) return "Content needed";
  const m = value.match(/^\[\[TODO:?\s*([\s\S]*?)\]\]$/);
  return m ? m[1] : "Content needed";
}
