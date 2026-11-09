import { OrderSummary } from "@/components/OrderSummary";
import { PageHeader, SectionHeading } from "@/components/Section";
import { getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Order summary",
  description: "A printable summary of your Mrennett ritual.",
  path: "/order-summary",
  noindex: true,
});

export default function OrderSummaryPage() {
  return (
    <>
      <PageHeader>
        <SectionHeading as="h1" title="Your order summary" />
      </PageHeader>
      <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <OrderSummary products={getProducts()} />
      </div>
    </>
  );
}
