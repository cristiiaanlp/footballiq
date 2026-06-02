"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useStatsStore } from "@/stores/statsStore";
import { QUIZ_CATEGORIES } from "@/data/quizzes";

export default function StatsPage() {
  const byCategory = useStatsStore((s) => s.byCategory);

  const rows = useMemo(() => {
    return QUIZ_CATEGORIES.map((c) => {
      const st = byCategory[c.id] ?? { attempts: 0, correct: 0 };
      const acc = st.attempts > 0 ? Math.round((st.correct / st.attempts) * 100) : 0;
      return { ...c, ...st, acc };
    });
  }, [byCategory]);

  const played = rows.filter((r) => r.attempts > 0);
  const totalAttempts = played.reduce((a, r) => a + r.attempts, 0);
  const totalCorrect = played.reduce((a, r) => a + r.correct, 0);
  const overall = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const sorted = [...played].sort((a, b) => b.acc - a.acc);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  if (totalAttempts === 0) {
    return (
      <div>
        <PageHeader
          badge={<Badge tone="sky"><BarChart3 className="h-3.5 w-3.5" /> Estadísticas</Badge>}
          title="Tus estadísticas por tema"
        />
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <div className="text-4xl">📊</div>
          <div>
            <h2 className="text-lg font-bold">Aún no hay datos</h2>
            <p className="mt-1 text-sm text-muted">
              Responde algunos quizzes y aquí verás tu precisión por tema, tus
              puntos fuertes y lo que toca mejorar.
            </p>
          </div>
          <Link href="/quizzes">
            <Button>Hacer un quiz</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge={<Badge tone="sky"><BarChart3 className="h-3.5 w-3.5" /> Estadísticas</Badge>}
        title="Tus estadísticas por tema"
        subtitle="Tu precisión en cada concepto táctico. Enfócate en lo rojo."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Overall */}
        <Card className="flex flex-col items-center justify-center gap-3 py-8">
          <ProgressRing value={overall} size={140} color={overall >= 60 ? "#22C55E" : "#FACC15"}>
            <span className="text-3xl font-extrabold">{overall}%</span>
            <span className="text-xs text-muted">precisión</span>
          </ProgressRing>
          <p className="text-sm text-muted">
            {totalCorrect} aciertos de {totalAttempts} respuestas
          </p>
        </Card>

        {/* Strong / weak */}
        <div className="flex flex-col gap-4">
          {strongest && (
            <Card glow="pitch" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pitch/15">
                <TrendingUp className="h-5 w-5 text-pitch" />
              </div>
              <div>
                <p className="text-xs text-muted">Tu punto fuerte</p>
                <p className="font-bold">{strongest.label} · {strongest.acc}%</p>
              </div>
            </Card>
          )}
          {weakest && weakest.id !== strongest?.id && (
            <Card className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/15">
                <TrendingDown className="h-5 w-5 text-danger" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted">A mejorar</p>
                <p className="font-bold">{weakest.label} · {weakest.acc}%</p>
              </div>
              <Link href="/quizzes">
                <Button variant="secondary" size="sm">Practicar</Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* Per-category breakdown */}
      <h2 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wider text-muted">
        Por tema
      </h2>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.id} className="card flex items-center gap-3 p-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
              <Icon name={r.icon} className="h-4 w-4 text-pitch-light" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium">{r.label}</span>
                <span className="text-xs text-muted">
                  {r.attempts > 0 ? `${r.acc}% · ${r.attempts}` : "sin datos"}
                </span>
              </div>
              <ProgressBar
                value={r.acc}
                className="h-2"
                accent={r.acc >= 70 ? "pitch" : r.acc >= 40 ? "gold" : "sky"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
