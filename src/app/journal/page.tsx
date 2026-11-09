import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader, SectionHeading } from "@/components/Section";
import { SlotView } from "@/components/SlotView";
import { getJournalPosts } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { resolveSlot } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Journal",
  description: "Shower notes: small, calm reads about scent, laundry and evening routines.",
  path: "/journal",
});

export default function JournalPage() {
  const posts = getJournalPosts();
  return (
    <>
      <PageHeader>
        <Breadcrumbs items={[{ name: "Journal", path: "/journal" }]} />
        <div className="mt-6">
          <SectionHeading as="h1" eyebrow="Shower notes" title="The journal" />
        </div>
      </PageHeader>
      <div className="mx-auto max-w-page px-4 pb-16 sm:px-6">
        {posts.length === 0 ? (
          <p>New posts are on the way.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/journal/${p.slug}`} className="group block">
                  <SlotView slot={resolveSlot(`journal.${p.slug}.cover`)} sizes="(min-width: 768px) 33vw, 100vw" className="rounded-sm" />
                  <p className="eyebrow mt-3">
                    {p.readingMinutes} min read{p.draft && SHOW_DEV_HINTS ? " · Draft" : ""}
                  </p>
                  <h2 className="mt-1 text-3xl text-violet-700 group-hover:underline">{p.title}</h2>
                  <p className="mt-1">{p.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
