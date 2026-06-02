"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Library, Pencil, PenTool, Play, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SceneView } from "@/components/pitch/SceneView";
import { useTacticsStore, type SavedTactic } from "@/stores/tacticsStore";
import type { SceneSnapshot } from "@/types";

function toScene(t: SavedTactic): SceneSnapshot {
  return {
    players: t.players.map((p) => ({
      pos: p.pos,
      number: p.number,
      role: p.role,
      team: p.team,
    })),
  };
}

export default function MyTacticsPage() {
  const tactics = useTacticsStore((s) => s.tactics);
  const remove = useTacticsStore((s) => s.remove);
  const rename = useTacticsStore((s) => s.rename);

  const [renaming, setRenaming] = useState<SavedTactic | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const startRename = (t: SavedTactic) => {
    setRenaming(t);
    setRenameValue(t.name);
  };

  const confirmRename = () => {
    if (renaming) rename(renaming.id, renameValue.trim() || renaming.name);
    setRenaming(null);
  };

  return (
    <div>
      <PageHeader
        badge={
          <Badge tone="pitch">
            <Library className="h-3.5 w-3.5" /> Mis tácticas
          </Badge>
        }
        title="Tu colección"
        subtitle="Abre, edita o anima cualquier táctica que hayas guardado."
        action={
          <Link href="/tactic-lab">
            <Button>
              <Plus className="h-4 w-4" /> Nueva táctica
            </Button>
          </Link>
        }
      />

      {tactics.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-12 text-center">
          <div className="rounded-full bg-pitch/15 p-4 text-pitch">
            <PenTool className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Aún no tienes tácticas</h2>
            <p className="mt-1 text-sm text-muted">
              Diseña tu primera jugada en el Tactic Lab y guárdala aquí.
            </p>
          </div>
          <Link href="/tactic-lab">
            <Button>
              <Plus className="h-4 w-4" /> Crear mi primera táctica
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tactics.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card flex flex-col p-3"
            >
              <Link href={`/tactic-lab?load=${t.id}`} className="block">
                <div className="relative overflow-hidden rounded-xl">
                  <SceneView frames={[toScene(t)]} />
                  {t.frames.length >= 2 && (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-ink-900/80 px-2 py-0.5 text-[10px] font-bold text-gold">
                      <Play className="h-3 w-3" /> {t.frames.length}
                    </span>
                  )}
                </div>
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">
                    {t.formation} · {new Date(t.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge tone="gold">{t.formation}</Badge>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <Link href={`/tactic-lab?load=${t.id}`} className="col-span-1">
                  <Button size="sm" className="w-full">
                    Abrir
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => startRename(t)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`¿Borrar "${t.name}"?`)) remove(t.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={!!renaming}
        onClose={() => setRenaming(null)}
        title="Renombrar táctica"
      >
        <input
          autoFocus
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmRename()}
          className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
        />
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={confirmRename}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={() => setRenaming(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
