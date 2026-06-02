"use client";

import { motion } from "framer-motion";
import { LogOut, RotateCcw, Sparkles, Target, Volume2, VolumeX } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { playSound } from "@/lib/sound";
import { upgradeToPremium } from "@/lib/checkout";
import {
  ACHIEVEMENTS,
  RANKS,
  levelProgress,
  nextRank,
  rankForLevel,
} from "@/lib/ranks";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const store = useGameStore();
  const snapshot = useGameStore((s) => s.snapshot());
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  const { level, current, needed, pct } = levelProgress(store.xp);
  const rank = rankForLevel(level);
  const next = nextRank(level);

  const accuracy =
    snapshot.quizzesCompleted > 0
      ? Math.round((snapshot.perfectQuizzes / snapshot.quizzesCompleted) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        badge={<Badge tone="gold">Coach Mode</Badge>}
        title="Tu perfil"
        subtitle="Tu progreso, rango y logros como entrenador."
      />

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden p-6 sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            background: `radial-gradient(circle at 20% 0%, ${rank.accent}55, transparent 55%)`,
          }}
        />
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
            style={{ background: `${rank.accent}22`, boxShadow: `0 0 32px -8px ${rank.accent}` }}
          >
            {rank.badge}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Badge tone="gold">Nivel {level}</Badge>
              <span className="text-sm font-bold" style={{ color: rank.accent }}>
                {rank.badge} {rank.name}
              </span>
              {store.isPremium && (
                <Badge tone="gold">
                  <Sparkles className="h-3 w-3" /> Premium
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>{store.xp.toLocaleString()} XP total</span>
                {next && (
                  <span>
                    {needed - current} XP → {next.name}
                  </span>
                )}
              </div>
              <ProgressBar value={pct} accent="gold" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="XP" value={store.xp} />
        <Stat label="Racha" value={snapshot.streak} suffix="🔥" />
        <Stat label="Precisión" value={accuracy} suffix="%" />
        <Stat label="Quizzes" value={snapshot.quizzesCompleted} />
        <Stat label="Módulos" value={snapshot.modulesCompleted} />
        <Stat label="Tácticas" value={snapshot.tacticsSaved} />
      </div>

      {/* Rank ladder */}
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-pitch" />
          <h2 className="font-bold">Escalera de rangos</h2>
        </div>
        <div className="flex flex-col gap-2">
          {RANKS.map((r) => {
            const reached = level >= r.minLevel;
            const isCurrent = r.name === rank.name;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  isCurrent
                    ? "bg-white/[0.06] ring-1"
                    : reached
                      ? "bg-white/[0.02]"
                      : "opacity-40"
                }`}
                style={isCurrent ? { boxShadow: `inset 0 0 0 1px ${r.accent}66` } : undefined}
              >
                <span className="text-xl">{r.badge}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: reached ? r.accent : undefined }}>
                    {r.name}
                  </p>
                  <p className="text-xs text-muted">Nivel {r.minLevel}+</p>
                </div>
                {isCurrent && <Badge tone="pitch">Actual</Badge>}
                {reached && !isCurrent && <span className="text-pitch">✓</span>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <h2 className="mb-3 text-lg font-bold">Logros</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const has = a.test(snapshot);
            return (
              <div
                key={a.id}
                className={`card flex flex-col items-center gap-2 p-4 text-center ${
                  has ? "border-gold/30" : "opacity-50"
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                    has ? "bg-gold/15 text-gold" : "bg-white/5 text-muted"
                  }`}
                >
                  <Icon name={a.icon} className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-muted">{a.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <Card>
        <h2 className="mb-3 font-bold">Ajustes</h2>
        <button
          onClick={() => {
            toggleSound();
            if (!soundEnabled) playSound("click");
          }}
          className="flex w-full items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-pitch" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted" />
            )}
            Sonidos
          </span>
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              soundEnabled ? "bg-pitch" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                soundEnabled ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </Card>

      {/* Premium + account */}
      <Card>
        <h2 className="mb-1 font-bold">
          {store.isPremium ? "Football IQ Premium" : "Pásate a Premium"}
        </h2>
        <p className="mb-4 text-sm text-muted">
          {store.isPremium
            ? "Tienes acceso completo: Academy completa, tácticas y escenarios ilimitados."
            : "Academy completa, tácticas ilimitadas, más escenarios y análisis avanzados."}
        </p>
        <div className="flex flex-wrap gap-2">
          {store.isPremium ? (
            <Button variant="secondary" size="sm" onClick={() => store.setPremium(false)}>
              Desactivar (demo)
            </Button>
          ) : (
            <Button
              variant="gold"
              size="sm"
              onClick={() => upgradeToPremium(() => store.setPremium(true))}
            >
              <Sparkles className="h-4 w-4" /> Hazte Premium
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("¿Reiniciar todo tu progreso?")) store.reset();
            }}
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar progreso
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="card p-4 text-center">
      <p className="text-xl font-extrabold text-chalk">
        {value.toLocaleString()}
        {suffix}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
