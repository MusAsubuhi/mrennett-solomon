import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader, SectionHeading } from "@/components/Section";
import { ShopGrid } from "@/components/ShopGrid";
import { getMoods, getPlaces } from "@/lib/content";
import { getProductViews } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shop",
  description: "Solo's shower gel, hand wash, fabric softener and reed diffuser. Filter by where you use it or the mood you want.",
  path: "/shop",
});

export default function ShopPage() {
  const views = getProductViews();
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="The range" title="Shop Solo's" intro="Choose by where you want a moment: the shower, your hands, your laundry or your home." />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6">
        <Suspense fallback={<p>Loading products…</p>}>
          <ShopGrid views={views} places={getPlaces()} moods={getMoods()} />
        </Suspense>
      </div>
    </>
  );
}
