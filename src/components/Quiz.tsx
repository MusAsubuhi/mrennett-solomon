"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { scoreQuiz } from "@/lib/quiz";
import type { QuizData } from "@/lib/types";
import { Button } from "./Button";
import { LabelFrame } from "./LabelFrame";

/** Three-question scent quiz. Radio groups (keyboard friendly), progress text, and a back button. */
export default function Quiz({ quiz }: { quiz: QuizData }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const total = quiz.questions.length;
  const q = quiz.questions[step];
  const chosen = picks[step];

  useEffect(() => {
    track("quiz_started");
  }, []);
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
  }, [step]);

  function next() {
    if (chosen === undefined) return;
    if (step < total - 1) {
      setStep(step + 1);
      return;
    }
    const mood = scoreQuiz(quiz, picks);
    track("quiz_completed", { mood });
    router.push(`/quiz/result?m=${mood}`);
  }

  return (
    <LabelFrame className="mx-auto max-w-2xl">
      <p className="eyebrow" aria-live="polite">
        Question {step + 1} of {total}
      </p>
      <div
        className="mt-2 h-1.5 w-full bg-white/20"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step + 1}
      >
        <div className="h-full bg-gold-500 transition-[width] duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="mt-6"
      >
        <fieldset>
          <legend className="sr-only">{q.prompt}</legend>
          <h2 ref={headingRef} tabIndex={-1} className="text-3xl text-cream-50 outline-none md:text-4xl">
            {q.prompt}
          </h2>
          <div className="mt-5 space-y-3">
            {q.answers.map((a, i) => (
              <label
                key={`${q.id}-${i}`}
                className={`flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 text-lg transition-colors ${
                  chosen === i ? "border-gold-500 bg-white/15" : "border-gold-500/40 hover:bg-white/10"
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={i}
                  checked={chosen === i}
                  onChange={() => setPicks((p) => Object.assign([...p], { [step]: i }))}
                  className="size-5 shrink-0 accent-gold-500"
                />
                <span>{a.label}</span>
                {chosen === i && <span className="sr-only"> (selected)</span>}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="ghost" tone="dark" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          <Button type="submit" tone="dark" disabled={chosen === undefined}>
            {step === total - 1 ? "See my scent" : "Next"}
          </Button>
        </div>
      </form>
    </LabelFrame>
  );
}
