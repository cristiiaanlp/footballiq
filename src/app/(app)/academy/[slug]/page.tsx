"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, CheckCircle2, GraduationCap, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PremiumBadge } from "@/components/ui/PremiumLock";
import { SceneView } from "@/components/pitch/SceneView";
import { QuizRunner, type RunnerItem } from "@/components/learn/QuizRunner";
import { ACADEMY_MAP } from "@/data/academy";
import { useGameStore } from "@/stores/gameStore";
import { upgradeToPremium } from "@/lib/checkout";

export default function ModulePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const mod = ACADEMY_MAP[slug];
  if (!mod) notFound();

  const isPremium = useGameStore((s) => s.isPremium);
  const completed = useGameStore((s) => s.completedModuleIds);
  const completeModule = useGameStore((s) => s.completeModule);
  const addXp = useGameStore((s) => s.addXp);
  const touchStreak = useGameStore((s) => s.touchStreak);
  const setPremium = useGameStore((s) => s.setPremium);

  const [done, setDone] = useState(completed.includes(slug));
  const [showExam, setShowExam] = useState(false);
  const locked = mod.premium && !isPremium;
  const bonusXp = mod.lessons.reduce((a, l) => a + l.xp, 0);

  const examItems: RunnerItem[] = mod.exam.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    options: q.options,
    xp: q.xp,
  }));

  const onExamFinish = () => {
    // Bonus XP for completing the module (exam question XP is awarded by the runner).
    mod.lessons.forEach((l) => addXp(l.xp));
    completeModule(slug);
    touchStreak();
    setDone(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/academy">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4" /> Academy
        </Button>
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone={mod.accent === "danger" ? "danger" : mod.accent}>
              {mod.title}
            </Badge>
            {mod.premium && <PremiumBadge />}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {mod.title}
          </h1>
          <p className="mt-1 text-muted">{mod.concept}</p>
        </div>
        {done && (
          <Badge tone="pitch">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completado
          </Badge>
        )}
      </div>

      {locked ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <div className="rounded-full bg-gold/15 p-4 text-gold">
            <Lock className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Contenido Premium</h2>
            <p className="mt-1 text-sm text-muted">
              Desbloquea la Academy completa, tácticas ilimitadas y análisis
              avanzados.
            </p>
          </div>
          <Button
            variant="gold"
            onClick={() => upgradeToPremium(() => setPremium(true))}
          >
            <Sparkles className="h-4 w-4" /> Hazte Premium
          </Button>
          <p className="text-xs text-muted">
            Con Stripe configurado abre el checkout real; si no, desbloquea en
            modo demo.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {mod.lessons.map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">{lesson.title}</h2>
                <Badge tone="gold">+{lesson.xp} XP</Badge>
              </div>
              <p className="mb-4 text-sm text-haze">{lesson.summary}</p>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="mx-auto w-full max-w-xs">
                  <SceneView frames={lesson.frames} intervalMs={1500} />
                </div>
                <ul className="flex flex-col gap-2.5">
                  {lesson.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-pitch" />
                      <span className="text-haze">{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          {/* Module exam */}
          <div className="card p-5 sm:p-6">
            <div className="mb-1 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-pitch" />
              <h2 className="text-lg font-bold">Examen del módulo</h2>
            </div>
            <p className="mb-4 text-sm text-muted">
              Demuestra que dominas el concepto. Acierta para completar el módulo
              y llevarte un bonus de +{bonusXp} XP.
            </p>

            {done ? (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-pitch/5 p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-pitch" />
                <p className="font-semibold">Módulo completado 🎉</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowExam(true)}
                >
                  Repetir examen
                </Button>
              </div>
            ) : showExam ? (
              <QuizRunner
                items={examItems}
                title={`Examen · ${mod.title}`}
                kind="quiz"
                onFinish={onExamFinish}
              />
            ) : (
              <Button size="lg" className="w-full" onClick={() => setShowExam(true)}>
                Hacer examen · {examItems.length} preguntas
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
