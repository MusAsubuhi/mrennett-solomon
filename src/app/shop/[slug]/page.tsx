import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Accordion, type AccordionItem } from "@/components/Accordion";
import { Gallery, type GalleryItem } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { NeededBox } from "@/components/Needed";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { ScentNotes } from "@/components/ScentNotes";
import { Section, SectionHeading } from "@/components/Section";
import { fallbackDescription, hasPrice, pairsWith, priceLabel, productTitle } from "@/lib/catalog";
import { getPlaces, getProduct, getProducts, getSite } from "@/lib/content";
import { SHOW_DEV_HINTS, CURRENCY } from "@/lib/env";
import { getProductViews, resolveSlot } from "@/lib/images";
import { real, todoLabel } from "@/lib/placeholders";
import { abs, ogImage, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const pack = resolveSlot(p.images.packshot);
  return pageMetadata({
    title: productTitle(p),
    description: real(p.shortDescription) ?? fallbackDescription(p),
    path: `/shop/${p.slug}`,
    image: pack.show === "image" ? abs(pack.src) : ogImage(),
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const site = getSite();
  const place = getPlaces().find((pl) => pl.id === p.place);
  const all = getProducts();
  const viewsById = new Map(getProductViews().map((v) => [v.product.id, v]));
  const pairs = pairsWith(all, p).map((o) => viewsById.get(o.id)!);

  // Gallery: in production show only pictures that exist (or one placeholder if none do).
  const items: GalleryItem[] = [
    { slot: resolveSlot(p.images.packshot), label: "the pack" },
    { slot: resolveSlot(p.images.labelDetail), label: "label detail" },
    { slot: resolveSlot(p.images.lifestyle), label: "in its place" },
    { slot: resolveSlot(p.images.inUse), label: "in use" },
  ];
  const visible = items.filter((i) => i.slot.show === "image" || SHOW_DEV_HINTS);
  const galleryItems = visible.length ? visible : [items[0]];

  const desc = real(p.shortDescription);
  const how = real(p.howToUse);
  const ingredients = real(p.ingredients);
  const deliveryBits = [
    ["Delivery", real(site.delivery.summary)],
    ["Areas and times", real(site.delivery.areas)],
    ["Payment", real(site.delivery.payment)],
    ["Returns", real(site.delivery.returns)],
  ].filter(([, v]) => v) as Array<[string, string]>;

  const detail: AccordionItem[] = [
    {
      id: "scent",
      title: "Scent",
      content: (
        <>
          <ScentNotes product={p} />
          {!p.notesConfirmed && SHOW_DEV_HINTS && <NeededBox className="mt-3" label="Top, heart and base notes not confirmed yet" />}
        </>
      ),
    },
    ...(how || SHOW_DEV_HINTS ? [{ id: "use", title: "How to use", content: how ? <p>{how}</p> : <NeededBox label={todoLabel(p.howToUse)} /> }] : []),
    ...(ingredients || SHOW_DEV_HINTS
      ? [{ id: "ingredients", title: "Ingredients", content: ingredients ? <p>{ingredients}</p> : <NeededBox label="Ingredient list needed. Hidden until supplied." /> }]
      : []),
    ...(deliveryBits.length || SHOW_DEV_HINTS
      ? [
          {
            id: "delivery",
            title: "Delivery and returns",
            content: deliveryBits.length ? (
              <dl className="space-y-2">
                {deliveryBits.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-medium">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <NeededBox label="Delivery, payment and returns details needed (content/site.json → delivery)" />
            ),
          },
        ]
      : []),
  ];

  const pack = resolveSlot(p.images.packshot);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productTitle(p),
    description: desc ?? fallbackDescription(p),
    brand: { "@type": "Brand", name: site.brand.name },
    ...(pack.show === "image" ? { image: abs(pack.src) } : {}),
    url: abs(`/shop/${p.slug}`),
    // Offer only when the owner has confirmed a price. No ratings unless real reviews exist.
    ...(hasPrice(p)
      ? {
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: CURRENCY,
            url: abs(`/shop/${p.slug}`),
            ...(p.inStock === true ? { availability: "https://schema.org/InStock" } : p.inStock === false ? { availability: "https://schema.org/OutOfStock" } : {}),
          },
        }
      : {}),
  };

  return (
    <>
      <div className="mx-auto max-w-page px-4 pt-6 sm:px-6">
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: productTitle(p), path: `/shop/${p.slug}` }]} />
      </div>

      <div className="mx-auto grid max-w-page gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <Gallery items={galleryItems} title={productTitle(p)} />

        <div>
          {place && (
            <p className="eyebrow">
              <Link href={`/moments/${place.id}`} className="underline-offset-4 hover:underline">
                {place.label}
              </Link>
            </p>
          )}
          <h1 className="mt-1 text-5xl md:text-6xl">{p.name}</h1>
          <p className="mt-1 font-display text-3xl italic text-violet-700">{p.scentName}</p>
          <p className="mt-3 text-lg">
            {p.sizeLabel} · <span className="font-medium">{priceLabel(p)}</span>
          </p>

          <div className="mt-4">
            <ScentNotes product={p} />
          </div>

          {desc ? <p className="prose-solos mt-5">{desc}</p> : SHOW_DEV_HINTS && <NeededBox className="mt-5" label={todoLabel(p.shortDescription)} />}

          {p.claims.length > 0 && (
            <ul className="mt-4 list-disc pl-5">
              {p.claims.map((c) => (
                <li key={c.text}>{c.text}</li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <ProductActions product={p} prompt={site.ordering.whatsappPrompt} />
          </div>

          <div className="mt-8">
            <Accordion items={detail} defaultOpenFirst />
          </div>
        </div>
      </div>

      <Section tone="alt" labelledBy="pairs-title">
        <SectionHeading id="pairs-title" eyebrow="Pairs well with" title="More for your ritual" />
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pairs.map((v) => (
            <li key={v.product.id}>
              <ProductCard view={v} />
            </li>
          ))}
        </ul>
      </Section>

      <JsonLd data={jsonLd} />
    </>
  );
}
