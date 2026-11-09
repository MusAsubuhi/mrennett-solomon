import Link from "next/link";
import { getSite } from "@/lib/content";
import { real } from "@/lib/placeholders";
import { Botanical } from "./Botanicals";
import { ImageSlot } from "./ImageSlot";
import { WhatsAppLink } from "./WhatsAppLink";

export function Footer() {
  const site = getSite();
  const { contact, socials, nav } = site;
  const year = new Date().getFullYear();
  const contactRows: Array<[string, string | null]> = [
    ["Phone", real(contact.phone)],
    ["Email", real(contact.email)],
    ["Location", real(contact.location)],
  ];
  const shown = contactRows.filter(([, v]) => v);

  return (
    <footer className="on-dark bg-botanical bg-violet-900 text-cream-50">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="w-32">
              <ImageSlot id="brand.logo-gold" sizes="128px" fit="contain" />
            </div>
            <p className="mt-3 max-w-sm font-display text-xl italic text-gold-300">{site.brand.tagline}</p>
            <Botanical name="lavender" className="mt-4 h-16 w-8 text-gold-500" />
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow !text-gold-300 font-sans text-sm">Explore</h2>
            <ul className="mt-3 space-y-1">
              {[...nav, { label: "Contact", href: "/contact" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow !text-gold-300 font-sans text-sm">Talk to us</h2>
            <ul className="mt-3 space-y-1">
              {shown.map(([label, value]) => (
                <li key={label}>
                  <span className="sr-only">{label}: </span>
                  {value}
                </li>
              ))}
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline" rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <WhatsAppLink source="footer" variant="secondary" tone="dark">
                Chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gold-500/30 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand.name}
          </p>
          <ul className="flex gap-x-5">
            <li>
              <Link href="/privacy" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
