"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng, toCanvas } from "html-to-image";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import {
  Camera,
  Download,
  Eraser,
  Film,
  HelpCircle,
  Library,
  Lock,
  MousePointer2,
  Pencil,
  PenLine,
  Play,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Square,
  Trash2,
  Undo2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Pitch } from "./Pitch";
import { PlayerChip } from "./PlayerChip";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Spinner";
import { FORMATIONS } from "@/data/formations";
import { useGameStore } from "@/stores/gameStore";
import {
  useTacticsStore,
  type SavedTactic,
  type TacticFrame,
} from "@/stores/tacticsStore";
import { clamp } from "@/lib/utils";
import { playSound } from "@/lib/sound";
import { upgradeToPremium } from "@/lib/checkout";
import type { Arrow, PlayerRole, PlayerToken, Vec2 } from "@/types";

const FREE_TACTICS_LIMIT = 3;

type Tool = "move" | "arrow" | "edit";
type ArrowKind = "pass" | "run" | "dribble";

const ARROW_COLORS = ["#FACC15", "#22C55E", "#3B82F6", "#EF4444"];
const ROLES: PlayerRole[] = ["GK", "DEF", "MID", "FWD"];
const SPEED_MS = { slow: 1600, normal: 1100, fast: 700 } as const;
const BALL_ID = "__ball__";

// Arrows are drawn in a 200×300 viewBox (== the pitch 2:3 ratio) so a unit is
// isotropic: X = x%·2, Y = y%·3. This keeps wavy paths and angles undistorted.
const VX = (x: number) => x * 2;
const VY = (y: number) => y * 3;

function buildTeam(formationId: string, team: "home" | "away"): PlayerToken[] {
  const f = FORMATIONS.find((x) => x.id === formationId) ?? FORMATIONS[0];
  return f.positions.map((pos, i) => ({
    id: `${team}-${i}`,
    pos:
      team === "home"
        ? { ...pos.pos }
        : { x: 100 - pos.pos.x, y: 100 - pos.pos.y },
    number: pos.number,
    role: pos.role,
    team,
  }));
}

