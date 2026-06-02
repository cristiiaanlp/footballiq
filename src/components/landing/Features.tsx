"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Flame,
  GitBranch,
  GraduationCap,
  LayoutGrid,
  PenTool,
  Trophy,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: PenTool,
    title: "Pizarra Táctica",
    desc: "Pizarra interactiva: mueve jugadores, dibuja flechas, crea sistemas y expórtalos.",
    accent: "text-pitch",
  },
  {
    icon: Brain,
    title: "Quizzes tácticos",
    desc: "Pressing, posesión, espacios, coberturas… responde, aprende el porqué y puntúa.",
    accent: "text-sky-light",
  },
  {
    icon: GitBranch,
    title: "Escenarios de partido",
    desc: "Situaciones reales de partido. ¿Cuál es la mejor decisión? Decide y descúbrelo.",
    accent: "text-gold",
  },
  {
    icon: GraduationCap,
    title: "Academia",
    desc: "Módulos visuales y animados: transiciones, amplitud, tercer hombre, bloques.",
    accent: "text-pitch",
  },
  {
    icon: Trophy,
    title: "Modo Entrenador",
    desc: "XP, niveles, rangos y logros. De Entrenador Novato a Maestro Táctico.",
    accent: "text-gold",
  },
  {
    icon: Flame,
    title: "Retos diarios",
    desc: "Un reto nuevo cada día, rachas y ranking. Vuelve, mejora y mantén tu racha.",
    accent: "text-danger",
  },
  {
    icon: LayoutGrid,
    title: "Formaciones",
    desc: "Explora 4-3-3, 4-4-2, 3-5-2… con fortalezas, debilidades y usos reales.",
    accent: "text-sky-light",
  },
  {
    icon: Zap,
    title: "Experiencia premium",
    desc: "Dark mode, animaciones suaves y mobile-first. Se siente como una app nativa.",
    accent: "text-pitch",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Todo para subir tu <span className="text-gradient">IQ futbolístico</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-haze">
          No es otra app de resultados. Es la plataforma para entender el juego de
          verdad — de forma divertida, visual y competitiva.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="card group p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"
          >
            <div className="mb-3 inline-flex rounded-xl bg-white/5 p-2.5">
              <f.icon className={`h-6 w-6 ${f.accent}`} />
            </div>
            <h3 className="mb-1 font-bold">{f.title}</h3>
            <p className="text-sm text-muted">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
