"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QUIZ_CATEGORY_BY_ID } from "@/lib/content";
import type { QuizCategory } from "@/types";

interface CatStat {
  attempts: number;
  correct: number;
}

interface StatsState {
  byCategory: Record<string, CatStat>;
  /** Record an answer; resolves the category from the quiz id. */
  recordByQuizId: (id: string, correct: boolean) => void;
  reset: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      byCategory: {},
      recordByQuizId: (id, correct) => {
        const cat = QUIZ_CATEGORY_BY_ID[id] as QuizCategory | undefined;
        if (!cat) return; // scenarios / exams aren't categorised here
        set((s) => {
          const prev = s.byCategory[cat] ?? { attempts: 0, correct: 0 };
          return {
            byCategory: {
              ...s.byCategory,
              [cat]: {
                attempts: prev.attempts + 1,
                correct: prev.correct + (correct ? 1 : 0),
              },
            },
          };
        });
      },
      reset: () => set({ byCategory: {} }),
    }),
    { name: "football-iq-stats" }
  )
);
