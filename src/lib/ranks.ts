import type { Rank, Achievement } from "@/types";

/**
 * XP → level curve. Each level needs progressively more XP.
 * Level n requires cumulative XP = 50 * n * (n - 1).
 */
export function xpForLevel(level: number) {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number) {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

/** Progress within the current level, as { current, needed, pct }. */
export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const current = xp - floor;
  const needed = ceil - floor;
  return {
    level,
    current,
    needed,
    pct: Math.round((current / needed) * 100),
  };
}

export const RANKS: Rank[] = [
  { name: "Rookie Coach", minLevel: 1, badge: "🥾", accent: "#9CA3AF" },
  { name: "Assistant Coach", minLevel: 4, badge: "📋", accent: "#60A5FA" },
  { name: "Analyst", minLevel: 8, badge: "📊", accent: "#3B82F6" },
  { name: "Manager", minLevel: 14, badge: "🎯", accent: "#22C55E" },
  { name: "Elite Coach", minLevel: 22, badge: "🏆", accent: "#FACC15" },
  { name: "Tactical Master", minLevel: 32, badge: "🧠", accent: "#A855F7" },
];

export function rankForLevel(level: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) rank = r;
  return rank;
}

export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-steps",
    title: "First Whistle",
    description: "Complete your first quiz.",
    icon: "Flag",
    test: (s) => s.quizzesCompleted >= 1,
  },
  {
    id: "sharp-eye",
    title: "Sharp Eye",
    description: "Score 5 perfect quizzes.",
    icon: "Eye",
    test: (s) => s.perfectQuizzes >= 5,
  },
  {
    id: "tactician",
    title: "Tactician",
    description: "Save 3 tactics in the Lab.",
    icon: "PenTool",
    test: (s) => s.tacticsSaved >= 3,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Finish 3 academy modules.",
    icon: "GraduationCap",
    test: (s) => s.modulesCompleted >= 3,
  },
  {
    id: "on-fire",
    title: "On Fire",
    description: "Reach a 7-day streak.",
    icon: "Flame",
    test: (s) => s.streak >= 7,
  },
  {
    id: "decision-maker",
    title: "Decision Maker",
    description: "Solve 10 match scenarios.",
    icon: "GitBranch",
    test: (s) => s.scenariosCompleted >= 10,
  },
  {
    id: "manager-mind",
    title: "Manager Mind",
    description: "Reach the Manager rank.",
    icon: "Trophy",
    test: (s) => s.level >= 14,
  },
];
