"use client";

import { useEffect } from "react";
import { CheckCircle2, Gift, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Icon } from "@/components/ui/Icon";
import { useGameStore } from "@/stores/gameStore";
import { useMissionsStore, WEEKLY_MISSIONS } from "@/stores/missionsStore";
import { playSound } from "@/lib/sound";

export function WeeklyMissions() {
  const snapshot = useGameStore((s) => s.snapshot());
  const ensureWeek = useMissionsStore((s) => s.ensureWeek);
  const progressOf = useMissionsStore((s) => s.progress);
  const claimed = useMissionsStore((s) => s.claimed);
  const claim = useMissionsStore((s) => s.claim);

  useEffect(() => {
    ensureWeek(snapshot);
  }, [ensureWeek, snapshot]);

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Target className="h-5 w-5 text-pitch" />
        <h2 className="font-bold">Misiones de la semana</h2>
      </div>
      <div className="flex flex-col gap-3">
        {WEEKLY_MISSIONS.map((m) => {
          const prog = progressOf(m.key, snapshot);
          const reached = prog >= m.target;
          const isClaimed = claimed.includes(m.id);
          const pct = Math.min(100, (prog / m.target) * 100);
          return (
            <div key={m.id} className="rounded-xl bg-white/[0.03] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Icon name={m.icon} className="h-4 w-4 text-haze" />
                <span className="flex-1 text-sm font-medium">{m.label}</span>
                <span className="text-xs font-bold text-muted">
                  {Math.min(prog, m.target)}/{m.target}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ProgressBar value={pct} className="h-2 flex-1" accent={reached ? "gold" : "pitch"} />
                {isClaimed ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-pitch">
                    <CheckCircle2 className="h-4 w-4" /> +{m.reward}
                  </span>
                ) : reached ? (
                  <Button
                    size="sm"
                    variant="gold"
                    className="h-7 px-2.5 text-xs"
                    onClick={() => {
                      claim(m.id, m.reward);
                      playSound("levelup");
                    }}
                  >
                    <Gift className="h-3.5 w-3.5" /> +{m.reward}
                  </Button>
                ) : (
                  <span className="text-xs font-semibold text-muted">+{m.reward}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
