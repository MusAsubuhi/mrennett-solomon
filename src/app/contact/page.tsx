import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { ImageSlot } from "@/components/ImageSlot";
import { NeededBox } from "@/components/Needed";
import { PageHeader, SectionHeading } from "@/components/Section";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { getSite } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { resolveSlot } from "@/lib/images";
import { real, todoLabel } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Message Mrennett on WhatsApp, or use the contact form.",
  path: "/contact",
});

export default function ContactPage() {
  const { contact, socials } = getSite();
  const rows: Array<[string, string]> = [
    ["Phone", contact.phone],
    ["Email", contact.email],
    ["Location", contact.location],
    ["Hours", contact.hours],
  ];
  const banner = resolveSlot("contact.banner");
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="Contact" title="Say hello" intro="The quickest way to reach us is WhatsApp." />
        </div>
      </PageHeader>

      {(banner.show === "image" || SHOW_DEV_HINTS) && (
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <ImageSlot id="contact.banner" sizes="(min-width: 1200px) 1200px, 100vw" className="rounded-sm" />
        </div>
      )}

      <div className="mx-auto grid max-w-page gap-12 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <WhatsAppLink source="contact">Chat on WhatsApp</WhatsAppLink>
          <dl className="mt-8 space-y-4">
            {rows.map(([label, value]) =>
              real(value) ? (
                <div key={label}>
                  <dt className="eyebrow">{label}</dt>
                  <dd className="text-lg">{value}</dd>
                </div>
              ) : SHOW_DEV_HINTS ? (
                <div key={label}>
                  <dt className="eyebrow">{label}</dt>
                  <dd>
                    <NeededBox label={todoLabel(value)} />
                  </dd>
                </div>
              ) : null,
            )}
          </dl>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-violet-700 underline underline-offset-4">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="mb-4 text-3xl">Or send a message</h2>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
