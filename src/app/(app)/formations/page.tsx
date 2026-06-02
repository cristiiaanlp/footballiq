"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, LayoutGrid, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { SceneView } from "@/components/pitch/SceneView";
import { FORMATIONS } from "@/data/formations";
import type { Formation, SceneSnapshot } from "@/types";
import { cn } from "@/lib/utils";

function toScene(f: Formation): SceneSnapshot {
  return {
    players: f.positions.map((p) => ({
      pos: p.pos,
      number: p.number,
      role: p.role,
      team: "home" as const,
    })),
  };
}

const DIFFICULTY = ["", "Fácil", "Media", "Avanzada"];

export default function FormationsPage() {
  const [selected, setSelected] = useState<Formation>(FORMATIONS[0]);

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="sky">
            <LayoutGrid className="h-3.5 w-3.5" /> Formation Explorer
          </Badge>
        }
        title="Explora las formaciones"
        subtitle="Cada sistema tiene fortalezas, debilidades y un para qué. Descúbrelos."
      />

      {/* Formation selector */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {FORMATIONS.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelected(f)}
            className={cn(
              "flex-shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
              selected.id === f.id
                ? "border-pitch bg-pitch/15 text-pitch-light shadow-glow"
                : "border-white/10 text-haze hover:bg-white/5"
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-full max-w-sm"
        >
          <SceneView frames={[toScene(selected)]} />
        </motion.div>

        <motion.div
          key={selected.id + "-info"}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">{selected.name}</h2>
              <Badge tone={selected.difficulty === 3 ? "danger" : selected.difficulty === 2 ? "gold" : "pitch"}>
                {DIFFICULTY[selected.difficulty]}
              </Badge>
            </div>
            <p className="text-sm font-medium text-pitch-light">{selected.style}</p>
            <p className="mt-2 text-sm text-haze">{selected.bestFor}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-pitch">
                <Check className="h-4 w-4" /> Fortalezas
              </p>
              <ul className="flex flex-col gap-2">
                {selected.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-haze">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pitch" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-danger">
                <X className="h-4 w-4" /> Debilidades
              </p>
              <ul className="flex flex-col gap-2">
                {selected.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-haze">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-danger" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
