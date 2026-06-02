import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-pitch",
        className
      )}
    />
  );
}

export function FullScreenLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-pitch" />
        <div className="absolute inset-0 flex items-center justify-center text-lg">
          ⚽
        </div>
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
