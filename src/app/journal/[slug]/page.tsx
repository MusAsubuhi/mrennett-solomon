import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageSlot } from "@/components/ImageSlot";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { ProductCard } from "@/components/ProductCard";
import { Section } from "@/components/Section";
import { getJournalPost, getJournalPosts, getSite } from "@/lib/content";
import { SHOW_DEV_HINTS, SITE_URL } from "@/lib/env";
import { getProductViews, resolveSlot } from "@/lib/images";
import { abs, ogImage, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return getJournalPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) return {};
  const cover = resolveSlot(`journal.${slug}.cover`);
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${slug}`,
    image: cover.show === "image" ? abs(cover.src) : ogImage(),
    noindex: post.draft,
  });
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getJournalPost(slug);
  if (!post) notFound();
  const cover = resolveSlot(`journal.${slug}.cover`);
  const related = getProductViews().filter((v) => post.products.includes(v.product.id));

  return (
    <>
      <article>
        <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
          <Breadcrumbs items={[{ name: "Journal", path: "/journal" }, { name: post.title, path: `/journal/${slug}` }]} />
          {post.draft && SHOW_DEV_HINTS && (
            <p role="note" className="mt-4 border-2 border-dashed border-gold-500 bg-gold-300/15 p-3 text-sm">
              <strong>Draft.</strong> The owner needs to approve this post. It is hidden in production until &quot;draft: true&quot; is removed.
            </p>
          )}
          <p className="eyebrow mt-6">
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · {post.readingMinutes} min read
          </p>
          <h1 className="mt-2 text-5xl md:text-6xl">{post.title}</h1>
        </div>
        <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6">
          <ImageSlot id={`journal.${slug}.cover`} priority sizes="(min-width: 1024px) 960px, 100vw" className="rounded-sm" />
        </div>
        <div className="mx-auto max-w-3xl px-4 py-10 text-lg sm:px-6">
          <Markdown source={post.body} />
        </div>
      </article>

      {related.length > 0 && (
        <Section tone="alt" labelledBy="related">
          <h2 id="related" className="mb-6 text-4xl">
            Mentioned in this post
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v) => (
              <li key={v.product.id}>
                <ProductCard view={v} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          ...(cover.show === "image" ? { image: abs(cover.src) } : {}),
          author: { "@type": "Organization", name: getSite().brand.name },
          publisher: { "@type": "Organization", name: getSite().brand.name, url: SITE_URL },
          mainEntityOfPage: abs(`/journal/${slug}`),
        }}
      />
    </>
  );
}
