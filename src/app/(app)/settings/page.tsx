"use client";

import { useState } from "react";
import {
  LogOut,
  RotateCcw,
  Settings as SettingsIcon,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { toast } from "@/stores/toastStore";
import { playSound } from "@/lib/sound";
import { upgradeToPremium } from "@/lib/checkout";

const AVATARS = ["⚽", "🧠", "🎯", "🏆", "🦁", "🔥", "🧤", "📋", "👟", "🥅"];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-pitch" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { user, updateName, signOut } = useAuth();
  const isPremium = useGameStore((s) => s.isPremium);
  const setPremium = useGameStore((s) => s.setPremium);
  const reset = useGameStore((s) => s.reset);
  const { soundEnabled, toggleSound, reducedMotion, toggleReducedMotion, avatar, setAvatar } =
    useSettingsStore();

  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);

  const saveName = async () => {
    setSaving(true);
    try {
      await updateName(name);
      toast("Nombre actualizado");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Error", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        badge={<Badge tone="neutral"><SettingsIcon className="h-3.5 w-3.5" /> Ajustes</Badge>}
        title="Ajustes"
        subtitle="Tu cuenta, preferencias y datos."
      />

      <div className="flex flex-col gap-4">
        {/* Profile */}
        <Card>
          <h2 className="mb-3 font-bold">Perfil</h2>
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-haze">Avatar</p>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    setAvatar(a);
                    playSound("click");
                  }}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all ${
                    avatar === a
                      ? "bg-pitch/20 ring-2 ring-pitch"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-haze">Nombre</span>
            <div className="flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
              />
              <Button onClick={saveName} disabled={saving || name === user?.name}>
                Guardar
              </Button>
            </div>
          </label>
          <p className="mt-2 text-xs text-muted">{user?.email}</p>
        </Card>

        {/* Preferences */}
        <Card>
          <h2 className="mb-3 font-bold">Preferencias</h2>
          <div className="flex flex-col divide-y divide-white/5">
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="h-5 w-5 text-pitch" /> Sonidos
              </span>
              <Toggle on={soundEnabled} onClick={() => { toggleSound(); if (!soundEnabled) playSound("click"); }} />
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-5 w-5 text-sky-light" /> Reducir animaciones
              </span>
              <Toggle on={reducedMotion} onClick={toggleReducedMotion} />
            </div>
          </div>
        </Card>

        {/* Premium */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">
                {isPremium ? "Football IQ Premium" : "Pásate a Premium"}
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                {isPremium
                  ? "Tienes acceso completo."
                  : "Academy completa, tácticas ilimitadas, GIF y más."}
              </p>
            </div>
            {isPremium && <Badge tone="gold"><Sparkles className="h-3 w-3" /> Activo</Badge>}
          </div>
          <div className="mt-3">
            {isPremium ? (
              <Button variant="secondary" size="sm" onClick={() => { setPremium(false); toast("Premium desactivado", "info"); }}>
                Desactivar (demo)
              </Button>
            ) : (
              <Button variant="gold" size="sm" onClick={() => upgradeToPremium(() => { setPremium(true); toast("¡Premium activado! 🎉"); })}>
                <Sparkles className="h-4 w-4" /> Hazte Premium
              </Button>
            )}
          </div>
        </Card>

        {/* Danger / account */}
        <Card>
          <h2 className="mb-3 font-bold">Cuenta y datos</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm("¿Reiniciar todo tu progreso? No se puede deshacer.")) {
                  reset();
                  toast("Progreso reiniciado", "info");
                }
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
    </div>
  );
}
