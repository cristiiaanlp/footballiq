"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import { Pitch } from "./Pitch";
import { PlayerChip } from "./PlayerChip";
import { Button } from "@/components/ui/Button";
import type { SavedTactic } from "@/stores/tacticsStore";
import type { Arrow, PlayerToken, Vec2 } from "@/types";

const VX = (x: number) => x * 2;
const VY = (y: number) => y * 3;
const ARROW_COLORS = ["#FACC15", "#22C55E", "#3B82F6", "#EF4444"];

function wavyPath(from: Vec2, to: Vec2): string {
  const ax = VX(from.x), ay = VY(from.y), bx = VX(to.x), by = VY(to.y);
  const dx = bx - ax, dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len, py = dx / len;
  const waves = Math.max(2, Math.round(len / 14));
  const steps = waves * 8;
  let d = `M ${ax} ${ay}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const off = Math.sin(t * waves * Math.PI * 2) * 4 * (1 - t * 0.15);
    d += ` L ${(ax + dx * t + px * off).toFixed(1)} ${(ay + dy * t + py * off).toFixed(1)}`;
  }
  return d;
}

/** Read-only tactic board with optional play-through animation. */
export function TacticViewer({ tactic }: { tactic: SavedTactic }) {
  const [players, setPlayers] = useState<PlayerToken[]>(tactic.players);
  const [ball, setBall] = useState<Vec2 | undefined>(tactic.ball);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFrames = (tactic.frames?.length ?? 0) >= 2;

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
    setIdx(null);
    setPlayers(tactic.players);
    setBall(tactic.ball);
  };

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const apply = (k: number) => {
    const f = tactic.frames[k];
    setPlayers((prev) =>
      prev.map((p) => (f.positions[p.id] ? { ...p, pos: f.positions[p.id] } : p))
    );
    if (f.ball) setBall(f.ball);
  };

  const play = () => {
    if (!hasFrames) return;
    setPlaying(true);
    let k = 0;
    setIdx(0);
    apply(0);
    timer.current = setInterval(() => {
      k = (k + 1) % tactic.frames.length;
      setIdx(k);
      apply(k);
    }, 1100);
  };

  const renderArrow = (a: Arrow) => {
    const head = `url(#vhead-${a.color.replace("#", "")})`;
    if (a.kind === "dribble")
      return <path key={a.id} d={wavyPath(a.from, a.to)} fill="none" stroke={a.color} strokeWidth={2.4} strokeLinecap="round" markerEnd={head} opacity={playing ? 0.35 : 1} />;
    return (
      <line key={a.id} x1={VX(a.from.x)} y1={VY(a.from.y)} x2={VX(a.to.x)} y2={VY(a.to.y)}
        stroke={a.color} strokeWidth={2.6} strokeLinecap="round"
        strokeDasharray={a.kind === "run" ? "7 5" : undefined} markerEnd={head} opacity={playing ? 0.35 : 1} />
    );
  };

  return (
    <div>
      <Pitch className="text-[clamp(11px,3.8vw,16px)]">
        <svg viewBox="0 0 200 300" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
          <defs>
            {ARROW_COLORS.map((c) => (
              <marker key={c} id={`vhead-${c.replace("#", "")}`} markerWidth="5" markerHeight="5" refX="3.5" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill={c} />
              </marker>
            ))}
          </defs>
          {tactic.arrows.map(renderArrow)}
        </svg>

        {players.map((p) => (
          <motion.div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            animate={{ left: `${p.pos.x}%`, top: `${p.pos.y}%` }}
            transition={playing ? { type: "spring", stiffness: 55, damping: 14 } : { duration: 0 }}
          >
            <PlayerChip number={p.number} team={p.team} role={p.role} label={p.label}
              color={p.team === "home" ? tactic.homeColor : tactic.awayColor} />
          </motion.div>
        ))}

        {ball && (
          <motion.div
            className="absolute z-10 flex h-[1.5em] w-[1.5em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[0.9em] shadow-glow"
            animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
            transition={playing ? { type: "spring", stiffness: 80, damping: 14 } : { duration: 0 }}
          >
            ⚽
          </motion.div>
        )}
      </Pitch>

      {hasFrames && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {playing ? (
            <Button variant="danger" size="sm" onClick={stop}>
              <Square className="h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button size="sm" onClick={play}>
              <Play className="h-4 w-4" /> Reproducir jugada
            </Button>
          )}
          {idx !== null && (
            <span className="text-xs text-muted">
              Paso {idx + 1}/{tactic.frames.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
