"use client";

import { Flame } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { levelProgress, rankForLevel } from "@/lib/ranks";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

/** Compact coach identity card: rank badge, level, XP bar and streak. */
export function CoachStatus({ compact = false }: { compact?: boolean }) {
  const xp = useGameStore((s) => s.xp);
  const streak = useGameStore((s) => s.streak);
  const { level, current, needed, pct } = levelProgress(xp);
  const rank = rankForLevel(level);

  return (
    <div className={cn("flex items-center gap-3", compact ? "" : "card p-4")}>
      <div
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ background: `${rank.accent}22`, boxShadow: `0 0 18px -6px ${rank.accent}` }}
      >
        {rank.badge}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold" style={{ color: rank.accent }}>
            {rank.name}
          </p>
          {streak > 0 && (
            <span className="flex items-center gap-0.5 text-xs font-bold text-gold">
              <Flame className="h-3.5 w-3.5" /> {streak}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted">LVL {level}</span>
          <ProgressBar value={pct} className="h-1.5 flex-1" />
        </div>
        {!compact && (
          <p className="mt-1 text-[10px] text-muted">
            {current} / {needed} XP to level {level + 1}
          </p>
        )}
      </div>
    </div>
  );
}
