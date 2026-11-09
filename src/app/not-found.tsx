import { Botanical } from "@/components/Botanicals";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="on-dark bg-botanical bg-violet-800 text-cream-50">
      <div className="mx-auto flex max-w-page flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
        <Botanical name="eucalyptus" className="h-28 w-14 text-gold-500" />
        <p className="eyebrow mt-4">Error 404</p>
        <h1 className="mt-2 text-5xl text-cream-50 md:text-7xl">This page has wandered off</h1>
        <p className="mt-3 max-w-md text-lg">The page you were looking for is not here. Let us take you somewhere calm.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/shop" tone="dark">
            Shop the range
          </Button>
          <Button href="/" tone="dark" variant="secondary">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
