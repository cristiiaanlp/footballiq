import type { Formation, PlayerRole } from "@/types";

// Helper to build a position quickly.
const p = (x: number, y: number, role: PlayerRole, number: number) => ({
  pos: { x, y },
  role,
  number,
});

/**
 * Formations for the Formation Explorer + Tactic Lab presets.
 * Coordinates: home attacks UP. GK ~y92 (own goal), forwards ~y18.
 */
export const FORMATIONS: Formation[] = [
  {
    id: "433",
    name: "4-3-3",
    style: "Possession & wing play",
    difficulty: 2,
    bestFor: "Dominating possession and stretching defences wide.",
    strengths: [
      "Width from wingers stretches the back line",
      "Midfield triangle controls tempo",
      "Natural passing angles for build-up",
    ],
    weaknesses: [
      "Wingers must track back or full-backs get exposed",
      "Single pivot can be overrun",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(18, 74, "DEF", 2),
      p(38, 78, "DEF", 4),
      p(62, 78, "DEF", 5),
      p(82, 74, "DEF", 3),
      p(50, 60, "MID", 6),
      p(32, 48, "MID", 8),
      p(68, 48, "MID", 10),
      p(20, 28, "FWD", 7),
      p(50, 22, "FWD", 9),
      p(80, 28, "FWD", 11),
    ],
  },
  {
    id: "442",
    name: "4-4-2",
    style: "Balanced & compact",
    difficulty: 1,
    bestFor: "A solid, easy-to-organise shape with two banks of four.",
    strengths: [
      "Two compact banks of four are hard to break down",
      "Two strikers occupy centre-backs",
      "Simple, intuitive defensive responsibilities",
    ],
    weaknesses: [
      "Can be outnumbered in central midfield (2 v 3)",
      "Relies on wide midfielders for width and defence",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(18, 74, "DEF", 2),
      p(38, 78, "DEF", 4),
      p(62, 78, "DEF", 5),
      p(82, 74, "DEF", 3),
      p(18, 52, "MID", 7),
      p(40, 56, "MID", 6),
      p(60, 56, "MID", 8),
      p(82, 52, "MID", 11),
      p(40, 26, "FWD", 9),
      p(60, 26, "FWD", 10),
    ],
  },
  {
    id: "352",
    name: "3-5-2",
    style: "Wing-backs & central overload",
    difficulty: 3,
    bestFor: "Overloading midfield while wing-backs provide all the width.",
    strengths: [
      "Three central midfielders dominate the middle",
      "Wing-backs deliver width on both flanks",
      "Back three offers cover and spare man",
    ],
    weaknesses: [
      "Huge demand on wing-backs' stamina",
      "Vulnerable in wide areas if wing-backs are caught high",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(30, 78, "DEF", 4),
      p(50, 80, "DEF", 5),
      p(70, 78, "DEF", 6),
      p(12, 54, "MID", 2),
      p(36, 56, "MID", 8),
      p(50, 60, "MID", 7),
      p(64, 56, "MID", 10),
      p(88, 54, "MID", 3),
      p(40, 26, "FWD", 9),
      p(60, 26, "FWD", 11),
    ],
  },
  {
    id: "4231",
    name: "4-2-3-1",
    style: "Modern & flexible",
    difficulty: 2,
    bestFor: "Balancing defensive solidity with a creative attacking band.",
    strengths: [
      "Double pivot shields the defence",
      "Number 10 links midfield and attack",
      "Easy to switch between press and block",
    ],
    weaknesses: [
      "Lone striker can be isolated",
      "Gaps appear if the '10' doesn't track back",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(18, 74, "DEF", 2),
      p(38, 78, "DEF", 4),
      p(62, 78, "DEF", 5),
      p(82, 74, "DEF", 3),
      p(38, 60, "MID", 6),
      p(62, 60, "MID", 8),
      p(20, 40, "MID", 7),
      p(50, 40, "MID", 10),
      p(80, 40, "MID", 11),
      p(50, 22, "FWD", 9),
    ],
  },
  {
    id: "532",
    name: "5-3-2",
    style: "Defensive & counter",
    difficulty: 2,
    bestFor: "Defending deep and hitting fast on the counter-attack.",
    strengths: [
      "Five defenders make a very compact low block",
      "Two strikers give a counter-attacking outlet",
      "Wing-backs can spring forward in transition",
    ],
    weaknesses: [
      "Can invite too much pressure when too passive",
      "Limited width in settled attacking play",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(14, 76, "DEF", 2),
      p(33, 80, "DEF", 4),
      p(50, 82, "DEF", 5),
      p(67, 80, "DEF", 6),
      p(86, 76, "DEF", 3),
      p(32, 58, "MID", 8),
      p(50, 56, "MID", 7),
      p(68, 58, "MID", 10),
      p(40, 28, "FWD", 9),
      p(60, 28, "FWD", 11),
    ],
  },
  {
    id: "343",
    name: "3-4-3",
    style: "High press & attack",
    difficulty: 3,
    bestFor: "Aggressive, front-foot football with maximum attackers.",
    strengths: [
      "Front three pin the opposition back line",
      "Four midfielders provide width and central control",
      "Great for an intense high press",
    ],
    weaknesses: [
      "Only three at the back — exposed to fast breaks",
      "Demands disciplined, fit midfielders",
    ],
    positions: [
      p(50, 92, "GK", 1),
      p(30, 78, "DEF", 4),
      p(50, 80, "DEF", 5),
      p(70, 78, "DEF", 6),
      p(14, 54, "MID", 2),
      p(40, 56, "MID", 8),
      p(60, 56, "MID", 10),
      p(86, 54, "MID", 3),
      p(22, 26, "FWD", 7),
      p(50, 22, "FWD", 9),
      p(78, 26, "FWD", 11),
    ],
  },
];

export const FORMATION_MAP = Object.fromEntries(
  FORMATIONS.map((f) => [f.id, f])
) as Record<string, Formation>;
