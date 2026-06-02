import { Lock } from "lucide-react";
import { Badge } from "./Badge";

/** Small overlay/marker used to gate Premium-only content. */
export function PremiumBadge() {
  return (
    <Badge tone="gold">
      <Lock className="h-3 w-3" /> Premium
    </Badge>
  );
}

export function PremiumOverlay({ children }: { children?: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-ink-900/70 backdrop-blur-sm">
      <div className="rounded-full bg-gold/15 p-3 text-gold">
        <Lock className="h-6 w-6" />
      </div>
      <p className="px-6 text-center text-sm text-haze">
        {children ?? "Unlock this with Football IQ Premium"}
      </p>
    </div>
  );
}
