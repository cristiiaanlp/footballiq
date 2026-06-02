"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
  setSound: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSound: (v) => set({ soundEnabled: v }),
    }),
    { name: "football-iq-settings" }
  )
);
