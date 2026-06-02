"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levelFromXp } from "@/lib/ranks";
import { todayKey } from "@/lib/utils";
import type { GameSnapshot } from "@/types";

interface GameState extends GameSnapshot {
  lastActiveDay: string | null;
  completedModuleIds: string[];
  completedQuizIds: string[];
  isPremium: boolean;
  // derived helper
  snapshot: () => GameSnapshot;
  // actions
  setPremium: (value: boolean) => void;
  addXp: (amount: number) => void;
  recordQuiz: (quizId: string, perfect: boolean) => void;
  recordScenario: () => void;
  completeModule: (moduleId: string) => void;
  saveTactic: () => void;
  touchStreak: () => void;
  reset: () => void;
}

const initial: GameSnapshot & {
  lastActiveDay: string | null;
  completedModuleIds: string[];
  completedQuizIds: string[];
  isPremium: boolean;
} = {
  xp: 0,
  level: 1,
  streak: 0,
  quizzesCompleted: 0,
  scenariosCompleted: 0,
  modulesCompleted: 0,
  tacticsSaved: 0,
  perfectQuizzes: 0,
  lastActiveDay: null,
  completedModuleIds: [],
  completedQuizIds: [],
  isPremium: false,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initial,

      snapshot: () => {
        const s = get();
        return {
          xp: s.xp,
          level: s.level,
          streak: s.streak,
          quizzesCompleted: s.quizzesCompleted,
          scenariosCompleted: s.scenariosCompleted,
          modulesCompleted: s.modulesCompleted,
          tacticsSaved: s.tacticsSaved,
          perfectQuizzes: s.perfectQuizzes,
        };
      },

      setPremium: (value) => set({ isPremium: value }),

      addXp: (amount) =>
        set((s) => {
          const xp = s.xp + amount;
          return { xp, level: levelFromXp(xp) };
        }),

      recordQuiz: (quizId, perfect) =>
        set((s) => {
          const already = s.completedQuizIds.includes(quizId);
          return {
            quizzesCompleted: s.quizzesCompleted + 1,
            perfectQuizzes: s.perfectQuizzes + (perfect ? 1 : 0),
            completedQuizIds: already
              ? s.completedQuizIds
              : [...s.completedQuizIds, quizId],
          };
        }),

      recordScenario: () =>
        set((s) => ({ scenariosCompleted: s.scenariosCompleted + 1 })),

      completeModule: (moduleId) =>
        set((s) => {
          if (s.completedModuleIds.includes(moduleId)) return s;
          return {
            modulesCompleted: s.modulesCompleted + 1,
            completedModuleIds: [...s.completedModuleIds, moduleId],
          };
        }),

      saveTactic: () => set((s) => ({ tacticsSaved: s.tacticsSaved + 1 })),

      touchStreak: () =>
        set((s) => {
          const today = todayKey();
          if (s.lastActiveDay === today) return s;
          const yesterday = todayKey(new Date(Date.now() - 86400000));
          const streak =
            s.lastActiveDay === yesterday ? s.streak + 1 : 1;
          return { streak, lastActiveDay: today };
        }),

      reset: () => set({ ...initial }),
    }),
    { name: "football-iq-progress" }
  )
);
