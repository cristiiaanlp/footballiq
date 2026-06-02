"use client";

import { useState } from "react";
import { ArrowLeft, GitBranch } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SceneView } from "@/components/pitch/SceneView";
import { QuizRunner, type RunnerItem } from "@/components/learn/QuizRunner";
import { SCENARIOS } from "@/data/scenarios";

export default function ScenariosPage() {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    const items: RunnerItem[] = SCENARIOS.map((s) => ({
      id: s.id,
      prompt: s.question,
      context: `${s.title} — ${s.situation}`,
      scene: s.scene,
      options: s.options,
      xp: s.xp,
    }));
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setPlaying(false)}
        >
          <ArrowLeft className="h-4 w-4" /> Escenarios
        </Button>
        <QuizRunner items={items} title="Match Scenarios" kind="scenario" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="gold">
            <GitBranch className="h-3.5 w-3.5" /> Match Scenarios
          </Badge>
        }
        title="¿Cuál es la mejor decisión?"
        subtitle="Situaciones reales de partido, sobre el campo. Lee el juego y elige."
        action={<Button onClick={() => setPlaying(true)}>Jugar todos</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCENARIOS.map((s) => (
          <Card key={s.id} interactive glow="gold" onClick={() => setPlaying(true)}>
            <div className="mb-3 overflow-hidden rounded-xl">
              <SceneView frames={[s.scene]} />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold">{s.title}</p>
              <Badge tone="gold">+{s.xp} XP</Badge>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{s.situation}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
