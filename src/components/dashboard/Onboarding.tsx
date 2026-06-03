"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, GraduationCap, PenTool, Trophy, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/stores/gameStore";
import { playSound } from "@/lib/sound";

type Slide = { emoji?: string; icon?: LucideIcon; title: string; text: string };

const SLIDES: Slide[] = [
  {
    emoji: "⚽",
    title: "Bienvenido a Football IQ",
    text: "Aprende fútbol como un entrenador: tácticas, sistemas y lectura de juego de forma interactiva.",
  },
  {
    icon: PenTool,
    title: "Diseña y anima jugadas",
    text: "En la Pizarra Táctica colocas jugadores, dibujas movimientos y animas la jugada paso a paso.",
  },
  {
    icon: Brain,
    title: "Pon a prueba tu IQ",
    text: "Quizzes por temas, escenarios reales, contrarreloj y repaso de lo que fallas.",
  },
  {
    icon: Trophy,
    title: "Sube de rango",
    text: "Gana XP, sube de nivel y desbloquea rangos de Entrenador Novato a Maestro Táctico.",
  },
];

const LEVELS = [
  { id: "rookie", label: "Soy principiante", desc: "Empiezo de cero", xp: 0 },
  { id: "amateur", label: "Sé lo básico", desc: "Conozco formaciones", xp: 150 },
  { id: "pro", label: "Controlo de táctica", desc: "Quiero retos", xp: 400 },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const addXp = useGameStore((s) => s.addXp);

  useEffect(() => {
    try {
      if (!localStorage.getItem("fiq-onboarding")) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  const finish = (xp: number) => {
    if (xp > 0) {
      addXp(xp);
      playSound("levelup");
    }
    try {
      localStorage.setItem("fiq-onboarding", "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const isLast = step === SLIDES.length; // level-choice step
  const slide = SLIDES[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[55] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm" />
          <motion.div
            className="glass-strong relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl p-6 text-center shadow-glass sm:p-8"
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
          >
            {!isLast ? (
              <>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-pitch/15 text-4xl">
                  {slide.emoji ? slide.emoji : slide.icon ? <slide.icon className="h-9 w-9 text-pitch" /> : null}
                </div>
                <h2 className="text-2xl font-extrabold">{slide.title}</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-haze">{slide.text}</p>

                <div className="mt-6 flex items-center justify-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        i === step ? "w-6 bg-pitch" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => finish(0)}
                  >
                    Saltar
                  </Button>
                  <Button className="flex-1" onClick={() => setStep((s) => s + 1)}>
                    Siguiente
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gold/15 text-4xl">
                  <GraduationCap className="h-9 w-9 text-gold" />
                </div>
                <h2 className="text-2xl font-extrabold">¿Cuánto sabes de táctica?</h2>
                <p className="mt-2 text-sm text-haze">
                  Empezamos por donde te toca (te damos un empujón de XP inicial).
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => finish(l.xp)}
                      className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left transition-all hover:border-pitch/40 hover:bg-white/5"
                    >
                      <div>
                        <p className="text-sm font-semibold">{l.label}</p>
                        <p className="text-xs text-muted">{l.desc}</p>
                      </div>
                      {l.xp > 0 && (
                        <span className="text-xs font-bold text-gold">+{l.xp} XP</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
