"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Swords, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SceneView } from "@/components/pitch/SceneView";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";
import { getSupabase, isSupabaseEnabled } from "@/lib/supabase";
import { RUNNER_ITEMS, shuffleSeeded } from "@/lib/content";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

const QN = 5; // preguntas por duelo
type Phase = "lobby" | "waiting" | "playing" | "over";

function codeToSeed(code: string) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h << 5) - h + code.charCodeAt(i);
  return Math.abs(h) || 1;
}
function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface Opp {
  name: string;
  ready: boolean;
  score: number;
  answered: number;
  finished: boolean;
}

export default function DuelPage() {
  const { user } = useAuth();
  const addXp = useGameStore((s) => s.addXp);

  const [phase, setPhase] = useState<Phase>("lobby");
  const [code, setCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [ready, setReady] = useState(false);
  const [opp, setOpp] = useState<Opp | null>(null);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpGiven, setXpGiven] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const myId = useRef<string>("");
  if (!myId.current) {
    myId.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Math.random());
  }

  const deck = useMemo(
    () => (code ? shuffleSeeded(RUNNER_ITEMS, codeToSeed(code)).slice(0, QN) : []),
    [code]
  );
  const item = deck[idx];

  const leave = useCallback(() => {
    const supabase = getSupabase();
    if (channelRef.current && supabase) supabase.removeChannel(channelRef.current);
    channelRef.current = null;
  }, []);

  useEffect(() => () => leave(), [leave]);

  const broadcast = (payload: Record<string, unknown>) => {
    channelRef.current?.send({ type: "broadcast", event: "progress", payload });
  };

  const join = (roomCode: string) => {
    const supabase = getSupabase();
    if (!supabase || !roomCode) return;
    const name = user?.name ?? "Coach";
    const channel = supabase.channel(`duel-${roomCode}`, {
      config: { presence: { key: myId.current } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<string, { name: string; ready: boolean }[]>;
        const others = Object.entries(state).filter(([k]) => k !== myId.current);
        if (others.length) {
          const meta = others[0][1][0];
          setOpp((prev) => ({
            name: meta.name,
            ready: meta.ready,
            score: prev?.score ?? 0,
            answered: prev?.answered ?? 0,
            finished: prev?.finished ?? false,
          }));
        } else {
          setOpp(null);
        }
      })
      .on("broadcast", { event: "progress" }, ({ payload }) => {
        if (payload.from === myId.current) return;
        setOpp((prev) => ({
          name: prev?.name ?? "Rival",
          ready: prev?.ready ?? true,
          score: payload.score ?? prev?.score ?? 0,
          answered: payload.answered ?? prev?.answered ?? 0,
          finished: payload.finished ?? prev?.finished ?? false,
        }));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ name, ready: false });
        }
      });

    channelRef.current = channel;
    setCode(roomCode);
    setPhase("waiting");
  };

  // When both players are ready, start.
  useEffect(() => {
    if (phase === "waiting" && ready && opp?.ready) {
      setIdx(0);
      setPicked(null);
      setScore(0);
      setFinished(false);
      setXpGiven(false);
      setPhase("playing");
    }
  }, [phase, ready, opp?.ready]);

  const toggleReady = async () => {
    const next = !ready;
    setReady(next);
    await channelRef.current?.track({ name: user?.name ?? "Coach", ready: next });
  };

  const choose = (optId: string, correct: boolean) => {
    if (picked) return;
    setPicked(optId);
    playSound(correct ? "correct" : "wrong");
    const nextScore = score + (correct ? 10 : 0);
    if (correct) setScore(nextScore);
    const answered = idx + 1;
    const done = answered >= QN;
    broadcast({ from: myId.current, score: nextScore, answered, finished: done });
    setTimeout(() => {
      if (done) {
        setFinished(true);
      } else {
        setIdx((i) => i + 1);
        setPicked(null);
      }
    }, 650);
  };

  // End when both finished.
  useEffect(() => {
    if (phase === "playing" && finished && opp?.finished) {
      setPhase("over");
    }
  }, [phase, finished, opp?.finished]);

  // Award XP once at the end.
  useEffect(() => {
    if (phase === "over" && !xpGiven) {
      const won = opp ? score > opp.score : true;
      addXp(won ? 40 : 15);
      setXpGiven(true);
    }
  }, [phase, xpGiven, score, opp, addXp]);

  const reset = () => {
    leave();
    setPhase("lobby");
    setCode("");
    setJoinCode("");
    setReady(false);
    setOpp(null);
  };

  // ── Not available without Supabase ──
  if (!isSupabaseEnabled) {
    return (
      <div>
        <PageHeader badge={<Badge tone="danger"><Swords className="h-3.5 w-3.5" /> Duelo 1v1</Badge>} title="Duelo 1v1" />
        <Card className="p-8 text-center">
          <p className="text-muted">
            El duelo en tiempo real necesita Supabase configurado. Inicia sesión con
            una cuenta real para jugar contra un amigo.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        badge={<Badge tone="danger"><Swords className="h-3.5 w-3.5" /> Duelo 1v1</Badge>}
        title="Duelo en tiempo real"
        subtitle="Reta a un amigo: mismas preguntas, a ver quién sabe más."
      />

      {/* LOBBY */}
      {phase === "lobby" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card glow="pitch" className="flex flex-col gap-3 p-6 text-center">
            <div className="text-3xl">🎮</div>
            <h2 className="font-bold">Crear sala</h2>
            <p className="text-sm text-muted">Genera un código y pásaselo a tu rival.</p>
            <Button onClick={() => join(randomCode())}>Crear sala</Button>
          </Card>
          <Card className="flex flex-col gap-3 p-6 text-center">
            <div className="text-3xl">🔑</div>
            <h2 className="font-bold">Unirse a sala</h2>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4}
              placeholder="CÓDIGO"
              className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-center text-lg font-bold tracking-widest text-chalk placeholder:text-muted focus:border-pitch/50 focus:outline-none"
            />
            <Button variant="secondary" onClick={() => join(joinCode)} disabled={joinCode.length < 4}>
              Unirse
            </Button>
          </Card>
        </div>
      )}

      {/* WAITING */}
      {phase === "waiting" && (
        <Card className="flex flex-col items-center gap-4 p-8 text-center">
          <p className="text-sm text-muted">Código de la sala</p>
          <div className="text-4xl font-extrabold tracking-[0.3em] text-pitch">{code}</div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 text-muted" />
            {opp ? (
              <span className="text-pitch">{opp.name} se ha unido {opp.ready ? "· listo ✓" : "· esperando…"}</span>
            ) : (
              <span className="text-muted">Esperando rival…</span>
            )}
          </div>
          <Button onClick={toggleReady} variant={ready ? "secondary" : "primary"} disabled={!opp}>
            {ready ? "Cancelar listo" : "¡Estoy listo!"}
          </Button>
          {!opp && (
            <p className="text-xs text-muted">Comparte el código para empezar.</p>
          )}
          <button onClick={reset} className="text-xs text-muted hover:text-chalk">
            Salir
          </button>
        </Card>
      )}

      {/* PLAYING */}
      {phase === "playing" && item && (
        <div>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <ScoreTile label={user?.name ?? "Tú"} score={score} you />
            <ScoreTile label={opp?.name ?? "Rival"} score={opp?.score ?? 0} />
          </div>
          <div className="mb-3 text-center text-xs text-muted">
            Pregunta {Math.min(idx + 1, QN)} / {QN}
            {finished && " · esperando al rival…"}
          </div>

          {!finished ? (
            <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-5">
              {item.scene && (
                <div className="mx-auto mb-4 max-w-[13rem]">
                  <SceneView frames={[item.scene]} />
                </div>
              )}
              <h3 className="mb-4 text-base font-semibold">{item.prompt}</h3>
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
          ) : (
            <Card className="p-8 text-center">
              <div className="text-3xl">⏳</div>
              <p className="mt-2 text-muted">Has terminado. Esperando a {opp?.name ?? "tu rival"}…</p>
            </Card>
          )}
        </div>
      )}

      {/* OVER */}
      {phase === "over" && (
        <Card className="mx-auto max-w-md p-8 text-center">
          {(() => {
            const oppScore = opp?.score ?? 0;
            const won = score > oppScore;
            const draw = score === oppScore;
            return (
              <>
                <div className="text-5xl">{won ? "🏆" : draw ? "🤝" : "💪"}</div>
                <h2 className="mt-2 text-2xl font-extrabold">
                  {won ? "¡Has ganado!" : draw ? "¡Empate!" : "Esta vez no…"}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <ScoreTile label={user?.name ?? "Tú"} score={score} you />
                  <ScoreTile label={opp?.name ?? "Rival"} score={oppScore} />
                </div>
                <div className="mt-4 flex items-center justify-center">
                  <Badge tone="gold"><Trophy className="h-3.5 w-3.5" /> +{won ? 40 : 15} XP</Badge>
                </div>
                <Button className="mt-6 w-full" onClick={reset}>
                  Nuevo duelo
                </Button>
              </>
            );
          })()}
        </Card>
      )}
    </div>
  );
}

function ScoreTile({ label, score, you }: { label: string; score: number; you?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4 text-center", you ? "border-pitch/40 bg-pitch/10" : "border-white/10 bg-white/[0.03]")}>
      <p className="truncate text-xs text-muted">{you ? "Tú" : label}</p>
      <p className="text-2xl font-extrabold">{score}</p>
    </div>
  );
}
