import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A violet panel with a thin double gold frame, echoing the product labels.
 * Used for feature cards, the quiz, the ritual builder and call-outs.
 */
export function LabelFrame({
  children,
  className,
  innerClassName,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("on-dark bg-violet-700 p-1.5 text-cream-50 sm:p-2", className)}>
      <div className="border border-gold-500 p-1 sm:p-1.5">
        <div className={cn("border border-gold-500/60 p-5 sm:p-8", innerClassName)}>{children}</div>
      </div>
    </Tag>
  );
}
