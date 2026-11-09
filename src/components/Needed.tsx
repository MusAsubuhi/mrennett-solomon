import type { ReactNode } from "react";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { real, todoLabel } from "@/lib/placeholders";
import { cn } from "@/lib/cn";

/** Dashed gold "Content needed" outline. Only ever rendered in dev / preview. */
export function NeededBox({ label, className, children }: { label: string; className?: string; children?: ReactNode }) {
  if (!SHOW_DEV_HINTS) return null;
  return (
    <div className={cn("rounded-sm border-2 border-dashed border-gold-500 bg-gold-300/15 p-3 text-sm", className)}>
      <span className="eyebrow mr-2 !text-violet-700">Content needed</span>
      <span>{label}</span>
      {children}
    </div>
  );
}

/**
 * Renders real copy; otherwise a "Content needed" box in dev / preview, and
 * nothing at all in production. A [[TODO string is never shown to a visitor.
 */
export function Copy({
  value,
  as: Tag = "p",
  className,
}: {
  value: string | null | undefined;
  as?: "p" | "span" | "div" | "h2" | "h3";
  className?: string;
}) {
  const text = real(value);
  if (text) return <Tag className={className}>{text}</Tag>;
  return <NeededBox label={todoLabel(value)} className={className} />;
}
