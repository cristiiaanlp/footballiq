"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { rankForLevel } from "@/lib/ranks";
import { playSound } from "@/lib/sound";

/**
 * Watches the player's level and fires a celebration overlay + sound whenever
 * it increases. Baseline is set after store hydration to avoid false positives.
 */
export function LevelUpCelebration() {
  const level = useGameStore((s) => s.level);
  const [shown, setShown] = useState<number | null>(null);
  const [ready, setReady] = useState(() =>
    useGameStore.persist.hasHydrated()
  );
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (ready) return;
    return useGameStore.persist.onFinishHydration(() => setReady(true));
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    if (prev.current === null) {
      prev.current = level;
      return;
    }
    if (level > prev.current) {
      setShown(level);
      playSound("levelup");
      const t = setTimeout(() => setShown(null), 3200);
      prev.current = level;
      return () => clearTimeout(t);
    }
    prev.current = level;
  }, [level, ready]);

  const rank = shown ? rankForLevel(shown) : null;

  return (
    <AnimatePresence>
      {shown && rank && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" />

          {/* Confetti-ish sparks */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-full"
              style={{
                background: ["#22C55E", "#FACC15", "#3B82F6", "#EF4444"][i % 4],
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 14) * Math.PI * 2) * 180,
                y: Math.sin((i / 14) * Math.PI * 2) * 180,
                opacity: 0,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          ))}

          <motion.div
            className="glass-strong relative z-10 flex flex-col items-center gap-2 rounded-3xl px-10 py-8 text-center shadow-glow"
            initial={{ scale: 0.6, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.8 }}
            >
              {rank.badge}
            </motion.div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">
              ¡Nivel {shown}!
            </p>
            <p className="text-2xl font-extrabold" style={{ color: rank.accent }}>
              {rank.name}
            </p>
            <p className="text-sm text-muted">Sigue así, coach 🔥</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
