"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { TacticViewer } from "@/components/pitch/TacticViewer";
import { getSupabase } from "@/lib/supabase";
import type { SavedTactic } from "@/stores/tacticsStore";

type Row = {
  id: string;
  name: string;
  formation: string;
  data: Record<string, unknown>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

function fromRow(r: Row): SavedTactic {
  const d = (r.data ?? {}) as Partial<SavedTactic>;
  return {
    id: r.id,
    name: r.name,
    formation: r.formation,
    showAway: d.showAway ?? false,
    players: d.players ?? [],
    arrows: d.arrows ?? [],
    frames: d.frames ?? [],
    ball: d.ball,
    homeColor: d.homeColor,
    awayColor: d.awayColor,
    isPublic: r.is_public,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export default function PublicTacticPage({ params }: { params: { id: string } }) {
  const [tactic, setTactic] = useState<SavedTactic | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setState("missing");
      return;
    }
    let cancelled = false;
    supabase
      .from("tactics")
      .select("*")
      .eq("id", params.id)
      .eq("is_public", true)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setTactic(fromRow(data as Row));
          setState("ok");
        } else {
          setState("missing");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Brand size={36} />
          <Link href="/register">
            <Button size="sm">
              Crear la tuya <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        {state === "loading" && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="aspect-[2/3] w-full" />
          </div>
        )}

        {state === "missing" && (
          <div className="card mt-10 flex flex-col items-center gap-4 p-10 text-center">
            <div className="text-4xl">🔍</div>
            <div>
              <h1 className="text-xl font-bold">Táctica no disponible</h1>
              <p className="mt-1 text-sm text-muted">
                Este enlace no existe o la táctica ya no es pública.
              </p>
            </div>
            <Link href="/">
              <Button>Ir a Football IQ</Button>
            </Link>
          </div>
        )}

        {state === "ok" && tactic && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">{tactic.name}</h1>
                <p className="text-xs text-muted">Táctica compartida en Football IQ</p>
              </div>
              <Badge tone="gold">{tactic.formation}</Badge>
            </div>
            <TacticViewer tactic={tactic} />
            <div className="mt-6 rounded-2xl border border-pitch/20 bg-pitch/5 p-5 text-center">
              <p className="text-sm text-haze">
                ¿Quieres diseñar y animar tus propias jugadas?
              </p>
              <Link href="/register" className="mt-3 inline-block">
                <Button>
                  Empieza gratis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
