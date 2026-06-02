// ── Core domain types for Football IQ ──────────────────────────────

export type Vec2 = { x: number; y: number };

export type PlayerRole =
  | "GK"
  | "DEF"
  | "MID"
  | "FWD";

export interface PlayerToken {
  id: string;
  /** Position in percentage of the pitch (0-100 on both axes). */
  pos: Vec2;
  number: number;
  label?: string;
  role: PlayerRole;
  team: "home" | "away";
}

export interface Arrow {
  id: string;
  from: Vec2;
  to: Vec2;
  /** "pass" = solid, "run" = dashed, "dribble" = wavy (rendered as dashed). */
  kind: "pass" | "run" | "dribble";
  color: string;
}

export interface Formation {
  id: string;
  name: string;
  /** Home-team positions in pitch percentage (attacking upward). */
  positions: { pos: Vec2; role: PlayerRole; number: number }[];
  style: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  difficulty: 1 | 2 | 3;
}

// ── Learning content ───────────────────────────────────────────────

export type AnswerOption = {
  id: string;
  text: string;
  correct: boolean;
  /** Shown after answering — the "why". */
  feedback: string;
};

export interface Quiz {
  id: string;
  category: QuizCategory;
  difficulty: 1 | 2 | 3;
  prompt: string;
  /** Optional pitch snapshot to render with the question. */
  scene?: SceneSnapshot;
  options: AnswerOption[];
  xp: number;
}

export type QuizCategory =
  | "pressing"
  | "possession"
  | "spaces"
  | "covering"
  | "passing-lines"
  | "build-up"
  | "defending"
  | "transitions";

export interface SceneSnapshot {
  players: Pick<PlayerToken, "pos" | "number" | "role" | "team">[];
  ball?: Vec2;
  /** Highlighted zones drawn as soft rectangles (percent coords). */
  highlights?: { pos: Vec2; w: number; h: number; color: string }[];
}

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  scene: SceneSnapshot;
  question: string;
  options: AnswerOption[];
  xp: number;
}

export interface AcademyLesson {
  id: string;
  title: string;
  summary: string;
  /** Animated keyframes for the pitch demo (list of player snapshots). */
  frames: SceneSnapshot[];
  keyPoints: string[];
  xp: number;
}

export interface AcademyExamQuestion {
  id: string;
  prompt: string;
  options: AnswerOption[];
  xp: number;
}

export interface AcademyModule {
  slug: string;
  title: string;
  concept: string;
  icon: string; // lucide icon name
  accent: "pitch" | "sky" | "gold" | "danger";
  premium: boolean;
  lessons: AcademyLesson[];
  /** Short exam shown after the lessons to close the learn→test loop. */
  exam: AcademyExamQuestion[];
}

// ── Gamification ───────────────────────────────────────────────────

export interface Rank {
  name: string;
  minLevel: number;
  badge: string; // emoji / glyph
  accent: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Predicate evaluated against game state. */
  test: (s: GameSnapshot) => boolean;
}

export interface GameSnapshot {
  xp: number;
  level: number;
  streak: number;
  quizzesCompleted: number;
  scenariosCompleted: number;
  modulesCompleted: number;
  tacticsSaved: number;
  perfectQuizzes: number;
}
