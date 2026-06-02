import { cn } from "@/lib/utils";

/**
 * Vertical football pitch (portrait, mobile-first). Coordinate system used by
 * all overlays is percentage based: x 0→100 left→right, y 0→100 top→bottom.
 * Home team attacks UP (toward y = 0).
 */
export function Pitch({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] w-full select-none overflow-hidden rounded-2xl border border-pitch/20",
        "bg-gradient-to-b from-[#0d2818] via-[#0a2114] to-[#0d2818]",
        className
      )}
    >
      {/* Mowed stripes */}
      <div className="pitch-stripes absolute inset-0" />

      {/* Field markings */}
      <svg
        viewBox="0 0 100 150"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        >
          {/* Outer boundary */}
          <rect x="3" y="3" width="94" height="144" rx="1" />
          {/* Halfway line */}
          <line x1="3" y1="75" x2="97" y2="75" />
          {/* Center circle + spot */}
          <circle cx="50" cy="75" r="11" />
          <circle cx="50" cy="75" r="0.8" fill="rgba(255,255,255,0.4)" />
          {/* Top penalty area */}
          <rect x="22" y="3" width="56" height="22" />
          <rect x="37" y="3" width="26" height="9" />
          <circle cx="50" cy="17" r="0.8" fill="rgba(255,255,255,0.4)" />
          <path d="M 38 25 A 12 12 0 0 0 62 25" />
          {/* Bottom penalty area */}
          <rect x="22" y="125" width="56" height="22" />
          <rect x="37" y="138" width="26" height="9" />
          <circle cx="50" cy="133" r="0.8" fill="rgba(255,255,255,0.4)" />
          <path d="M 38 125 A 12 12 0 0 1 62 125" />
          {/* Goals */}
          <rect x="42" y="1.5" width="16" height="1.5" stroke="rgba(255,255,255,0.5)" />
          <rect x="42" y="147" width="16" height="1.5" stroke="rgba(255,255,255,0.5)" />
        </g>
      </svg>

      {children}
    </div>
  );
}
