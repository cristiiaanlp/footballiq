import { cn } from "@/lib/utils";
import type { PlayerRole } from "@/types";

const roleRing: Record<PlayerRole, string> = {
  GK: "ring-gold/60",
  DEF: "ring-sky/50",
  MID: "ring-pitch/50",
  FWD: "ring-danger/50",
};

/** A single player marker. Sized in `em` so it scales with parent font-size. */
export function PlayerChip({
  number,
  team,
  role = "MID",
  label,
  color,
  highlight,
  dimmed,
  className,
}: {
  number: number;
  team: "home" | "away";
  role?: PlayerRole;
  label?: string;
  /** Optional custom kit color (overrides the default team gradient). */
  color?: string;
  highlight?: boolean;
  dimmed?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-0.5", className)}>
      <div
        className={cn(
          "relative flex h-[2.2em] w-[2.2em] items-center justify-center rounded-full text-[0.95em] font-bold shadow-lg ring-2 transition-transform",
          !color &&
            (team === "home"
              ? "bg-gradient-to-br from-pitch to-pitch-dark text-ink-900"
              : "bg-gradient-to-br from-ink-700 to-ink-800 text-chalk"),
          roleRing[role],
          highlight && "ring-4 ring-gold shadow-glow-gold scale-110",
          dimmed && "opacity-40"
        )}
        style={color ? { background: color, color: "#0B0F17" } : undefined}
      >
        {number}
        {highlight && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full ring-2 ring-gold" />
        )}
      </div>
      {label && (
        <span className="rounded bg-ink-900/70 px-1 text-[0.6em] font-medium text-haze">
          {label}
        </span>
      )}
    </div>
  );
}
