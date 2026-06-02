"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Timer, Trophy, Zap } from "lucide-react";
import { SceneView } from "@/components/pitch/SceneView";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useGameStore } from "@/stores/gameStore";
import { useReviewStore } from "@/stores/reviewStore";
import { RUNNER_ITEMS, shuffleSeeded } from "@/lib/content";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const DURATION = 60; // seconds

export function RapidFire() {
  const addXp = useGameStore((s) => s.addXp);
  const touchStreak = useGameStore((s) => s.touchStreak);
  const recordReview = useReviewStore((s) => s.record);

  const [phase, setPhase] = useState<"intro" | "play" | "over">("intro");
  const [seed, setSeed] = useState(1);
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const deck = useMemo(() => shuffleSeeded(RUNNER_ITEMS, seed), [seed]);
  const item = deck[idx % deck.length];

  const finish = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    setPhase("over");
  }, []);

  // Award XP + streak once when the round ends.
  useEffect(() => {
    if (phase !== "over") return;
    if (correct > 0) {
      addXp(correct * 8);
      touchStreak();
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setSeed(Date.now());
    setIdx(0);
    setTimeLeft(DURATION);
    setPicked(null);
    setScore(0);
    setCorrect(0);
    setAnswered(0);
    setCombo(0);
    setBestCombo(0);
    setPhase("play");
  };

  // Countdown
  useEffect(() => {
    if (phase !== "play") return;
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (tickRef.current) clearInterval(tickRef.current);
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [phase]);

  const choose = (optId: string, isCorrect: boolean) => {
    if (picked || phase !== "play") return;
    setPicked(optId);
    setAnswered((a) => a + 1);
    recordReview(item.id, isCorrect);
    playSound(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setCombo((c) => {
        const next = c + 1;
        setBestCombo((b) => Math.max(b, next));
        setScore((s) => s + 10 + c * 2); // combo bonus
        return next;
      });
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 450);
  };

  if (phase === "intro") {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/15 text-3xl">
          ⚡
        </div>
        <h2 className="text-2xl font-extrabold">Contrarreloj</h2>
        <p className="mt-2 text-muted">
          {DURATION} segundos. Responde el máximo de preguntas seguidas. Encadena
          aciertos para multiplicar tu combo.
        </p>
        <Button size="lg" className="mt-6 w-full" onClick={start}>
          <Zap className="h-5 w-5" /> ¡Empezar!
        </Button>
      </div>
    );
  }

  if (phase === "over") {
    const acc = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-4xl">
          {score >= 120 ? "🔥" : score >= 60 ? "⚡" : "⚽"}
        </div>
        <h2 className="text-2xl font-bold">¡Tiempo!</h2>
        <p className="mt-1 text-4xl font-extrabold text-gradient">{score} pts</p>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="Aciertos" value={`${correct}/${answered}`} />
          <Stat label="Precisión" value={`${acc}%`} />
          <Stat label="Mejor combo" value={`x${bestCombo}`} />
        </div>
        <div className="mt-4 flex items-center justify-center">
          <Badge tone="gold">
            <Trophy className="h-3.5 w-3.5" /> +{correct * 8} XP
          </Badge>
        </div>
        <Button className="mt-6 w-full" onClick={start}>
          <Zap className="h-4 w-4" /> Otra ronda
        </Button>
      </motion.div>
    );
  }

  // play
  const pct = (timeLeft / DURATION) * 100;
  return (
    <div className="mx-auto max-w-2xl">
      {/* HUD */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <Timer className={cn("h-5 w-5", timeLeft <= 10 ? "text-danger" : "text-haze")} />
          <span className={timeLeft <= 10 ? "text-danger" : ""}>{timeLeft}s</span>
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={cn(
              "h-full rounded-full",
              timeLeft <= 10 ? "bg-danger" : "bg-gradient-to-r from-pitch to-pitch-light"
            )}
            animate={{ width: `${pct}%` }}
            transition={{ ease: "linear", duration: 0.4 }}
          />
        </div>
        <Badge tone="gold">{score} pts</Badge>
      </div>

      {/* Combo flag */}
      <AnimatePresence>
        {combo >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-center text-sm font-bold text-gold"
          >
            🔥 Combo x{combo}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${seed}-${idx}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.18 }}
          className="card p-5"
        >
          {item.scene && (
            <div className="mx-auto mb-4 max-w-[14rem]">
              <SceneView frames={[item.scene]} />
            </div>
          )}
          <h3 className="mb-4 text-base font-semibold leading-snug">{item.prompt}</h3>
          <div className="flex flex-col gap-2">
            {item.options.map((o) => {
              const reveal = Boolean(picked);
              return (
                <button
                  key={o.id}
                  onClick={() => choose(o.id, o.correct)}
                  disabled={reveal}
                  className={cn(
                    "rounded-xl border p-3 text-left text-sm transition-all",
                    !reveal && "border-white/10 hover:border-pitch/40 hover:bg-white/5",
                    reveal && o.correct && "border-pitch bg-pitch/10",
                    reveal && picked === o.id && !o.correct && "border-danger bg-danger/10",
                    reveal && !o.correct && picked !== o.id && "opacity-50"
                  )}
                >
                  {o.text}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] p-3">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
