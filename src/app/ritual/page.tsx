import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RitualBuilder } from "@/components/RitualBuilder";
import { PageHeader, SectionHeading } from "@/components/Section";
import { getSite } from "@/lib/content";
import { getProductViews, resolveSlot } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Build your ritual",
  description: "Pick the Solo's products you want, see your set take shape, and send it on WhatsApp.",
  path: "/ritual",
});

export default function RitualPage() {
  const site = getSite();
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Build your ritual", path: "/ritual" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="Your set" title="Build your ritual" intro="Tick the moments you want. Keep the set for yourself or give it as a gift." />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6">
        <Suspense fallback={<p>Loading the builder…</p>}>
          <RitualBuilder
            views={getProductViews()}
            discountPercent={site.bundleDiscountPercent}
            prompt={site.ordering.whatsappPrompt}
            box={resolveSlot("ritual.box")}
            card={resolveSlot("ritual.card")}
          />
        </Suspense>
      </div>
    </>
  );
}
