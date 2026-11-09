import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Markdown } from "@/components/Markdown";
import { PageHeader, SectionHeading } from "@/components/Section";
import { getLegal } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description: "Terms for using the Mrennett website and placing orders.",
  path: "/terms",
});

export default function TermsPage() {
  const doc = getLegal("terms");
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Terms", path: "/terms" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" title={doc.title} />
          {SHOW_DEV_HINTS && <p role="note" className="border-2 border-dashed border-gold-500 bg-gold-300/15 p-3 text-sm"><strong>Draft, requires owner and legal review.</strong></p>}
        </div>
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        {doc.updated && <p className="mb-4 text-sm">Last updated {doc.updated}</p>}
        <Markdown source={doc.body} />
      </div>
    </>
  );
}
