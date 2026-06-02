"use client";

import { useMemo } from "react";
import { useGameStore } from "@/stores/gameStore";
import { useReviewStore } from "@/stores/reviewStore";
import { ALL_RUNNER_IDS } from "@/lib/content";
import { todayKey } from "@/lib/utils";

/** Dynamic indicators shown on nav items. */
export function useNavBadges() {
  const lastActiveDay = useGameStore((s) => s.lastActiveDay);
  const items = useReviewStore((s) => s.items);

  const dueCount = useMemo(() => {
    const today = todayKey();
    return ALL_RUNNER_IDS.filter(
      (id) => items[id] && items[id].dueDay <= today
    ).length;
  }, [items]);

  // Streak at risk: nothing done today yet → nudge the daily challenge.
  const dailyDue = lastActiveDay !== todayKey();

  return { dueCount, dailyDue };
}
