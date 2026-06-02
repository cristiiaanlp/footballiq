export interface NavItem {
  href: string;
  label: string;
  icon: string; // lucide icon name
  short: string; // mobile label
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "LayoutDashboard", short: "Home" },
  { href: "/tactic-lab", label: "Tactic Lab", icon: "PenTool", short: "Lab" },
  { href: "/my-tactics", label: "Mis tácticas", icon: "Library", short: "Tácticas" },
  { href: "/quizzes", label: "Quizzes", icon: "Brain", short: "Quiz" },
  { href: "/scenarios", label: "Scenarios", icon: "GitBranch", short: "Scenes" },
  { href: "/academy", label: "Academy", icon: "GraduationCap", short: "Learn" },
  { href: "/daily", label: "Daily", icon: "Flame", short: "Daily" },
  { href: "/formations", label: "Formations", icon: "LayoutGrid", short: "Forms" },
  { href: "/profile", label: "Profile", icon: "User", short: "Me" },
];

/** Items shown in the mobile bottom bar (max 5 for thumb reach). */
export const MOBILE_NAV: NavItem[] = [
  NAV_ITEMS[0], // Home
  NAV_ITEMS[2], // Quizzes
  NAV_ITEMS[1], // Tactic Lab
  NAV_ITEMS[5], // Daily
  NAV_ITEMS[7], // Profile
];
