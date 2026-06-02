"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  soundEnabled: boolean;
  reducedMotion: boolean;
  avatar: string; // emoji
  toggleSound: () => void;
  setSound: (v: boolean) => void;
  toggleReducedMotion: () => void;
  setAvatar: (a: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      reducedMotion: false,
      avatar: "⚽",
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSound: (v) => set({ soundEnabled: v }),
      toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
      setAvatar: (a) => set({ avatar: a }),
    }),
    { name: "football-iq-settings" }
  )
);
