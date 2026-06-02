"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PenTool } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { TacticBoard } from "@/components/pitch/TacticBoard";
import { FullScreenLoader } from "@/components/ui/Spinner";
import { useTacticsStore } from "@/stores/tacticsStore";

function TacticLabInner() {
  const params = useSearchParams();
  const loadId = params.get("load");
  const initial = useTacticsStore((s) =>
    loadId ? s.tactics.find((t) => t.id === loadId) : undefined
  );

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="pitch">
            <PenTool className="h-3.5 w-3.5" /> Pizarra Táctica
          </Badge>
        }
        title={initial ? initial.name : "Tu pizarra táctica"}
        subtitle="Coloca jugadores, dibuja movimientos y captura frames para animar la jugada."
      />
      <TacticBoard initial={initial} />
    </div>
  );
}

export default function TacticLabPage() {
  return (
    <Suspense fallback={<FullScreenLoader label="Cargando pizarra…" />}>
      <TacticLabInner />
    </Suspense>
  );
}
