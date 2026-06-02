"use client";

import { useSettingsStore } from "@/stores/settingsStore";

/**
 * Lightweight synthesized sound effects via the Web Audio API — no audio files
 * needed. Respects the user's sound toggle. Safe to call on the server (no-op).
 */

type SoundName = "correct" | "wrong" | "click" | "levelup" | "save" | "whistle";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.18
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + duration + 0.02);
}

const RECIPES: Record<SoundName, (c: AudioContext) => void> = {
  correct: (c) => {
    tone(c, 587.33, 0, 0.12, "triangle"); // D5
    tone(c, 880, 0.1, 0.18, "triangle"); // A5
  },
  wrong: (c) => {
    tone(c, 196, 0, 0.18, "sawtooth", 0.12); // G3
    tone(c, 146.83, 0.12, 0.22, "sawtooth", 0.12); // D3
  },
  click: (c) => tone(c, 440, 0, 0.05, "square", 0.08),
  save: (c) => {
    tone(c, 523.25, 0, 0.1, "sine");
    tone(c, 783.99, 0.08, 0.14, "sine");
  },
  whistle: (c) => tone(c, 2200, 0, 0.18, "triangle", 0.1),
  levelup: (c) => {
    tone(c, 523.25, 0, 0.12, "triangle"); // C5
    tone(c, 659.25, 0.12, 0.12, "triangle"); // E5
    tone(c, 783.99, 0.24, 0.12, "triangle"); // G5
    tone(c, 1046.5, 0.36, 0.26, "triangle"); // C6
  },
};

export function playSound(name: SoundName) {
  if (!useSettingsStore.getState().soundEnabled) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  try {
    RECIPES[name](c);
  } catch {
    /* ignore audio errors */
  }
}
