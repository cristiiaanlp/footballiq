"use client";

import { useState } from "react";
import { Flame, Menu } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { levelProgress, rankForLevel } from "@/lib/ranks";
import { Brand } from "./Brand";
import { MobileDrawer } from "./MobileDrawer";

/** Top bar shown only on mobile (desktop uses the sidebar). */
export function MobileHeader() {
  const xp = useGameStore((s) => s.xp);
  const streak = useGameStore((s) => s.streak);
  const { level } = levelProgress(xp);
  const rank = rankForLevel(level);
  const [drawer, setDrawer] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-ink-900/70 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDrawer(true)}
            className="rounded-lg p-1.5 text-haze hover:bg-white/5 hover:text-chalk"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Brand href="/dashboard" size={28} textClass="text-base" />
        </div>
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

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}
