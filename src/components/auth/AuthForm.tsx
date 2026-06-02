"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Brand } from "@/components/layout/Brand";
import { useAuth } from "@/hooks/useAuth";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { signIn, signUp, demoMode } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const isLogin = mode === "login";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        router.replace("/dashboard");
      } else {
        await signUp(name, email, password);
        if (demoMode) {
          router.replace("/dashboard");
        } else {
          setInfo("Check your inbox to confirm your email, then sign in.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Brand size={52} textClass="text-2xl" className="mb-6 justify-center" />

        <div className="card p-6 sm:p-8">
          <h1 className="text-2xl font-bold">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isLogin
              ? "Entra para seguir entrenando tu IQ futbolístico."
              : "Empieza a aprender fútbol como un entrenador."}
          </p>

          {demoMode && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-sky/30 bg-sky/10 p-3 text-xs text-sky-light">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                Modo demo local activo. Usa cualquier email y contraseña — tu
                progreso se guarda en este dispositivo.
              </span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            {!isLogin && (
              <Field
                label="Nombre"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Tu nombre de coach"
                autoComplete="name"
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />

            {error && (
              <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-lg bg-pitch/10 px-3 py-2 text-sm text-pitch-light">
                {info}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Crear cuenta"
              )}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-semibold text-pitch hover:underline"
            >
              {isLogin ? "Regístrate" : "Entra"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-haze">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
      />
    </label>
  );
}
