import type { NavItem } from "@/lib/nav";

/** Renders the dynamic indicator for a nav item (review count or daily dot). */
export function NavBadge({
  item,
  badges,
}: {
  item: NavItem;
  badges: { dueCount: number; dailyDue: boolean };
}) {
  if (item.badge === "review" && badges.dueCount > 0) {
    return (
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky px-1.5 text-[10px] font-bold text-white">
        {badges.dueCount}
      </span>
    );
  }
  if (item.badge === "daily" && badges.dailyDue) {
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold" />
      </span>
    );
  }
  return null;
}
