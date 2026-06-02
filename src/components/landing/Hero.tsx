"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SceneView } from "@/components/pitch/SceneView";
import { ACADEMY } from "@/data/academy";

const demoFrames = ACADEMY[0].lessons[0].frames;

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:pt-16">
      {/* stadium photo backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[680px] bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px] bg-gradient-to-b from-ink-900/40 via-ink-900/70 to-ink-900" />
      {/* glow backdrop */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-radial-pitch" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-pitch/30 bg-pitch/10 px-3 py-1 text-sm text-pitch-light"
          >
            <Sparkles className="h-4 w-4" />
            The Chess.com of football
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
          >
            Aprende fútbol
            <br />
            como un <span className="text-gradient">entrenador</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 max-w-md text-lg text-haze"
          >
            Domina tácticas, sistemas y lectura de juego de forma interactiva.
            Pizarras, retos y simulaciones — divertido, visual y adictivo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/register">
              <Button size="lg">
                Empieza a entrenar <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/tactic-lab">
              <Button size="lg" variant="secondary">
                <Play className="h-5 w-5" /> Probar la pizarra
              </Button>
            </Link>
          </motion.div>

          <div className="mt-8 flex items-center gap-6 text-sm text-muted">
            <div>
              <span className="block text-xl font-bold text-chalk">8</span>
              módulos tácticos
            </div>
            <div>
              <span className="block text-xl font-bold text-chalk">6</span>
              formaciones
            </div>
            <div>
              <span className="block text-xl font-bold text-chalk">XP</span>
              gamificado
            </div>
          </div>
        </div>

        {/* Live pitch demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="relative mx-auto w-full max-w-xs animate-float lg:max-w-sm"
        >
          <div className="card p-3 shadow-glow">
            <SceneView frames={demoFrames} intervalMs={1400} />
            <p className="mt-2 px-1 text-center text-xs text-muted">
              Pressing en arco · animación en vivo
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
