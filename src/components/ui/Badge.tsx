import { cn } from "@/lib/utils";

type Tone = "pitch" | "sky" | "gold" | "danger" | "neutral";

const tones: Record<Tone, string> = {
  pitch: "bg-pitch/15 text-pitch-light border-pitch/30",
  sky: "bg-sky/15 text-sky-light border-sky/30",
  gold: "bg-gold/15 text-gold border-gold/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  neutral: "bg-white/5 text-haze border-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
