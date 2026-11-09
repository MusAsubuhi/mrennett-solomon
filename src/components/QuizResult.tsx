"use client";
import { useSearchParams } from "next/navigation";
import type { Mood, ProductView } from "@/lib/types";
import { useToast } from "@/lib/toast";
import { Botanical } from "./Botanicals";
import { Button } from "./Button";
import { LabelFrame } from "./LabelFrame";
import { ProductCard } from "./ProductCard";

export function QuizResult({ moods, views }: { moods: Mood[]; views: ProductView[] }) {
  const params = useSearchParams();
  const show = useToast((s) => s.show);
  const mood = moods.find((m) => m.id === params.get("m"));

  if (!mood) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg">We could not find that result.</p>
        <div className="mt-4">
          <Button href="/quiz">Take the quiz</Button>
        </div>
      </div>
    );
  }

  const picks = views.filter((v) => v.product.moods.includes(mood.id));
  const ids = picks.map((v) => v.product.id).join(",");

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `My Mrennett scent is ${mood!.name}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      show("Link copied.");
    } catch {
      show("Copy this page's address to share your result.");
    }
  }

  return (
    <div>
      <LabelFrame className="mx-auto max-w-2xl" innerClassName="text-center">
        <Botanical name={mood.illustration} className="mx-auto h-24 w-14 text-gold-500" />
        <p className="eyebrow mt-3">Your scent mood</p>
        <h2 className="mt-1 text-6xl text-gold-300">{mood.name}</h2>
        <p className="mx-auto mt-3 max-w-md text-lg">{mood.description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={`/ritual?items=${ids}`} tone="dark">
            Build this ritual
          </Button>
          <Button tone="dark" variant="secondary" onClick={share}>
            Share my result
          </Button>
        </div>
      </LabelFrame>

      <h3 className="mt-12 text-3xl">Made for your {mood.name.toLowerCase()} moments</h3>
      <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((v) => (
          <li key={v.product.id}>
            <ProductCard view={v} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center">
        <Button href="/quiz" variant="ghost">
          Retake the quiz
        </Button>
      </p>
    </div>
  );
}
