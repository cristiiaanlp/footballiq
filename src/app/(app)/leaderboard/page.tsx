"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";
import { rankForLevel } from "@/lib/ranks";
import { cn } from "@/lib/utils";

type Row = { name: string; xp: number; level: number; you?: boolean };

const MOCK: Row[] = [
  { name: "Pep_Disciple", xp: 4820, level: 21 },
  { name: "GegenPress", xp: 4120, level: 19 },
  { name: "TikiTaka_10", xp: 3650, level: 18 },
  { name: "BielsaBall", xp: 2980, level: 16 },
  { name: "CatenaccioKid", xp: 2210, level: 14 },
  { name: "WingBackWizard", xp: 1740, level: 12 },
  { name: "FalsoNueve", xp: 1180, level: 10 },
  { name: "ParkTheBus", xp: 720, level: 7 },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const xp = useGameStore((s) => s.xp);
  const level = useGameStore((s) => s.level);
  const [remote, setRemote] = useState<Row[] | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase.rpc("leaderboard", { limit_count: 50 }).then(({ data }) => {
      if (cancelled || !data) return;
      setRemote(
        (data as { display_name: string; xp: number; level: number }[]).map((r) => ({
          name: r.display_name,
          xp: r.xp,
          level: r.level,
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const board = useMemo(() => {
    const me: Row = { name: user?.name ?? "Tú", xp, level, you: true };
    const source = remote ?? MOCK;
    const others = source
      .filter((r) => r.name !== me.name)
      .map((r) => ({ ...r, you: false }));
    return [...others, me].sort((a, b) => b.xp - a.xp);
  }, [remote, user, xp, level]);

  const podium = board.slice(0, 3);
  const rest = board.slice(3);
  const myRank = board.findIndex((r) => r.you) + 1;
  const loading = isSupabaseEnabled && remote === null;

  return (
    <div>
      <PageHeader
        badge={<Badge tone="gold"><Trophy className="h-3.5 w-3.5" /> Ranking global</Badge>}
        title="Leaderboard"
        subtitle={
          isSupabaseEnabled
            ? "Clasificación global por XP. ¡Sigue entrenando para subir!"
            : "Demo local. Conecta Supabase para el ranking global real."
        }
        action={!loading && <Badge tone="pitch">Tu posición · #{myRank}</Badge>}
      />

      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="mb-4 grid grid-cols-3 items-end gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-32" />
            <Skeleton className="h-20" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-11" />
          ))}
        </div>
      ) : (
        <>
      {/* Podium */}
      <div className="mb-6 grid grid-cols-3 items-end gap-3">
        {[1, 0, 2].map((idx) => {
          const row = podium[idx];
          if (!row) return <div key={idx} />;
          const heights = ["h-24", "h-32", "h-20"];
          const medals = ["🥈", "🥇", "🥉"];
          const place = idx === 0 ? 1 : idx === 1 ? 0 : 2;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: place * 0.08 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="text-2xl">{medals[idx]}</div>
              <div
                className={cn(
                  "flex w-full flex-col items-center justify-end rounded-t-xl border border-white/10 p-2 text-center",
                  heights[idx],
                  row.you ? "bg-pitch/15 ring-1 ring-pitch/40" : "bg-white/[0.04]"
                )}
              >
                <p className="truncate text-xs font-semibold">
                  {row.you ? "Tú" : row.name}
                </p>
                <p className="text-[10px] text-muted">{row.xp.toLocaleString()} XP</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="flex flex-col gap-1.5">
        {rest.map((row, i) => {
          const rank = rankForLevel(row.level);
          return (
            <div
              key={row.name + i}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5",
                row.you ? "bg-pitch/15 ring-1 ring-pitch/40" : "bg-white/[0.03]"
              )}
            >
              <span className="w-6 text-center text-sm font-bold text-muted">
                {i + 4}
              </span>
              <span className="text-lg">{rank.badge}</span>
              <span className="flex-1 truncate text-sm font-medium">
                {row.you ? <span className="text-pitch">Tú</span> : row.name}
              </span>
              <span className="text-xs text-muted">Lvl {row.level}</span>
              <span className="w-16 text-right text-sm font-bold text-haze">
                {row.xp.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>

      {board.length <= 3 && (
        <p className="mt-4 text-center text-xs text-muted">
          <Crown className="mr-1 inline h-3.5 w-3.5 text-gold" />
          Gana XP para escalar posiciones.
        </p>
      )}
        </>
      )}
    </div>
  );
}
