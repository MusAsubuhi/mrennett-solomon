import { Accordion } from "@/components/Accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { NeededBox } from "@/components/Needed";
import { PageHeader, SectionHeading } from "@/components/Section";
import { Button } from "@/components/Button";
import { getFaq } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { real, todoLabel } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Delivery, payment and help",
  description: "How to order from Solo's, delivery, payment, returns and product care.",
  path: "/help",
});

export default function HelpPage() {
  const faq = getFaq().filter((f) => SHOW_DEV_HINTS || real(f.answer));
  const answered = faq.filter((f) => real(f.answer));
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Help", path: "/help" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="Help" title="Delivery, payment and questions" />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <Accordion
          defaultOpenFirst
          items={faq.map((f) => ({
            id: f.id,
            title: f.question,
            content: real(f.answer) ? <p>{f.answer}</p> : <NeededBox label={todoLabel(f.answer)} />,
          }))}
        />
        <div className="mt-10">
          <p className="text-lg">Still have a question?</p>
          <div className="mt-3">
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </div>
      </div>
      {answered.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: answered.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      )}
    </>
  );
}
