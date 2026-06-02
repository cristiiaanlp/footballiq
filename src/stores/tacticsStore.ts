"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Arrow, PlayerToken, Vec2 } from "@/types";

/** One captured keyframe of a play: where each player (by id) sits + the ball. */
export interface TacticFrame {
  positions: Record<string, Vec2>;
  ball?: Vec2;
}

export interface SavedTactic {
  id: string;
  name: string;
  formation: string;
  showAway: boolean;
  players: PlayerToken[];
  arrows: Arrow[];
  frames: TacticFrame[];
  ball?: Vec2;
  homeColor?: string;
  awayColor?: string;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TacticDraft = Omit<SavedTactic, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `t-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

interface TacticsState {
  tactics: SavedTactic[];
  /** Create (no id) or update (existing id). Returns the tactic id. */
  upsert: (draft: TacticDraft) => string;
  remove: (id: string) => void;
  rename: (id: string, name: string) => void;
  setPublic: (id: string, value: boolean) => void;
  get: (id: string) => SavedTactic | undefined;
}

export const useTacticsStore = create<TacticsState>()(
  persist(
    (set, get) => ({
      tactics: [],

      upsert: (draft) => {
        const now = new Date().toISOString();
        const existing = draft.id
          ? get().tactics.find((t) => t.id === draft.id)
          : undefined;

        if (existing) {
          const updated: SavedTactic = {
            ...existing,
            ...draft,
            id: existing.id,
            createdAt: existing.createdAt,
            updatedAt: now,
          };
          set((s) => ({
            tactics: s.tactics.map((t) => (t.id === existing.id ? updated : t)),
          }));
          return existing.id;
        }

        const id = newId();
        const created: SavedTactic = {
          ...draft,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ tactics: [created, ...s.tactics] }));
        return id;
      },

      remove: (id) =>
        set((s) => ({ tactics: s.tactics.filter((t) => t.id !== id) })),

      rename: (id, name) =>
        set((s) => ({
          tactics: s.tactics.map((t) =>
            t.id === id ? { ...t, name, updatedAt: new Date().toISOString() } : t
          ),
        })),

      setPublic: (id, value) =>
        set((s) => ({
          tactics: s.tactics.map((t) =>
            t.id === id
              ? { ...t, isPublic: value, updatedAt: new Date().toISOString() }
              : t
          ),
        })),

      get: (id) => get().tactics.find((t) => t.id === id),
    }),
    { name: "football-iq-tactics-v2" }
  )
);
