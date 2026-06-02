"use client";

import { useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useTacticsStore, type SavedTactic } from "@/stores/tacticsStore";

type Row = {
  id: string;
  user_id: string;
  name: string;
  formation: string;
  data: Omit<SavedTactic, "id" | "name" | "formation" | "createdAt" | "updatedAt">;
  created_at: string;
  updated_at: string;
};

function toRow(t: SavedTactic, userId: string): Row {
  return {
    id: t.id,
    user_id: userId,
    name: t.name,
    formation: t.formation,
    data: {
      showAway: t.showAway,
      players: t.players,
      arrows: t.arrows,
      frames: t.frames,
      ball: t.ball,
      homeColor: t.homeColor,
      awayColor: t.awayColor,
    },
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  };
}

function fromRow(r: Row): SavedTactic {
  return {
    id: r.id,
    name: r.name,
    formation: r.formation,
    showAway: r.data?.showAway ?? false,
    players: r.data?.players ?? [],
    arrows: r.data?.arrows ?? [],
    frames: r.data?.frames ?? [],
    ball: r.data?.ball,
    homeColor: r.data?.homeColor,
    awayColor: r.data?.awayColor,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Syncs saved tactics with Supabase when configured + logged in. No-op in demo
 * mode (tactics stay in localStorage). Renders nothing.
 */
export function TacticsSync() {
  const { user } = useAuth();
  const loaded = useRef(false);
  const applyingRemote = useRef(false);
  const prevIds = useRef<Set<string>>(new Set());

  // Pull on login + merge with local.
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    let cancelled = false;
    loaded.current = false;

    (async () => {
      const { data } = await supabase.from("tactics").select("*").eq("user_id", user.id);
      if (cancelled) return;

      const local = useTacticsStore.getState().tactics;
      const map = new Map<string, SavedTactic>();
      local.forEach((t) => map.set(t.id, t));
      (data as Row[] | null)?.forEach((r) => {
        const cloud = fromRow(r);
        const existing = map.get(cloud.id);
        if (!existing || cloud.updatedAt > existing.updatedAt) map.set(cloud.id, cloud);
      });
      const merged = Array.from(map.values()).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      );

      applyingRemote.current = true;
      useTacticsStore.setState({ tactics: merged });
      applyingRemote.current = false;
      prevIds.current = new Set(merged.map((t) => t.id));
      loaded.current = true;

      // Push any local-only tactics up to the cloud.
      if (merged.length) {
        supabase.from("tactics").upsert(merged.map((t) => toRow(t, user.id))).then(() => {});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Push local changes to the cloud (debounced).
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsub = useTacticsStore.subscribe((state) => {
      if (!loaded.current || applyingRemote.current) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const cur = state.tactics;
        const curIds = new Set(cur.map((t) => t.id));
        const removed = Array.from(prevIds.current).filter((id) => !curIds.has(id));
        if (cur.length) {
          supabase.from("tactics").upsert(cur.map((t) => toRow(t, user.id))).then(() => {});
        }
        if (removed.length) {
          supabase.from("tactics").delete().in("id", removed).then(() => {});
        }
        prevIds.current = curIds;
      }, 1200);
    });

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [user]);

  return null;
}
