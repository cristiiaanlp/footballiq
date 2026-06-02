"use client";

import { Flame } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { levelProgress, rankForLevel } from "@/lib/ranks";
import { Brand } from "./Brand";

/** Top bar shown only on mobile (desktop uses the sidebar). */
export function MobileHeader() {
  const xp = useGameStore((s) => s.xp);
  const streak = useGameStore((s) => s.streak);
  const { level } = levelProgress(xp);
  const rank = rankForLevel(level);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-900/70 px-4 py-3 backdrop-blur-xl lg:hidden">
      <Brand href="/dashboard" size={30} textClass="text-base" />
      <div className="flex items-center gap-3">
        {streak > 0 && (
          <span className="flex items-center gap-1 text-sm font-bold text-gold">
            <Flame className="h-4 w-4" /> {streak}
          </span>
        )}
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ background: `${rank.accent}22`, color: rank.accent }}
        >
          {rank.badge} LVL {level}
        </span>
      </div>
    </header>
  );
}