/** Build a wavy SVG path (dribble notation) between two points in viewBox units. */
function wavyPath(from: Vec2, to: Vec2): string {
  const ax = VX(from.x);
  const ay = VY(from.y);
  const bx = VX(to.x);
  const by = VY(to.y);
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // perpendicular
  const py = ux;
  const amp = 4;
  const waves = Math.max(2, Math.round(len / 14));
  const steps = waves * 8;
  let d = `M ${ax} ${ay}`;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const off = Math.sin(t * waves * Math.PI * 2) * amp * (1 - t * 0.15);
    const x = ax + dx * t + px * off;
    const y = ay + dy * t + py * off;
    d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

let arrowSeq = 0;
let extraSeq = 0;

interface Snapshot {
  players: PlayerToken[];
  ball: Vec2;
  arrows: Arrow[];
  frames: TacticFrame[];
  homeColor: string;
  awayColor: string;
}

export function TacticBoard({ initial }: { initial?: SavedTactic }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const saveTacticStat = useGameStore((s) => s.saveTactic);
  const isPremium = useGameStore((s) => s.isPremium);
  const setPremium = useGameStore((s) => s.setPremium);
  const upsert = useTacticsStore((s) => s.upsert);
  const tacticsCount = useTacticsStore((s) => s.tactics.length);

  const [formation, setFormation] = useState(initial?.formation ?? "433");
  const [showAway, setShowAway] = useState(initial?.showAway ?? false);
  const [players, setPlayers] = useState<PlayerToken[]>(
    () => initial?.players ?? buildTeam("433", "home")
  );
  const [ball, setBall] = useState<Vec2>(initial?.ball ?? { x: 50, y: 50 });
  const [homeColor, setHomeColor] = useState(initial?.homeColor ?? "#22C55E");
  const [awayColor, setAwayColor] = useState(initial?.awayColor ?? "#64748B");

  const [tool, setTool] = useState<Tool>("move");
  const [arrowKind, setArrowKind] = useState<ArrowKind>("pass");
  const [arrowColor, setArrowColor] = useState(ARROW_COLORS[0]);
  const [arrows, setArrows] = useState<Arrow[]>(initial?.arrows ?? []);
  const [draft, setDraft] = useState<Arrow | null>(null);

  // Animation
  const [frames, setFrames] = useState<TacticFrame[]>(initial?.frames ?? []);
  const [playing, setPlaying] = useState(false);
  const [playIdx, setPlayIdx] = useState<number | null>(null);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const playTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveSnapshot = useRef<{ players: PlayerToken[]; ball: Vec2 } | null>(null);

  // History
  const past = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const [, bump] = useState(0);

  // Save / edit
  const [currentId, setCurrentId] = useState<string | undefined>(initial?.id);
  const [nameModal, setNameModal] = useState(false);
  const [draftName, setDraftName] = useState(initial?.name ?? "");
  const [savedToast, setSavedToast] = useState(false);
  const [editing, setEditing] = useState<PlayerToken | null>(null);
  const [exporting, setExporting] = useState(false);
  const [upsell, setUpsell] = useState<string | null>(null);
  const [howModal, setHowModal] = useState(false);

  const dragId = useRef<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setFormation(initial.formation);
    setShowAway(initial.showAway);
    setPlayers(initial.players);
    setArrows(initial.arrows);
    setFrames(initial.frames);
    setBall(initial.ball ?? { x: 50, y: 50 });
    setHomeColor(initial.homeColor ?? "#22C55E");
    setAwayColor(initial.awayColor ?? "#64748B");
    setCurrentId(initial.id);
    setDraftName(initial.name);
    past.current = [];
    future.current = [];
  }, [initial]);

  useEffect(() => () => stopPlay(), []); // cleanup

  // First-visit tutorial for the animation flow.
  useEffect(() => {
    try {
      if (!localStorage.getItem("fiq-lab-tutorial")) {
        setHowModal(true);
        localStorage.setItem("fiq-lab-tutorial", "1");
      }
    } catch {
      /* ignore */
    }
  }, []);

  // ── History ──────────────────────────────────────────────────────
  const snapshot = useCallback((): Snapshot => ({
    players: players.map((p) => ({ ...p, pos: { ...p.pos } })),
    ball: { ...ball },
    arrows: arrows.map((a) => ({ ...a })),
    frames: frames.map((f) => ({
      positions: { ...f.positions },
      ball: f.ball ? { ...f.ball } : undefined,
    })),
    homeColor,
    awayColor,
  }), [players, ball, arrows, frames, homeColor, awayColor]);

  const restore = (s: Snapshot) => {
    setPlayers(s.players);
    setBall(s.ball);
    setArrows(s.arrows);
    setFrames(s.frames);
    setHomeColor(s.homeColor);
    setAwayColor(s.awayColor);
  };

  const commit = () => {
    past.current.push(snapshot());
    if (past.current.length > 40) past.current.shift();
    future.current = [];
    bump((v) => v + 1);
  };

  const undo = () => {
    if (!past.current.length) return;
    future.current.push(snapshot());
    restore(past.current.pop()!);
    bump((v) => v + 1);
  };

  const redo = () => {
    if (!future.current.length) return;
    past.current.push(snapshot());
    restore(future.current.pop()!);
    bump((v) => v + 1);
  };

  // ── Geometry ─────────────────────────────────────────────────────
  const pointToPercent = useCallback((clientX: number, clientY: number): Vec2 => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 50, y: 50 };
    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 2, 98),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 2, 98),
    };
  }, []);

  // ── Dragging (players + ball) ────────────────────────────────────
  const onPlayerPointerDown = (e: React.PointerEvent, p: PlayerToken) => {
    if (playing) return;
    if (tool === "edit") {
      e.stopPropagation();
      setEditing(p);
      return;
    }
    if (tool !== "move") return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    commit();
    dragId.current = p.id;
  };

  const onBallPointerDown = (e: React.PointerEvent) => {
    if (playing || tool !== "move") return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    commit();
    dragId.current = BALL_ID;
  };

  const onBoardPointerMove = (e: React.PointerEvent) => {
    if (playing) return;
    if (tool === "move" && dragId.current) {
      const pos = pointToPercent(e.clientX, e.clientY);
      if (dragId.current === BALL_ID) setBall(pos);
      else
        setPlayers((prev) =>
          prev.map((p) => (p.id === dragId.current ? { ...p, pos } : p))
        );
    } else if (tool === "arrow" && draft) {
      setDraft({ ...draft, to: pointToPercent(e.clientX, e.clientY) });
    }
  };

  const onBoardPointerUp = () => {
    dragId.current = null;
    if (draft) {
      const d = Math.hypot(draft.to.x - draft.from.x, draft.to.y - draft.from.y);
      if (d > 4) setArrows((a) => [...a, draft]);
      setDraft(null);
    }
  };

  const onBoardPointerDown = (e: React.PointerEvent) => {
    if (tool !== "arrow" || playing) return;
    const from = pointToPercent(e.clientX, e.clientY);
    commit();
    setDraft({ id: `arrow-${arrowSeq++}`, from, to: from, kind: arrowKind, color: arrowColor });
  };

  // ── Animation ────────────────────────────────────────────────────
  const captureFrame = () => {
    commit();
    setFrames((f) => [
      ...f,
      {
        positions: Object.fromEntries(players.map((p) => [p.id, { ...p.pos }])),
        ball: { ...ball },
      },
    ]);
  };

  const applyFrame = (k: number, src: TacticFrame[]) => {
    const frame = src[k];
    setPlayers((prev) =>
      prev.map((p) =>
        frame.positions[p.id] ? { ...p, pos: { ...frame.positions[p.id] } } : p
      )
    );
    if (frame.ball) setBall({ ...frame.ball });
  };

  function stopPlay() {
    if (playTimer.current) clearInterval(playTimer.current);
    playTimer.current = null;
    setPlaying(false);
    setPlayIdx(null);
    if (liveSnapshot.current) {
      setPlayers(liveSnapshot.current.players);
      setBall(liveSnapshot.current.ball);
      liveSnapshot.current = null;
    }
  }

  const play = () => {
    if (frames.length < 2) return;
    liveSnapshot.current = { players: players.map((p) => ({ ...p })), ball: { ...ball } };
    setTool("move");
    setPlaying(true);
    let k = 0;
    setPlayIdx(0);
    applyFrame(0, frames);
    playTimer.current = setInterval(() => {
      k = (k + 1) % frames.length;
      setPlayIdx(k);
      applyFrame(k, frames);
    }, SPEED_MS[speed]);
  };

  const removeFrame = (idx: number) => {
    commit();
    setFrames((f) => f.filter((_, i) => i !== idx));
  };

  // ── Players: edit / add ──────────────────────────────────────────
  const updateEditing = (patch: Partial<PlayerToken>) => {
    if (!editing) return;
    setPlayers((prev) =>
      prev.map((p) => (p.id === editing.id ? { ...p, ...patch } : p))
    );
    setEditing((e) => (e ? { ...e, ...patch } : e));
  };

  const deleteEditing = () => {
    if (!editing) return;
    commit();
    setPlayers((prev) => prev.filter((p) => p.id !== editing.id));
    setEditing(null);
  };

  const addPlayer = () => {
    commit();
    setPlayers((prev) => [
      ...prev,
      {
        id: `extra-${extraSeq++}`,
        pos: { x: 50, y: 50 },
        number: prev.filter((p) => p.team === "home").length + 1,
        role: "MID",
        team: "home",
      },
    ]);
  };

  // ── Toolbar actions ──────────────────────────────────────────────
  const loadFormation = (id: string) => {
    if (playing) stopPlay();
    commit();
    setFormation(id);
    setPlayers([
      ...buildTeam(id, "home"),
      ...(showAway ? buildTeam("442", "away") : []),
    ]);
    setFrames([]);
  };

  const toggleAway = () => {
    commit();
    setShowAway((prev) => {
      const next = !prev;
      setPlayers((cur) => {
        const home = cur.filter((p) => p.team === "home");
        return next ? [...home, ...buildTeam("442", "away")] : home;
      });
      return next;
    });
  };

  const resetBoard = () => {
    if (playing) stopPlay();
    commit();
    setArrows([]);
    setDraft(null);
    setFrames([]);
    setBall({ x: 50, y: 50 });
    setPlayers([
      ...buildTeam(formation, "home"),
      ...(showAway ? buildTeam("442", "away") : []),
    ]);
  };

  const exportImage = async () => {
    if (!boardRef.current) return;
    try {
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0B0F17",
      });
      const link = document.createElement("a");
      link.download = `${(draftName || formation).replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      /* ignore */
    }
  };

  const shareImage = async () => {
    if (!boardRef.current) return;
    try {
      const dataUrl = await toPng(boardRef.current, {
        pixelRatio: 2,
        backgroundColor: "#0B0F17",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `${(draftName || formation).replace(/\s+/g, "-")}.png`,
        { type: "image/png" }
      );
      const nav = navigator as Navigator & {
        canShare?: (d: { files: File[] }) => boolean;
      };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: draftName || "Mi táctica",
          text: "Mira mi táctica en Football IQ ⚽",
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = file.name;
        a.click();
      }
    } catch {
      /* ignore */
    }
  };

  const exportGif = async () => {
    if (!boardRef.current || frames.length < 2 || exporting) return;
    if (!isPremium) {
      setUpsell("Exportar tu jugada como GIF animado es una función Premium.");
      return;
    }
    if (playing) stopPlay();
    setExporting(true);
    const before = snapshot();
    try {
      const enc = GIFEncoder();
      const W = 280;
      const H = 420;
      const small = document.createElement("canvas");
      small.width = W;
      small.height = H;
      const sctx = small.getContext("2d");
      for (let i = 0; i < frames.length; i++) {
        applyFrame(i, frames);
        await new Promise((r) => setTimeout(r, 80));
        const canvas = await toCanvas(boardRef.current, {
          pixelRatio: 1,
          backgroundColor: "#0B0F17",
        });
        if (!sctx) break;
        sctx.drawImage(canvas, 0, 0, W, H);
        const { data } = sctx.getImageData(0, 0, W, H);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        enc.writeFrame(index, W, H, { palette, delay: SPEED_MS[speed] });
      }
      enc.finish();
      const blob = new Blob([enc.bytes() as unknown as BlobPart], {
        type: "image/gif",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(draftName || formation).replace(/\s+/g, "-")}.gif`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    } finally {
      restore(before);
      setExporting(false);
    }
  };

  const confirmSave = () => {
    const name = draftName.trim() || `Táctica ${formation}`;
    const isNew = !currentId;
    if (isNew && !isPremium && tacticsCount >= FREE_TACTICS_LIMIT) {
      setNameModal(false);
      setUpsell(
        `El plan gratuito permite ${FREE_TACTICS_LIMIT} tácticas guardadas. Hazte Premium para guardar ilimitadas.`
      );
      return;
    }
    const id = upsert({
      id: currentId,
      name,
      formation,
      showAway,
      players,
      arrows,
      frames,
      ball,
      homeColor,
      awayColor,
    });
    setCurrentId(id);
    if (isNew) saveTacticStat();
    playSound("save");
    setNameModal(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  const allArrows = draft ? [...arrows, draft] : arrows;
  const canUndo = past.current.length > 0;
  const canRedo = future.current.length > 0;

  const renderArrow = (a: Arrow) => {
    const headId = `head-${a.color.replace("#", "")}`;
    if (a.kind === "dribble") {
      return (
        <path
          key={a.id}
          d={wavyPath(a.from, a.to)}
          fill="none"
          stroke={a.color}
          strokeWidth={2.4}
          strokeLinecap="round"
          markerEnd={`url(#${headId})`}
        />
      );
    }
    return (
      <line
        key={a.id}
        x1={VX(a.from.x)}
        y1={VY(a.from.y)}
        x2={VX(a.to.x)}
        y2={VY(a.to.y)}
        stroke={a.color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeDasharray={a.kind === "run" ? "7 5" : undefined}
        markerEnd={`url(#${headId})`}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* ── Board ── */}
      <div className="relative flex-1">
        <div
          ref={boardRef}
          onPointerDown={onBoardPointerDown}
          onPointerMove={onBoardPointerMove}
          onPointerUp={onBoardPointerUp}
          className="touch-none"
        >
          <Pitch className="text-[clamp(11px,3.8vw,16px)]">
            {/* Arrows */}
            <svg
              viewBox="0 0 200 300"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <defs>
                {ARROW_COLORS.map((c) => (
                  <marker
                    key={c}
                    id={`head-${c.replace("#", "")}`}
                    markerWidth="5"
                    markerHeight="5"
                    refX="3.5"
                    refY="2.5"
                    orient="auto"
                  >
                    <path d="M0,0 L5,2.5 L0,5 Z" fill={c} />
                  </marker>
                ))}
              </defs>
              {allArrows.map(renderArrow)}
            </svg>

            {/* Players */}
            {players.map((p) => (
              <motion.div
                key={p.id}
                onPointerDown={(e) => onPlayerPointerDown(e, p)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                  !playing && (tool === "move" || tool === "edit")
                    ? tool === "edit"
                      ? "cursor-pointer"
                      : "cursor-grab active:cursor-grabbing"
                    : ""
                }`}
                animate={{ left: `${p.pos.x}%`, top: `${p.pos.y}%` }}
                transition={
                  playing ? { type: "spring", stiffness: 55, damping: 14 } : { duration: 0 }
                }
              >
                <PlayerChip
                  number={p.number}
                  team={p.team}
                  role={p.role}
                  label={p.label}
                  color={p.team === "home" ? homeColor : awayColor}
                />
              </motion.div>
            ))}

            {/* Ball */}
            <motion.div
              onPointerDown={onBallPointerDown}
              className={`absolute z-10 flex h-[1.5em] w-[1.5em] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[0.9em] shadow-glow ${
                !playing && tool === "move" ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              animate={{ left: `${ball.x}%`, top: `${ball.y}%` }}
              transition={
                playing ? { type: "spring", stiffness: 80, damping: 14 } : { duration: 0 }
              }
            >
              ⚽
            </motion.div>
          </Pitch>
        </div>

        {savedToast && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-pitch px-4 py-1.5 text-sm font-semibold text-ink-900 shadow-glow">
            ✓ Táctica guardada
          </div>
        )}
        {exporting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-ink-900/70 backdrop-blur-sm">
            <Spinner />
            <p className="text-sm text-haze">Generando GIF…</p>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex w-full flex-col gap-4 lg:w-72">
        {/* Undo / redo */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={undo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" /> Deshacer
          </Button>
          <Button variant="secondary" size="sm" onClick={redo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" /> Rehacer
          </Button>
        </div>

        {/* Animation studio */}
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Animar jugada
            </p>
            <button
              onClick={() => setHowModal(true)}
              className="flex items-center gap-1 text-xs font-medium text-sky-light hover:underline"
            >
              <HelpCircle className="h-3.5 w-3.5" /> ¿Cómo?
            </button>
          </div>

          {/* Dynamic step guidance */}
          <div className="mb-3 rounded-xl border border-pitch/20 bg-pitch/5 p-3 text-xs leading-relaxed text-haze">
            {playing ? (
              <>▶ Reproduciendo… pulsa <b className="text-haze">Stop</b> para volver a editar.</>
            ) : frames.length === 0 ? (
              <>
                <b className="text-pitch-light">Paso 1.</b> Coloca a los jugadores y
                el balón en la posición inicial y pulsa{" "}
                <b className="text-haze">Capturar paso</b>.
              </>
            ) : frames.length === 1 ? (
              <>
                <b className="text-pitch-light">Paso 2.</b> Ahora{" "}
                <b className="text-haze">mueve</b> a los jugadores y el balón al
                siguiente momento de la jugada y pulsa{" "}
                <b className="text-haze">Capturar paso</b> otra vez.
              </>
            ) : (
              <>
                <b className="text-pitch-light">¡Listo!</b> Tienes {frames.length}{" "}
                pasos. Dale a <b className="text-pitch-light">▶ Play</b> para ver la
                jugada, o captura más pasos.
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={!playing && frames.length < 2 ? "primary" : "secondary"}
              size="sm"
              onClick={captureFrame}
              disabled={playing}
            >
              <Camera className="h-4 w-4" /> Capturar paso
            </Button>
            {playing ? (
              <Button variant="danger" size="sm" onClick={stopPlay}>
                <Square className="h-4 w-4" /> Stop
              </Button>
            ) : (
              <Button size="sm" onClick={play} disabled={frames.length < 2}>
                <Play className="h-4 w-4" /> Play
              </Button>
            )}
          </div>

          {!playing && frames.length < 2 && (
            <p className="mt-1.5 text-center text-[11px] text-muted">
              ▶ Play y GIF necesitan al menos 2 pasos
            </p>
          )}

          {frames.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                Pasos de la jugada
              </p>
              <div className="flex flex-wrap gap-1.5">
                {frames.map((_, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-semibold ${
                      playIdx === i
                        ? "border-gold bg-gold/20 text-gold"
                        : "border-white/10 text-haze"
                    }`}
                  >
                    {i + 1}
                    {!playing && (
                      <button
                        onClick={() => removeFrame(i)}
                        className="text-muted hover:text-danger"
                        aria-label={`Borrar paso ${i + 1}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Velocidad
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["slow", "normal", "fast"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  disabled={playing}
                  className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                    speed === s
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-white/10 text-haze hover:bg-white/5"
                  }`}
                >
                  {s === "slow" ? "Lenta" : s === "normal" ? "Normal" : "Rápida"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Formation */}
        <div className="card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Formación
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FORMATIONS.map((f) => (
              <button
                key={f.id}
                onClick={() => loadFormation(f.id)}
                className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-all ${
                  formation === f.id
                    ? "border-pitch bg-pitch/15 text-pitch-light shadow-glow"
                    : "border-white/10 text-haze hover:bg-white/5"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Herramientas
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={tool === "move" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTool("move")}
            >
              <MousePointer2 className="h-4 w-4" /> Mover
            </Button>
            <Button
              variant={tool === "arrow" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTool("arrow")}
              disabled={playing}
            >
              <PenLine className="h-4 w-4" /> Flecha
            </Button>
            <Button
              variant={tool === "edit" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setTool("edit")}
              disabled={playing}
            >
              <Pencil className="h-4 w-4" /> Editar
            </Button>
          </div>

          {tool === "arrow" && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    ["pass", "Pase"],
                    ["run", "Desmarque"],
                    ["dribble", "Conducción"],
                  ] as const
                ).map(([k, label]) => (
                  <button
                    key={k}
                    onClick={() => setArrowKind(k)}
                    className={`rounded-lg border px-1 py-1.5 text-[11px] font-semibold transition-all ${
                      arrowKind === k
                        ? "border-pitch bg-pitch/15 text-pitch-light"
                        : "border-white/10 text-haze hover:bg-white/5"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Color</span>
                {ARROW_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setArrowColor(c)}
                    className={`h-6 w-6 rounded-full border-2 transition-transform ${
                      arrowColor === c ? "scale-110 border-white" : "border-transparent"
                    }`}
                    style={{ background: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>
          )}

          {tool === "edit" && (
            <p className="mt-3 text-[11px] text-muted">
              Toca un jugador para cambiar su dorsal, nombre o posición.
            </p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" onClick={() => { commit(); setArrows([]); }}>
              <Eraser className="h-4 w-4" /> Flechas
            </Button>
            <Button variant="ghost" size="sm" onClick={addPlayer}>
              <Plus className="h-4 w-4" /> Jugador
            </Button>
          </div>
        </div>

        {/* Teams */}
        <div className="card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Equipos
          </p>
          <div className="flex items-center gap-4">
            <ColorField label="Local" value={homeColor} onChange={(c) => { commit(); setHomeColor(c); }} />
            <ColorField label="Rival" value={awayColor} onChange={(c) => { commit(); setAwayColor(c); }} />
            <Button variant="ghost" size="sm" className="ml-auto" onClick={toggleAway}>
              <Users className="h-4 w-4" /> {showAway ? "Quitar" : "Rivales"}
            </Button>
          </div>
        </div>

        {/* Save / export */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <Badge tone="pitch">{players.length} jugadores</Badge>
            <Badge tone="gold">{arrows.length} flechas</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => setNameModal(true)}>
              <Save className="h-4 w-4" /> {currentId ? "Actualizar táctica" : "Guardar táctica"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={exportImage}>
                <Download className="h-4 w-4" /> PNG
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={exportGif}
                disabled={frames.length < 2 || exporting}
              >
                {isPremium ? (
                  <Film className="h-4 w-4" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-gold" />
                )}{" "}
                GIF
              </Button>
            </div>
            <p className="text-center text-[11px] text-muted">
              PNG = foto fija · GIF = jugada animada (2+ pasos)
            </p>
            <Button variant="secondary" size="sm" onClick={shareImage}>
              <Share2 className="h-4 w-4" /> Compartir
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" onClick={resetBoard}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
              <Link href="/my-tactics">
                <Button variant="ghost" size="sm" className="w-full">
                  <Library className="h-4 w-4" /> Tácticas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Save modal */}
      <Modal
        open={nameModal}
        onClose={() => setNameModal(false)}
        title={currentId ? "Actualizar táctica" : "Guardar táctica"}
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-haze">Nombre</span>
          <input
            autoFocus
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmSave()}
            placeholder="Salida de balón vs. presión alta"
            className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={confirmSave}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={() => setNameModal(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>

      {/* Player edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar jugador">
        {editing && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-haze">Dorsal</span>
                <input
                  type="number"
                  value={editing.number}
                  onChange={(e) => updateEditing({ number: Number(e.target.value) || 0 })}
                  className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-haze">Nombre</span>
                <input
                  value={editing.label ?? ""}
                  onChange={(e) => updateEditing({ label: e.target.value })}
                  placeholder="Opcional"
                  className="h-11 w-full rounded-xl border border-white/10 bg-ink-800/60 px-4 text-sm text-chalk placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/30"
                />
              </label>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-haze">Posición</span>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => updateEditing({ role: r })}
                    className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-all ${
                      editing.role === r
                        ? "border-pitch bg-pitch/15 text-pitch-light"
                        : "border-white/10 text-haze hover:bg-white/5"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => setEditing(null)}>
                Listo
              </Button>
              <Button variant="danger" onClick={deleteEditing}>
                <Trash2 className="h-4 w-4" /> Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* How-to: animating a play */}
      <Modal open={howModal} onClose={() => setHowModal(false)} title="Cómo animar tu jugada">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-haze">
            Una jugada animada se monta con <b className="text-chalk">pasos</b>: una
            foto de dónde están los jugadores en cada momento. La app los mueve
            suavemente de un paso al siguiente.
          </p>
          <ol className="flex flex-col gap-3">
            {[
              ["Coloca", "Arrastra a los jugadores y el balón a la posición inicial."],
              ["Captura paso 1", "Pulsa «Capturar paso» para guardar ese momento."],
              ["Mueve", "Arrastra a los jugadores al siguiente momento de la jugada."],
              ["Captura paso 2", "Pulsa «Capturar paso» otra vez. Repite los que quieras."],
              ["▶ Play", "Dale a Play y verás moverse la jugada. Exporta un GIF si eres Premium."],
            ].map(([t, d], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pitch/20 text-xs font-bold text-pitch-light">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="text-xs text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rounded-xl border border-sky/20 bg-sky/5 p-3 text-xs text-haze">
            💡 Las <b className="text-haze">flechas</b> son solo dibujo (no se
            mueven). Para que algo se mueva, tienes que capturar pasos.
          </div>
          <Button onClick={() => setHowModal(false)}>¡Entendido!</Button>
        </div>
      </Modal>

      {/* Premium upsell */}
      <Modal open={!!upsell} onClose={() => setUpsell(null)} title="Función Premium">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-gold/15 p-3 text-gold">
            <Lock className="h-6 w-6" />
          </div>
          <p className="text-sm text-haze">{upsell}</p>
          <div className="flex w-full flex-col gap-2">
            <Button
              variant="gold"
              onClick={() => {
                setUpsell(null);
                upgradeToPremium(() => setPremium(true));
              }}
            >
              <Sparkles className="h-4 w-4" /> Hazte Premium
            </Button>
            <Button variant="ghost" onClick={() => setUpsell(null)}>
              Ahora no
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-haze">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        aria-label={`Color ${label}`}
      />
      {label}
    </label>
  );
}
