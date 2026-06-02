export interface NavItem {
  href: string;
  label: string;
  icon: string; // lucide icon name
  short: string; // mobile label
  /** Dynamic indicator to render next to the item. */
  badge?: "daily" | "review";
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Inicio", icon: "LayoutDashboard", short: "Inicio" },
  { href: "/tactic-lab", label: "Tactic Lab", icon: "PenTool", short: "Lab" },
  { href: "/my-tactics", label: "Mis tácticas", icon: "Library", short: "Tácticas" },
  { href: "/quizzes", label: "Quizzes", icon: "Brain", short: "Quiz", badge: "review" },
  { href: "/scenarios", label: "Escenarios", icon: "GitBranch", short: "Escenas" },
  { href: "/academy", label: "Academia", icon: "GraduationCap", short: "Aprende" },
  { href: "/daily", label: "Reto diario", icon: "Flame", short: "Diario", badge: "daily" },
  { href: "/formations", label: "Formaciones", icon: "LayoutGrid", short: "Formac." },
  { href: "/profile", label: "Perfil", icon: "User", short: "Tú" },
];

const byHref = Object.fromEntries(NAV_ITEMS.map((i) => [i.href, i]));

/** Grouped sections for the sidebar + mobile drawer. */
export const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  { title: "", items: [byHref["/dashboard"]] },
  {
    title: "Entrena",
    items: [byHref["/tactic-lab"], byHref["/my-tactics"], byHref["/formations"]],
  },
  {
    title: "Juega",
    items: [byHref["/quizzes"], byHref["/scenarios"], byHref["/daily"]],
  },
  { title: "Aprende", items: [byHref["/academy"]] },
  { title: "Tú", items: [byHref["/profile"]] },
];

/** Items shown in the mobile bottom bar (Tactic Lab is the center FAB). */
export const MOBILE_NAV: NavItem[] = [
  byHref["/dashboard"],
  byHref["/quizzes"],
  byHref["/tactic-lab"],
  byHref["/daily"],
  byHref["/profile"],
];
