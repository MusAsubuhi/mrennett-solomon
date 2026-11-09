import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import { ImageSlot } from "@/components/ImageSlot";
import { ProductCard } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { getPlace, getPlaces } from "@/lib/content";
import { getProductViews, resolveSlot } from "@/lib/images";
import { abs, ogImage, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return getPlaces().map((p) => ({ place: p.id }));
}

type Props = { params: Promise<{ place: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { place } = await params;
  const info = getPlace(place);
  if (!info) return {};
  const hero = resolveSlot(`moment.${info.id}.hero`);
  return pageMetadata({
    title: info.heading,
    description: info.metaDescription,
    path: `/moments/${info.id}`,
    image: hero.show === "image" ? abs(hero.src) : ogImage(),
  });
}

export default async function MomentPage({ params }: Props) {
  const { place } = await params;
  const info = getPlace(place);
  if (!info) notFound();
  const view = getProductViews().find((v) => v.product.id === info.productId);
  const others = getPlaces().filter((p) => p.id !== info.id);

  return (
    <>
      <div className="on-dark relative isolate overflow-hidden bg-violet-900 text-cream-50">
        <div className="absolute inset-0 -z-10">
          <ImageSlot id={`moment.${info.id}.hero`} priority sizes="100vw" className="!aspect-auto h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900 via-violet-900/55 to-violet-900/20" />
        </div>
        <div className="mx-auto flex min-h-[22rem] max-w-page flex-col justify-end px-4 pb-10 pt-24 sm:px-6 md:min-h-[30rem]">
          <Breadcrumbs items={[{ name: info.heading, path: `/moments/${info.id}` }]} />
          <h1 className="mt-4 text-6xl text-cream-50 md:text-7xl">{info.heading}</h1>
          <p className="mt-2 max-w-xl text-xl">{info.intro}</p>
        </div>
      </div>

      <Section>
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <p className="eyebrow mb-2">{info.momentLine}</p>
            <p className="prose-mrennett text-lg">{info.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/quiz">Find your scent</Button>
              <Button href={`/shop?place=${info.id}`} variant="secondary">
                Shop {info.label.toLowerCase()}
              </Button>
            </div>
          </div>
          {view && (
            <div className="max-w-sm">
              <ProductCard view={view} />
            </div>
          )}
        </div>
      </Section>

      <Section tone="alt">
        <h2 className="text-3xl">Other places for your moment</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.id}>
              <Link href={`/moments/${o.id}`} className="inline-flex min-h-11 items-center rounded-full border border-violet-700 px-5 text-violet-700 hover:bg-violet-100">
                {o.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
