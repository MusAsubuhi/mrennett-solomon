import type { MoodId, QuizData } from "./types";

/**
 * Scores the quiz. `picks` holds the chosen answer index for each question.
 * Each answer adds a point to every mood it lists. Ties resolve in quiz.json → tieOrder
 * (calm, fresh, bright).
 */
export function scoreQuiz(quiz: QuizData, picks: number[]): MoodId {
  const score: Record<MoodId, number> = { calm: 0, bright: 0, fresh: 0 };
  picks.forEach((pick, qi) => {
    quiz.questions[qi]?.answers[pick]?.moods.forEach((m) => (score[m] += 1));
  });
  const max = Math.max(...Object.values(score));
  return quiz.tieOrder.find((m) => score[m] === max) ?? quiz.tieOrder[0];
}
