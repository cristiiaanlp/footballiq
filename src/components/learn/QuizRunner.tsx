"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, RotateCcw, Trophy, X } from "lucide-react";
import { SceneView } from "@/components/pitch/SceneView";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useGameStore } from "@/stores/gameStore";
import { useReviewStore } from "@/stores/reviewStore";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import type { AnswerOption, SceneSnapshot } from "@/types";

export interface RunnerItem {
  id: string;
  prompt: string;
  context?: string;
  scene?: SceneSnapshot;
  options: AnswerOption[];
  xp: number;
}

export function QuizRunner({
  items,
  title,
  onFinish,
  kind = "quiz",
}: {
  items: RunnerItem[];
  title: string;
  kind?: "quiz" | "scenario";
  onFinish?: (result: { correct: number; total: number; xp: number }) => void;
}) {
  const addXp = useGameStore((s) => s.addXp);
  const recordQuiz = useGameStore((s) => s.recordQuiz);
  const recordScenario = useGameStore((s) => s.recordScenario);
  const touchStreak = useGameStore((s) => s.touchStreak);
  const recordReview = useReviewStore((s) => s.record);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [done, setDone] = useState(false);

  const item = items[index];
  const chosen = useMemo(
    () => item?.options.find((o) => o.id === picked) ?? null,
    [item, picked]
  );

  const choose = (opt: AnswerOption) => {
    if (picked) return;
    setPicked(opt.id);
    touchStreak();
    recordReview(item.id, opt.correct);
    playSound(opt.correct ? "correct" : "wrong");
    if (opt.correct) {
      setCorrectCount((c) => c + 1);
      setEarnedXp((x) => x + item.xp);
      addXp(item.xp);
    } else {
      // small consolation XP for engaging
      addXp(Math.round(item.xp * 0.2));
      setEarnedXp((x) => x + Math.round(item.xp * 0.2));
    }
  };

  const next = () => {
    const last = index === items.length - 1;
    if (kind === "quiz") recordQuiz(item.id, chosen?.correct ?? false);
    else recordScenario();

    if (last) {
      setDone(true);
      onFinish?.({
        correct: correctCount,
        total: items.length,
        xp: earnedXp,
      });
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setEarnedXp(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((correctCount / items.length) * 100);
    const perfect = correctCount === items.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mx-auto max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-4xl">
          {perfect ? "🏆" : pct >= 60 ? "⚽" : "📚"}
        </div>
        <h2 className="text-2xl font-bold">
          {perfect ? "Perfect!" : pct >= 60 ? "Well played!" : "Keep training!"}
        </h2>
        <p className="mt-1 text-muted">
          You got {correctCount} / {items.length} right.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Badge tone="gold">
            <Trophy className="h-3.5 w-3.5" /> +{earnedXp} XP
          </Badge>
          <Badge tone={pct >= 60 ? "pitch" : "neutral"}>{pct}% accuracy</Badge>
        </div>
        <Button className="mt-6 w-full" variant="secondary" onClick={restart}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>{title}</span>
            <span>
              {index + 1} / {items.length}
            </span>
          </div>
          <ProgressBar value={((index + (picked ? 1 : 0)) / items.length) * 100} />
        </div>
        <Badge tone="gold">
          <Trophy className="h-3.5 w-3.5" /> {earnedXp} XP
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="card p-5 sm:p-6"
        >
          {item.context && (
            <p className="mb-3 rounded-lg bg-white/5 p-3 text-sm text-haze">
              {item.context}
            </p>
          )}

          {item.scene && (
            <div className="mx-auto mb-5 max-w-xs">
              <SceneView frames={[item.scene]} />
            </div>
          )}

          <h3 className="mb-4 text-lg font-semibold leading-snug">
            {item.prompt}
          </h3>

          <div className="flex flex-col gap-2.5">
            {item.options.map((opt) => {
              const isPicked = picked === opt.id;
              const reveal = Boolean(picked);
              return (
                <button
                  key={opt.id}
                  onClick={() => choose(opt)}
                  disabled={reveal}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all",
                    !reveal &&
                      "border-white/10 hover:border-pitch/40 hover:bg-white/5",
                    reveal &&
                      opt.correct &&
                      "border-pitch bg-pitch/10",
                    reveal &&
                      isPicked &&
                      !opt.correct &&
                      "border-danger bg-danger/10",
                    reveal &&
                      !opt.correct &&
                      !isPicked &&
                      "border-white/5 opacity-60"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs",
                      reveal && opt.correct
                        ? "border-pitch bg-pitch text-ink-900"
                        : reveal && isPicked
                          ? "border-danger bg-danger text-white"
                          : "border-white/20 text-muted"
                    )}
                  >
                    {reveal && opt.correct ? (
                      <Check className="h-3 w-3" />
                    ) : reveal && isPicked ? (
                      <X className="h-3 w-3" />
                    ) : (
                      opt.id.toUpperCase()
                    )}
                  </span>
                  <span className="flex-1 text-sm">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {chosen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden"
              >
                <div
                  className={cn(
                    "rounded-xl border p-4 text-sm",
                    chosen.correct
                      ? "border-pitch/30 bg-pitch/5"
                      : "border-sky/30 bg-sky/5"
                  )}
                >
                  <p className="mb-1 font-semibold">
                    {chosen.correct ? "✅ Correct" : "💡 Here's the idea"}
                  </p>
                  <p className="text-haze">{chosen.feedback}</p>
                </div>
                <Button className="mt-4 w-full" onClick={next}>
                  {index === items.length - 1 ? "See results" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
