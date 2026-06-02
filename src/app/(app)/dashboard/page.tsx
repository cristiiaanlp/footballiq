"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Flame,
  GitBranch,
  GraduationCap,
  LayoutGrid,
  PenTool,
  Trophy,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CoachStatus } from "@/components/layout/CoachStatus";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { ACHIEVEMENTS } from "@/lib/ranks";

const ACTIONS = [
  { href: "/tactic-lab", label: "Tactic Lab", desc: "Diseña sistemas", icon: PenTool, accent: "text-pitch" },
  { href: "/quizzes", label: "Quizzes", desc: "Pon a prueba tu IQ", icon: Brain, accent: "text-sky-light" },
  { href: "/scenarios", label: "Scenarios", desc: "Toma decisiones", icon: GitBranch, accent: "text-gold" },
  { href: "/academy", label: "Academy", desc: "Aprende conceptos", icon: GraduationCap, accent: "text-pitch" },
  { href: "/formations", label: "Formations", desc: "Explora sistemas", icon: LayoutGrid, accent: "text-sky-light" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const snapshot = useGameStore((s) => s.snapshot());

  const unlocked = ACHIEVEMENTS.filter((a) => a.test(snapshot));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <p className="text-sm text-muted">{greeting},</p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {user?.name ?? "Coach"} 👋
        </h1>
      </div>

      {/* Coach status + daily CTA */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <CoachStatus />
        <Card glow="pitch" className="relative flex items-center justify-between overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-pitch" />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-bold text-gold">
              <Flame className="h-4 w-4" /> Reto diario
            </p>
            <p className="mt-1 text-sm text-muted">
              Mantén tu racha de {snapshot.streak} días.
            </p>
            <Link href="/daily">
              <Button size="sm" className="mt-3">
                Jugar ahora
              </Button>
            </Link>
          </div>
          <div className="text-5xl">🔥</div>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Quizzes" value={snapshot.quizzesCompleted} />
        <Stat label="Escenarios" value={snapshot.scenariosCompleted} />
        <Stat label="Módulos" value={snapshot.modulesCompleted} />
        <Stat label="Tácticas" value={snapshot.tacticsSaved} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-lg font-bold">Entrena ahora</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <motion.div
              key={a.href}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={a.href}>
                <Card interactive className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                    <a.icon className={`h-5 w-5 ${a.accent}`} />
                  </div>
                  <div>
                    <p className="font-semibold">{a.label}</p>
                    <p className="text-xs text-muted">{a.desc}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements preview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Logros</h2>
          <Link href="/profile">
            <Badge tone="gold">
              <Trophy className="h-3.5 w-3.5" /> {unlocked.length}/{ACHIEVEMENTS.length}
            </Badge>
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {ACHIEVEMENTS.map((a) => {
            const has = a.test(snapshot);
            return (
              <div
                key={a.id}
                className={`flex w-32 flex-shrink-0 flex-col items-center gap-1 rounded-2xl border p-4 text-center ${
                  has ? "border-gold/40 bg-gold/5" : "border-white/5 bg-white/[0.02] opacity-50"
                }`}
              >
                <span className="text-2xl">{has ? "🏅" : "🔒"}</span>
                <p className="text-xs font-semibold">{a.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-extrabold text-chalk">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
