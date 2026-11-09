import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ImageSlot } from "@/components/ImageSlot";
import { Copy } from "@/components/Needed";
import { Section } from "@/components/Section";
import { getAbout } from "@/lib/content";
import { SHOW_DEV_HINTS } from "@/lib/env";
import { resolveSlot } from "@/lib/images";
import { real } from "@/lib/placeholders";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our story",
  description: "The story behind Mrennett and how the products are made.",
  path: "/about",
});

export default function AboutPage() {
  const a = getAbout();
  const optional = (id: string) => SHOW_DEV_HINTS || resolveSlot(id).show === "image";
  const show = (v: string) => SHOW_DEV_HINTS || real(v);

  return (
    <>
      <div className="on-dark relative isolate overflow-hidden bg-violet-900 text-cream-50">
        <div className="absolute inset-0 -z-10">
          <ImageSlot id="about.hero" priority sizes="100vw" className="!aspect-auto h-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-900 via-violet-900/60 to-violet-900/25" />
        </div>
        <div className="mx-auto flex min-h-[20rem] max-w-page flex-col justify-end px-4 pb-10 pt-24 sm:px-6 md:min-h-[28rem]">
          <Breadcrumbs items={[{ name: "Our story", path: "/about" }]} />
          <h1 className="mt-4 text-6xl text-cream-50 md:text-7xl">{a.heading}</h1>
        </div>
      </div>

      <Section>
        <div className="max-w-3xl">
          <Copy value={a.intro} className="text-xl md:text-2xl" />
        </div>
      </Section>

      {show(a.founder.story) && (
        <Section tone="alt" labelledBy="founder">
          <div className="grid items-start gap-8 md:grid-cols-[1fr_1.3fr] md:gap-14">
            <ImageSlot id="about.maker" sizes="(min-width: 768px) 40vw, 100vw" className="mx-auto w-full max-w-md rounded-sm" />
            <div>
              <p className="eyebrow mb-2">The maker</p>
              <h2 id="founder" className="text-4xl">
                <Copy value={a.founder.name} as="span" />
              </h2>
              <Copy value={a.founder.story} className="prose-mrennett mt-4 whitespace-pre-line" />
            </div>
          </div>
        </Section>
      )}

      {show(a.stands) && (
        <Section labelledBy="stands">
          <h2 id="stands" className="text-4xl">
            What Mrennett stands for
          </h2>
          <Copy value={a.stands} className="prose-mrennett mt-4" />
        </Section>
      )}

      {(show(a.making) || show(a.ingredients)) && (
        <Section tone="alt" labelledBy="making">
          <h2 id="making" className="text-4xl">
            How it is made
          </h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {show(a.making) && (
              <div className="space-y-4">
                <Copy value={a.making} className="prose-mrennett" />
                {optional("about.workshop") && <ImageSlot id="about.workshop" sizes="(min-width: 768px) 50vw, 100vw" className="rounded-sm" />}
              </div>
            )}
            {show(a.ingredients) && (
              <div className="space-y-4">
                <Copy value={a.ingredients} className="prose-mrennett" />
                {optional("about.ingredients") && <ImageSlot id="about.ingredients" sizes="(min-width: 768px) 50vw, 100vw" className="rounded-sm" />}
              </div>
            )}
          </div>
        </Section>
      )}
    </>
  );
}
