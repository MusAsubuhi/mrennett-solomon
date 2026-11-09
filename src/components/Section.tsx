import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const tones = {
  light: "bg-cream-50",
  alt: "bg-cream-200",
  tint: "bg-violet-100",
  dark: "on-dark bg-botanical bg-violet-800 text-cream-50",
} as const;

export function Section({
  tone = "light",
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  tone?: keyof typeof tones;
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn(tones[tone], className)}>
      <div className={cn("mx-auto max-w-page px-4 py-14 sm:px-6 md:py-20", innerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-8 max-w-2xl md:mb-12", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <Tag id={id} className="text-4xl md:text-5xl">
        {title}
      </Tag>
      {intro && <p className="mt-3 text-lg">{intro}</p>}
    </div>
  );
}

/** Page-top wrapper for inner pages: breadcrumb slot plus a heading. */
export function PageHeader({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "alt" }) {
  return (
    <div className={tone === "alt" ? "bg-cream-200" : "bg-cream-50"}>
      <div className="mx-auto max-w-page px-4 pb-6 pt-6 sm:px-6 md:pb-10 md:pt-8">{children}</div>
    </div>
  );
}
