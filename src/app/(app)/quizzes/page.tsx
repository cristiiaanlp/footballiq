"use client";

import { useState } from "react";
import { ArrowLeft, Brain, RotateCcw, Zap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { QuizRunner, type RunnerItem } from "@/components/learn/QuizRunner";
import { RapidFire } from "@/components/learn/RapidFire";
import { QUIZ_CATEGORIES, quizzesByCategory } from "@/data/quizzes";
import { useReviewStore } from "@/stores/reviewStore";
import { ALL_RUNNER_IDS, RUNNER_INDEX } from "@/lib/content";
import type { QuizCategory } from "@/types";

type Mode =
  | { kind: "home" }
  | { kind: "category"; cat: QuizCategory }
  | { kind: "rapid" }
  | { kind: "review" };

export default function QuizzesPage() {
  const [mode, setMode] = useState<Mode>({ kind: "home" });
  const dueIds = useReviewStore((s) => s.dueIds(ALL_RUNNER_IDS));

  const back = (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4"
      onClick={() => setMode({ kind: "home" })}
    >
      <ArrowLeft className="h-4 w-4" /> Volver
    </Button>
  );

  if (mode.kind === "rapid") {
    return (
      <div>
        {back}
        <RapidFire />
      </div>
    );
  }

  if (mode.kind === "review") {
    const items = dueIds.map((id) => RUNNER_INDEX[id]).filter(Boolean) as RunnerItem[];
    return (
      <div>
        {back}
        {items.length ? (
          <QuizRunner items={items} title="Repaso de fallos" kind="quiz" />
        ) : (
          <div className="card mx-auto max-w-md p-8 text-center">
            <div className="mx-auto mb-3 text-4xl">✅</div>
            <h2 className="text-xl font-bold">¡Nada que repasar!</h2>
            <p className="mt-1 text-sm text-muted">
              No tienes preguntas falladas pendientes. Las que falles
              reaparecerán aquí en los próximos días.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (mode.kind === "category") {
    const cat = QUIZ_CATEGORIES.find((c) => c.id === mode.cat)!;
    const items: RunnerItem[] = quizzesByCategory(mode.cat).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      scene: q.scene,
      options: q.options,
      xp: q.xp,
    }));
    return (
      <div>
        {back}
        {items.length ? (
          <QuizRunner items={items} title={cat.label} kind="quiz" />
        ) : (
          <p className="text-center text-muted">Pronto más quizzes aquí.</p>
        )}
      </div>
    );
  }

  // home
  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="sky">
            <Brain className="h-3.5 w-3.5" /> Quizzes tácticos
          </Badge>
        }
        title="Pon a prueba tu lectura de juego"
        subtitle="Elige un tema, juega contrarreloj o repasa lo que fallaste."
      />

      {/* Modes */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Card interactive glow="gold" onClick={() => setMode({ kind: "rapid" })}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger/15 text-2xl">
              ⚡
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-bold">
                Contrarreloj <Zap className="h-4 w-4 text-gold" />
              </p>
              <p className="text-xs text-muted">60s · combos · máxima rejugabilidad</p>
            </div>
          </div>
        </Card>

        <Card interactive glow="sky" onClick={() => setMode({ kind: "review" })}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/15 text-2xl">
              🔁
            </div>
            <div className="flex-1">
              <p className="flex items-center gap-1.5 font-bold">
                Repasar fallos <RotateCcw className="h-4 w-4 text-sky-light" />
              </p>
              <p className="text-xs text-muted">
                {dueIds.length > 0
                  ? `${dueIds.length} pregunta${dueIds.length > 1 ? "s" : ""} para repasar hoy`
                  : "Repaso espaciado · sin pendientes"}
              </p>
            </div>
            {dueIds.length > 0 && <Badge tone="danger">{dueIds.length}</Badge>}
          </div>
        </Card>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        Por temas
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUIZ_CATEGORIES.map((c) => {
          const count = quizzesByCategory(c.id).length;
          return (
            <Card
              key={c.id}
              interactive
              glow={c.accent === "danger" ? "none" : c.accent}
              onClick={() => setMode({ kind: "category", cat: c.id })}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">
                  <Icon name={c.icon} className="h-5 w-5 text-pitch-light" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-xs text-muted">{count} preguntas</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
