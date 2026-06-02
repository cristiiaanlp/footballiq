"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameStore } from "./gameStore";
import type { GameSnapshot } from "@/types";

export const WEEKLY_MISSIONS = [
  { id: "quizzes", label: "Completa 8 quizzes", key: "quizzesCompleted", target: 8, reward: 60, icon: "Brain" },
  { id: "scenarios", label: "Resuelve 5 escenarios", key: "scenariosCompleted", target: 5, reward: 60, icon: "GitBranch" },
  { id: "modules", label: "Termina 2 módulos", key: "modulesCompleted", target: 2, reward: 80, icon: "GraduationCap" },
  { id: "tactics", label: "Guarda 2 tácticas", key: "tacticsSaved", target: 2, reward: 40, icon: "PenTool" },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  key: keyof GameSnapshot;
  target: number;
  reward: number;
  icon: string;
}>;

/** Monday (YYYY-MM-DD) of the current week — used as the reset key. */
function currentWeekKey() {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - day);
  return monday.toISOString().slice(0, 10);
}

interface MissionsState {
  weekKey: string | null;
  baseline: Record<string, number>;
  claimed: string[];
  /** Reset the weekly baseline if a new week has started. */
  ensureWeek: (snap: GameSnapshot) => void;
  progress: (key: keyof GameSnapshot, snap: GameSnapshot) => number;
  claim: (missionId: string, reward: number) => void;
}

export const useMissionsStore = create<MissionsState>()(
  persist(
    (set, get) => ({
      weekKey: null,
      baseline: {},
      claimed: [],

      ensureWeek: (snap) => {
        const wk = currentWeekKey();
        if (get().weekKey === wk) return;
        set({
          weekKey: wk,
          claimed: [],
          baseline: {
            quizzesCompleted: snap.quizzesCompleted,
            scenariosCompleted: snap.scenariosCompleted,
            modulesCompleted: snap.modulesCompleted,
            tacticsSaved: snap.tacticsSaved,
          },
        });
      },

      progress: (key, snap) => {
        const base = get().baseline[key as string] ?? 0;
        return Math.max(0, (snap[key] as number) - base);
      },

      claim: (missionId, reward) => {
        if (get().claimed.includes(missionId)) return;
        useGameStore.getState().addXp(reward);
        set((s) => ({ claimed: [...s.claimed, missionId] }));
      },
    }),
    { name: "football-iq-missions" }
  )
);
