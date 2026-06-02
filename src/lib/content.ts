import { QUIZZES } from "@/data/quizzes";
import { SCENARIOS } from "@/data/scenarios";
import type { RunnerItem } from "@/components/learn/QuizRunner";

/** Every quiz + scenario as a uniform RunnerItem, indexed by id. */
export const RUNNER_ITEMS: RunnerItem[] = [
  ...QUIZZES.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    scene: q.scene,
    options: q.options,
    xp: q.xp,
  })),
  ...SCENARIOS.map((s) => ({
    id: s.id,
    prompt: s.question,
    context: `${s.title} — ${s.situation}`,
    scene: s.scene,
    options: s.options,
    xp: s.xp,
  })),
];

export const RUNNER_INDEX: Record<string, RunnerItem> = Object.fromEntries(
  RUNNER_ITEMS.map((i) => [i.id, i])
);

export const ALL_RUNNER_IDS = RUNNER_ITEMS.map((i) => i.id);

/** Deterministic shuffle using a numeric seed (no Math.random for stability). */
export function shuffleSeeded<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
