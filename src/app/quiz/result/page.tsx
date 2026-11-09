import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuizResult } from "@/components/QuizResult";
import { PageHeader, SectionHeading } from "@/components/Section";
import { getMoods } from "@/lib/content";
import { getProductViews } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Your scent",
  description: "Your Mrennett scent mood and the products that match it.",
  path: "/quiz/result",
  noindex: true,
});

export default function QuizResultPage() {
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Find your scent", path: "/quiz" }, { name: "Your scent", path: "/quiz/result" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" title="Your scent" />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6">
        <Suspense fallback={<p>Loading your result…</p>}>
          <QuizResult moods={getMoods()} views={getProductViews()} />
        </Suspense>
      </div>
    </>
  );
}
