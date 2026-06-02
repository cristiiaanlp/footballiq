"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
  glow?: "pitch" | "sky" | "gold" | "none";
}

const glows: Record<string, string> = {
  pitch: "hover:shadow-glow hover:border-pitch/40",
  sky: "hover:shadow-glow-blue hover:border-sky/40",
  gold: "hover:shadow-glow-gold hover:border-gold/40",
  none: "",
};

export function Card({
  className,
  interactive,
  glow = "none",
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "card p-5 transition-all duration-300",
        interactive && "cursor-pointer hover:bg-white/[0.06]",
        glows[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
