"use client";

import { Card } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useGameStore } from "@/stores/gameStore";
import { todayKey } from "@/lib/utils";

const GOAL = 100; // XP diaria objetivo

export function DailyGoal() {
  const dailyXp = useGameStore((s) => s.dailyXp);
  const dailyXpDay = useGameStore((s) => s.dailyXpDay);
  const todays = dailyXpDay === todayKey() ? dailyXp : 0;
  const pct = (todays / GOAL) * 100;
  const done = todays >= GOAL;

  return (
    <Card glow={done ? "gold" : "pitch"} className="flex items-center gap-4">
      <ProgressRing value={pct} size={92} stroke={9} color={done ? "#FACC15" : "#22C55E"}>
        <span className="text-lg font-extrabold">{Math.min(todays, GOAL)}</span>
        <span className="text-[10px] text-muted">/{GOAL}</span>
      </ProgressRing>
      <div>
        <p className="text-sm font-bold">Meta diaria</p>
        <p className="mt-0.5 text-xs text-muted">
          {done
            ? "¡Meta cumplida hoy! 🎉"
            : `Te faltan ${GOAL - todays} XP hoy`}
        </p>
        <p className="mt-1 text-[11px] text-muted">
          Gana XP con quizzes, escenarios y módulos.
        </p>
      </div>
    </Card>
  );
}
