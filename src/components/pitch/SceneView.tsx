"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pitch } from "./Pitch";
import { PlayerChip } from "./PlayerChip";
import type { SceneSnapshot } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Renders one or more SceneSnapshots. With a single frame it's static; with
 * multiple frames it auto-animates between them (used by academy demos).
 */
export function SceneView({
  frames,
  className,
  autoplay = true,
  loop = true,
  intervalMs = 1600,
  highlightNumber,
}: {
  frames: SceneSnapshot[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  intervalMs?: number;
  /** Highlight a player by jersey number (home team). */
  highlightNumber?: number;
}) {
  const [i, setI] = useState(0);
  const multi = frames.length > 1;

  useEffect(() => {
    if (!multi || !autoplay) return;
    const t = setInterval(() => {
      setI((prev) => {
        const next = prev + 1;
        if (next >= frames.length) return loop ? 0 : prev;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [multi, autoplay, loop, intervalMs, frames.length]);

  const frame = frames[Math.min(i, frames.length - 1)];

  return (
    <div className={cn("relative", className)}>
      <Pitch className="text-[clamp(8px,3.4vw,15px)]">
        {/* Highlighted zones */}
        {frame.highlights?.map((h, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-lg"
            style={{
              left: `${h.pos.x}%`,
              top: `${h.pos.y}%`,
              width: `${h.w}%`,
              height: `${h.h}%`,
              background: h.color,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}

        {/* Players */}
        {frame.players.map((p, idx) => (
          <motion.div
            key={`${p.team}-${p.number}-${idx}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ left: `${p.pos.x}%`, top: `${p.pos.y}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <PlayerChip
              number={p.number}
              team={p.team}
              role={p.role}
              highlight={p.team === "home" && p.number === highlightNumber}
            />
          </motion.div>
        ))}

        {/* Ball */}
        {frame.ball && (
          <motion.div
            className="absolute h-[1.4em] w-[1.4em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white text-[10px] shadow-glow text-[clamp(8px,3.4vw,15px)]"
            initial={false}
            animate={{ left: `${frame.ball.x}%`, top: `${frame.ball.y}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <span className="flex h-full w-full items-center justify-center text-[0.8em]">
              ⚽
            </span>
          </motion.div>
        )}
      </Pitch>

      {/* Frame dots */}
      {multi && (
        <div className="mt-3 flex justify-center gap-1.5">
          {frames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === i ? "w-6 bg-pitch" : "w-1.5 bg-white/20"
              )}
              aria-label={`Frame ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
