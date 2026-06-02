"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const { user, loading, demoMode } = useAuth();
  const router = useRouter();

  // If already signed in, jump straight into the app.
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Brand size={40} />
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Empezar</Button>
            </Link>
          </div>
        </div>
      </header>

      <Hero />
      <Features />

      {/* Ranks teaser */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-pitch" />
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Sube de rango, partido a partido
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-haze">
            Cada quiz, escenario y módulo te da XP. Empieza como{" "}
            <b className="text-haze">Entrenador Novato</b> y llega a{" "}
            <b className="text-gradient">Maestro Táctico</b>.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            {["🥾 Novato", "📋 Asistente", "📊 Analista", "🎯 Mánager", "🏆 Élite", "🧠 Maestro"].map(
              (r, i) => (
                <motion.span
                  key={r}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium"
                >
                  {r}
                </motion.span>
              )
            )}
          </div>
          <Link href="/register" className="mt-8 inline-block">
            <Button size="lg">
              Crear mi cuenta <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 px-4 py-8 text-center text-sm text-muted">
        <p>
          Football IQ — la plataforma definitiva para aprender fútbol.
          {demoMode && " · Modo demo local activo"}
        </p>
      </footer>
    </div>
  );
}
