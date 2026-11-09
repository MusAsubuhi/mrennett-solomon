import Link from "next/link";
import { getSite } from "@/lib/content";
import { CartButton } from "./CartButton";
import { HeaderScroll } from "./HeaderScroll";
import { ImageSlot } from "./ImageSlot";
import { MenuToggle } from "./MenuToggle";
import { WhatsAppLink } from "./WhatsAppLink";

export function Header() {
  const { nav, brand } = getSite();
  return (
    <header
      id="site-header"
      data-scrolled="false"
      className="group/header sticky top-0 z-40 border-b border-violet-700/15 bg-cream-50/95 backdrop-blur"
    >
      <HeaderScroll />
      <div className="mx-auto flex h-16 max-w-page items-center justify-between gap-3 px-4 transition-[height] duration-300 group-data-[scrolled=true]/header:h-12 sm:px-6">
        <Link href="/" aria-label={`${brand.name}, home`} className="block w-24 shrink-0 transition-[width] duration-300 group-data-[scrolled=true]/header:w-20 sm:w-28">
          <ImageSlot id="brand.logo-violet" sizes="120px" fit="contain" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-violet-700 underline-offset-8 hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <WhatsAppLink source="header" className="hidden !px-4 md:inline-flex">
            Order on WhatsApp
          </WhatsAppLink>
          <CartButton />
          <MenuToggle nav={nav} />
        </div>
      </div>
    </header>
  );
}
