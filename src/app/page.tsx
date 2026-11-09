import Link from "next/link";
import { Botanical, SprigDivider } from "@/components/Botanicals";
import { Button } from "@/components/Button";
import { HeroEffects } from "@/components/HeroEffects";
import { ImageSlot } from "@/components/ImageSlot";
import { LabelFrame } from "@/components/LabelFrame";
import { MomentCard } from "@/components/MomentCard";
import { Copy, NeededBox } from "@/components/Needed";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ScentStory } from "@/components/ScentStory";
import { Section, SectionHeading } from "@/components/Section";
import { SlotView } from "@/components/SlotView";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { getJournalPosts, getPlaces, getReviews, getSite } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { fileExists, getProductViews, resolveFirst, resolveSlot } from "@/lib/images";
import { real } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo";

const site = getSite();
export const metadata = pageMetadata({ title: site.brand.metaTitle, description: site.brand.metaDescription, path: "/" });

export default function HomePage() {
  const h = site.home;
  const places = getPlaces();
  const views = getProductViews();
  const reviews = getReviews().slice(0, 6);
  const posts = getJournalPosts().slice(0, 3);

  const video = resolveSlot("home.hero-video");
  const videoSrc = video.show === "image" ? video.src : undefined;
  const webm = videoSrc && fileExists(videoSrc.replace(/\.mp4$/, ".webm")) ? videoSrc.replace(/\.mp4$/, ".webm") : undefined;

  const promiseReady = site.promise.show && site.promise.items.every((i) => real(i.title) && real(i.text));
  const story = real(site.story.short);
  const delivery = [real(site.delivery.summary), real(site.delivery.payment)].filter(Boolean) as string[];

  return (
    <>
      {/* 1. Hero */}
      <section aria-labelledby="hero-title" className="on-dark relative isolate min-h-[min(44rem,88svh)] overflow-hidden bg-violet-900 text-cream-50">
        <div className="absolute inset-0 -z-10">
          <ImageSlot id="home.hero" priority sizes="100vw" className="!aspect-auto h-full" />
          <HeroEffects videoMp4={videoSrc} videoWebm={webm} />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900 via-violet-900/60 to-violet-900/25" />
        </div>
        <div className="mx-auto flex min-h-[inherit] max-w-page flex-col justify-end px-4 pb-12 pt-32 sm:px-6 md:pb-20">
          <p className="eyebrow">{site.brand.name}</p>
          <h1 id="hero-title" className="mt-2 max-w-3xl text-6xl text-cream-50 md:text-8xl">
            {site.brand.tagline}
          </h1>
          <p className="mt-4 max-w-xl text-lg md:text-xl">{site.brand.supportingLine}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/quiz" tone="dark">
              Find your scent
            </Button>
            <Button href="/shop" tone="dark" variant="secondary">
              Shop the range
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Four places to be Solo */}
      <Section labelledBy="places-title">
        <SectionHeading id="places-title" eyebrow={h.momentsEyebrow} title={h.momentsHeading} />
        <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {places.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 80}>
                <MomentCard place={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. The range */}
      <Section tone="alt" labelledBy="range-title">
        <SectionHeading id="range-title" eyebrow={h.rangeEyebrow} title={h.rangeHeading} />
        <div role="region" aria-label="Products" tabIndex={0} className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
          <ul className="flex snap-x snap-mandatory gap-4 lg:grid lg:grid-cols-4 lg:gap-6">
            {views.map((v) => (
              <li key={v.product.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
                <ProductCard view={v} />
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6">
          <Button href="/shop" variant="ghost">
            See all products
          </Button>
        </p>
      </Section>

      {/* 4. Scent story */}
      <ScentStory views={views} eyebrow={h.scentEyebrow} heading={h.scentHeading} intro={h.scentIntro} />

      {/* 5. Quiz teaser */}
      <Section labelledBy="quiz-teaser">
        <LabelFrame className="mx-auto max-w-3xl" innerClassName="text-center sm:py-12">
          <Botanical name="lavender" className="mx-auto h-16 w-8 text-gold-500" />
          <h2 id="quiz-teaser" className="mt-3 text-4xl text-cream-50 md:text-5xl">
            {h.quizHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg">{h.quizText}</p>
          <div className="mt-6">
            <Button href="/quiz" tone="dark">
              Start the quiz
            </Button>
          </div>
        </LabelFrame>
      </Section>

      {/* 6. Build your ritual */}
      <Section tone="alt" labelledBy="ritual-teaser">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <Reveal>
            <ImageSlot id="home.bundle" sizes="(min-width: 768px) 50vw, 100vw" className="rounded-sm" />
          </Reveal>
          <div>
            <p className="eyebrow mb-2">{h.ritualEyebrow}</p>
            <h2 id="ritual-teaser" className="text-4xl md:text-5xl">
              {h.ritualHeading}
            </h2>
            <p className="mt-3 text-lg">{h.ritualText}</p>
            <div className="mt-6">
              <Button href="/ritual">Build your ritual</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 7. The Solo's promise (hidden until the owner confirms it) */}
      {promiseReady ? (
        <Section tone="dark" labelledBy="promise-title">
          <SectionHeading id="promise-title" title={site.promise.heading} align="center" />
          <ul className="grid gap-8 md:grid-cols-3">
            {site.promise.items.map((it) => (
              <li key={it.title} className="text-center">
                <h3 className="text-2xl text-gold-300">{it.title}</h3>
                <p className="mt-2">{it.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        SHOW_DEV_HINTS && (
          <Section tone="light">
            <NeededBox label="The Solo's promise strip is hidden. Fill content/site.json → promise and set show to true." />
          </Section>
        )
      )}

      {/* 8. Our story (short) */}
      {(story || SHOW_DEV_HINTS) && (
        <Section labelledBy="story-title">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
            <ImageSlot id="home.story" sizes="(min-width: 768px) 40vw, 100vw" className="mx-auto w-full max-w-md rounded-sm" />
            <div>
              <p className="eyebrow mb-2">About Solo&apos;s</p>
              <h2 id="story-title" className="text-4xl md:text-5xl">
                {site.story.heading}
              </h2>
              <Copy value={site.story.short} className="mt-4 text-lg" />
              <p className="mt-6">
                <Button href="/about" variant="secondary">
                  Read our story
                </Button>
              </p>
            </div>
          </div>
        </Section>
      )}

      {/* 9. Proof: real reviews only. Hidden while there are none. */}
      {reviews.length > 0 && (
        <Section tone="alt" labelledBy="proof-title">
          <SectionHeading id="proof-title" title={h.proofHeading} />
          <ul className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => {
              const slot = resolveSlot(`home.proof.${i + 1}`);
              return (
                <li key={r.id}>
                  <figure>
                    {slot.show === "image" && <SlotView slot={slot} sizes="(min-width: 768px) 33vw, 100vw" className="mb-3 rounded-sm" />}
                    <blockquote className="font-display text-2xl">“{r.quote}”</blockquote>
                    <figcaption className="mt-2 text-sm">{r.name}</figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* 10. Journal teaser */}
      {posts.length > 0 && (
        <Section labelledBy="journal-title">
          <SectionHeading id="journal-title" eyebrow={h.journalEyebrow} title={h.journalHeading} />
          <ul className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 100}>
                  <Link href={`/journal/${p.slug}`} className="group block">
                    <div className="overflow-hidden rounded-sm">
                      <SlotView
                        slot={resolveFirst([`home.journal.${i + 1}`, `journal.${p.slug}.cover`])}
                        sizes="(min-width: 768px) 33vw, 100vw"
                      />
                    </div>
                    {p.draft && SHOW_DEV_HINTS && <p className="eyebrow mt-3 !text-ink-900">Draft</p>}
                    <h3 className="mt-3 text-2xl text-violet-700 group-hover:underline">{p.title}</h3>
                    <p className="mt-1">{p.excerpt}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 11. Closing band */}
      <Section tone="dark" labelledBy="closing-title">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <SprigDivider className="!mx-0 mb-4" />
            <h2 id="closing-title" className="text-4xl text-gold-300 md:text-5xl">
              {h.closingHeading}
            </h2>
            <p className="mt-3 text-lg">{h.closingText}</p>
            {delivery.length > 0 && (
              <ul className="mt-5 space-y-1 text-sm">
                {delivery.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <WhatsAppLink source="closing" variant="secondary" tone="dark">
                Or chat on WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </Section>
    </>
  );
}
