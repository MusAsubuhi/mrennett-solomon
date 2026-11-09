"use client";
import dynamic from "next/dynamic";
import type { QuizData } from "@/lib/types";

// Lazy-loaded: the quiz code is only fetched on /quiz.
const Quiz = dynamic(() => import("./Quiz"), {
  ssr: false,
  loading: () => <p className="text-center">Loading the quiz…</p>,
});

export function QuizLoader({ quiz }: { quiz: QuizData }) {
  return <Quiz quiz={quiz} />;
}
