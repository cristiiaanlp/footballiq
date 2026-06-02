"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { todayKey } from "@/lib/utils";

/** Leitner box intervals in days. Higher box = seen less often. */
const INTERVALS = [0, 1, 2, 4, 8, 16];

interface ReviewItem {
  box: number;
  dueDay: string; // YYYY-MM-DD
}

function addDays(days: number) {
  return todayKey(new Date(Date.now() + days * 86400000));
}

interface ReviewState {
  items: Record<string, ReviewItem>;
  /** Record an answer for spaced repetition scheduling. */
  record: (id: string, correct: boolean) => void;
  /** Ids due for review today (out of the provided known ids). */
  dueIds: (known: string[]) => string[];
  countDue: (known: string[]) => number;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      items: {},

      record: (id, correct) =>
        set((s) => {
          const prev = s.items[id];
          if (correct) {
            // Correct: advance a box (only if it was already in review or just promote).
            const box = Math.min((prev?.box ?? 0) + 1, INTERVALS.length - 1);
            // If it was never wrong, don't clutter the deck.
            if (!prev) return s;
            return {
              items: { ...s.items, [id]: { box, dueDay: addDays(INTERVALS[box]) } },
            };
          }
          // Wrong: reset to box 0, due tomorrow.
          return {
            items: { ...s.items, [id]: { box: 0, dueDay: addDays(1) } },
          };
        }),

      dueIds: (known) => {
        const today = todayKey();
        const { items } = get();
        return known.filter((id) => items[id] && items[id].dueDay <= today);
      },

      countDue: (known) => get().dueIds(known).length,
    }),
    { name: "football-iq-review" }
  )
);
