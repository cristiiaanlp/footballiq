"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { QuizRunner, type RunnerItem } from "@/components/learn/QuizRunner";
import { QUIZZES } from "@/data/quizzes";
import { SCENARIOS } from "@/data/scenarios";
import { useGameStore } from "@/stores/gameStore";
import { useAuth } from "@/hooks/useAuth";
import { getSupabase } from "@/lib/supabase";
import { cn, seededIndex, todayKey } from "@/lib/utils";

type Row = { name: string; xp: number; badge: string };

const LEADERBOARD: Row[] = [
  { name: "Pep_Disciple", xp: 4820, badge: "🧠" },
  { name: "GegenPress", xp: 4120, badge: "🏆" },
  { name: "TikiTaka_10", xp: 3650, badge: "🏆" },
  { name: "BielsaBall", xp: 2980, badge: "🎯" },
  { name: "CatenaccioKid", xp: 2210, badge: "🎯" },
  { name: "WingBackWizard", xp: 1740, badge: "📊" },
];

export default function DailyPage() {
  const { user } = useAuth();
  const xp = useGameStore((s) => s.xp);
  const streak = useGameStore((s) => s.streak);
  const lastActiveDay = useGameStore((s) => s.lastActiveDay);
  const [playing, setPlaying] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [remote, setRemote] = useState<Row[] | null>(null);

  const today = todayKey();

  // Real global leaderboard when Supabase is configured; mock otherwise.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;
    supabase
      .rpc("leaderboard", { limit_count: 20 })
      .then(({ data }) => {
        if (cancelled || !data) return;
        setRemote(
          (data as { display_name: string; xp: number }[]).map((r) => ({
            name: r.display_name,
            xp: r.xp,
            badge: "⚽",
          }))
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items: RunnerItem[] = useMemo(() => {
    const q = QUIZZES[seededIndex(today + "-q", QUIZZES.length)];
    const s = SCENARIOS[seededIndex(today + "-s", SCENARIOS.length)];
    return [
      { id: q.id, prompt: q.prompt, scene: q.scene, options: q.options, xp: q.xp },
      {
        id: s.id,
        prompt: s.question,
        context: `${s.title} — ${s.situation}`,
        scene: s.scene,
        options: s.options,
        xp: s.xp,
      },
    ];
  }, [today]);

  // Build a leaderboard with the current user merged in.
  const board = useMemo(() => {
    const source = remote ?? LEADERBOARD;
    const me = { name: user?.name ?? "You", xp, badge: "⚽", you: true };
    const others = source
      .filter((l) => l.name !== (user?.name ?? "You"))
      .map((l) => ({ ...l, you: false }));
    return [...others, me]
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 7);
  }, [user, xp, remote]);

  if (playing) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setPlaying(false)}
        >
          ← Volver
        </Button>
        <QuizRunner
          items={items}
          title="Reto diario"
          kind="quiz"
          onFinish={() => setCompletedToday(true)}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="danger">
            <Flame className="h-3.5 w-3.5" /> Reto diario
          </Badge>
        }
        title="Tu desafío de hoy"
        subtitle="Un quiz y un escenario nuevos cada día. Mantén tu racha viva."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Today's challenge */}
        <div className="flex flex-col gap-4">
          <Card glow="pitch" className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-pitch" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {today}
                </p>
                <h2 className="mt-1 text-xl font-bold">Reto del día</h2>
                <p className="mt-1 text-sm text-muted">
                  2 desafíos · gana hasta{" "}
                  {items.reduce((a, i) => a + i.xp, 0)} XP
                </p>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => setPlaying(true)}
            >
              {completedToday ? "Repetir reto" : "Empezar reto"}
            </Button>
          </Card>

          {/* Streak */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-3xl">
                🔥
              </div>
              <div className="flex-1">
                <p className="text-2xl font-extrabold text-gold">
                  {streak} día{streak === 1 ? "" : "s"}
                </p>
                <p className="text-sm text-muted">
                  {lastActiveDay === today
                    ? "¡Racha activa hoy! Vuelve mañana."
                    : "Completa un reto para extender tu racha."}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-9 flex-1 rounded-lg",
                    i < Math.min(streak, 7)
                      ? "bg-gradient-to-b from-gold to-gold-dark"
                      : "bg-white/5"
                  )}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            <h2 className="font-bold">Leaderboard</h2>
          </div>
          <div className="flex flex-col gap-1.5">
            {board.map((row, i) => (
              <motion.div
                key={row.name + i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5",
                  row.you ? "bg-pitch/15 ring-1 ring-pitch/40" : "bg-white/[0.03]"
                )}
              >
                <span className="w-5 text-center text-sm font-bold text-muted">
                  {i === 0 ? <Crown className="mx-auto h-4 w-4 text-gold" /> : i + 1}
                </span>
                <span className="text-lg">{row.badge}</span>
                <span className="flex-1 truncate text-sm font-medium">
                  {row.name} {row.you && <span className="text-pitch">(tú)</span>}
                </span>
                <span className="text-sm font-bold text-haze">
                  {row.xp.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
