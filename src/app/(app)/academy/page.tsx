"use client";

import Link from "next/link";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { PremiumBadge } from "@/components/ui/PremiumLock";
import { ACADEMY } from "@/data/academy";
import { useGameStore } from "@/stores/gameStore";

export default function AcademyPage() {
  const completed = useGameStore((s) => s.completedModuleIds);
  const isPremium = useGameStore((s) => s.isPremium);

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="pitch">
            <GraduationCap className="h-3.5 w-3.5" /> Football Academy
          </Badge>
        }
        title="Aprende los conceptos clave"
        subtitle="Módulos visuales y animados. Nada de textos aburridos — mira el concepto en movimiento."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACADEMY.map((m) => {
          const isDone = completed.includes(m.slug);
          const locked = m.premium && !isPremium;
          return (
            <Link key={m.slug} href={`/academy/${m.slug}`}>
              <Card
                interactive
                glow={m.accent === "danger" ? "none" : m.accent}
                className="h-full"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                    <Icon name={m.icon} className="h-6 w-6 text-pitch-light" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {m.premium && <PremiumBadge />}
                    {isDone && (
                      <Badge tone="pitch">
                        <CheckCircle2 className="h-3 w-3" /> Hecho
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="font-bold">{m.title}</p>
                <p className="mt-1 text-sm text-muted">{m.concept}</p>
                <p className="mt-3 text-xs text-muted">
                  {m.lessons.length} lección{m.lessons.length > 1 ? "es" : ""}
                  {locked && " · bloqueado"}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
