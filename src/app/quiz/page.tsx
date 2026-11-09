import { Breadcrumbs } from "@/components/Breadcrumbs";
import { QuizLoader } from "@/components/QuizLoader";
import { PageHeader, SectionHeading } from "@/components/Section";
import { getQuiz } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Find your scent",
  description: "Three questions, one scent that fits your day. Take the Mrennett scent quiz.",
  path: "/quiz",
});

export default function QuizPage() {
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Find your scent", path: "/quiz" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="The scent quiz" title="Find your scent" intro="Three questions, one scent that fits your day." />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6">
        <QuizLoader quiz={getQuiz()} />
      </div>
    </>
  );
}
