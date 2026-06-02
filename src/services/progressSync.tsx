"use client";

import { useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth, type AppUser } from "@/hooks/useAuth";
import { useGameStore } from "@/stores/gameStore";

type ProgressRow = {
  user_id: string;
  display_name: string | null;
  xp: number;
  level: number;
  streak: number;
  quizzes_completed: number;
  scenarios_completed: number;
  modules_completed: number;
  tactics_saved: number;
  perfect_quizzes: number;
  is_premium: boolean;
  last_active_day: string | null;
  completed_module_ids: string[];
};

function toRow(
  user: AppUser,
  s: ReturnType<typeof useGameStore.getState>
): ProgressRow {
  return {
    user_id: user.id,
    display_name: user.name,
    xp: s.xp,
    level: s.level,
    streak: s.streak,
    quizzes_completed: s.quizzesCompleted,
    scenarios_completed: s.scenariosCompleted,
    modules_completed: s.modulesCompleted,
    tactics_saved: s.tacticsSaved,
    perfect_quizzes: s.perfectQuizzes,
    is_premium: s.isPremium,
    last_active_day: s.lastActiveDay,
    completed_module_ids: s.completedModuleIds,
  };
}

/**
 * Syncs the local game progress with Supabase when credentials are configured.
 * No-op in demo mode (getSupabase() returns null), so the app works offline.
 * Renders nothing.
 */
export function ProgressSync() {
  const { user } = useAuth();
  const loaded = useRef(false);

  // Pull on login (and seed a row if none exists).
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    let cancelled = false;
    loaded.current = false;

    (async () => {
      const { data } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        const row = data as ProgressRow;
        useGameStore.setState({
          xp: row.xp,
          level: row.level,
          streak: row.streak,
          quizzesCompleted: row.quizzes_completed,
          scenariosCompleted: row.scenarios_completed,
          modulesCompleted: row.modules_completed,
          tacticsSaved: row.tactics_saved,
          perfectQuizzes: row.perfect_quizzes,
          isPremium: row.is_premium,
          lastActiveDay: row.last_active_day,
          completedModuleIds: row.completed_module_ids ?? [],
        });
      } else {
        await supabase.from("progress").upsert(toRow(user, useGameStore.getState()));
      }
      loaded.current = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Push on change (debounced).
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsub = useGameStore.subscribe((state) => {
      if (!loaded.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        supabase
          .from("progress")
          .upsert(toRow(user, state))
          .then(() => {});
      }, 1500);
    });

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [user]);

  return null;
}
