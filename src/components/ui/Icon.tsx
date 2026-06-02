import {
  ArrowUpFromLine,
  BarChart3,
  BookOpen,
  Brain,
  Eye,
  Flag,
  Flame,
  GitBranch,
  GraduationCap,
  Layers,
  Library,
  LayoutDashboard,
  LayoutGrid,
  Maximize,
  PenTool,
  Repeat,
  Shield,
  ShieldCheck,
  Settings,
  Shuffle,
  Spline,
  Swords,
  Trophy,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Named icon registry so data files can reference icons by string. */
const REGISTRY: Record<string, LucideIcon> = {
  ArrowUpFromLine,
  BarChart3,
  BookOpen,
  Brain,
  Eye,
  Flag,
  Flame,
  GitBranch,
  GraduationCap,
  Layers,
  Library,
  LayoutDashboard,
  LayoutGrid,
  Maximize,
  PenTool,
  Repeat,
  Shield,
  ShieldCheck,
  Settings,
  Shuffle,
  Spline,
  Swords,
  Trophy,
  User,
  Zap,
};

export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = REGISTRY[name] ?? Zap;
  return <Cmp className={className} />;
}
