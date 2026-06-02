"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  accent = "pitch",
  showLabel = false,
}: {
  value: number; // 0-100
  className?: string;
  accent?: "pitch" | "sky" | "gold";
  showLabel?: boolean;
}) {
  const accents: Record<string, string> = {
    pitch: "from-pitch to-pitch-light",
    sky: "from-sky to-sky-light",
    gold: "from-gold-dark to-gold",
  };
  return (
    <div className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div
        className={cn("h-full rounded-full bg-gradient-to-r", accents[accent])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink-900">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
