import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Tone = "light" | "dark"; // the background the button sits on

type Shared = { variant?: Variant; tone?: Tone; className?: string; children: ReactNode };
type AsButton = Shared & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Shared & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const base =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-sm px-6 py-2.5 text-[0.9375rem] font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const styles: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-violet-700 text-cream-50 hover:bg-violet-500",
    secondary: "border border-violet-700 text-violet-700 hover:bg-violet-100",
    ghost: "text-violet-700 underline-offset-4 hover:underline",
  },
  dark: {
    primary: "bg-gold-500 text-violet-900 hover:bg-gold-300",
    secondary: "border border-gold-500 text-cream-50 hover:bg-white/10",
    ghost: "text-cream-50 underline-offset-4 hover:underline",
  },
};

export function buttonClass(variant: Variant = "primary", tone: Tone = "light", className?: string) {
  return cn(base, styles[tone][variant], tone === "dark" && "on-dark", className);
}

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", tone = "light", className, children, ...rest } = props;
  const cls = buttonClass(variant, tone, className);
  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    const external = /^(https?:|mailto:|tel:)/.test(href);
    return external ? (
      <a href={href} className={cls} {...anchor}>
        {children}
      </a>
    ) : (
      <Link href={href} className={cls} {...anchor}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
