"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MOBILE_NAV } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {MOBILE_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const isLab = item.href === "/tactic-lab";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              {isLab ? (
                <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-pitch text-ink-900 shadow-glow">
                  <Icon name={item.icon} className="h-6 w-6" />
                </span>
              ) : (
                <Icon
                  name={item.icon}
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-pitch" : "text-muted"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active ? "text-pitch" : "text-muted"
                )}
              >
                {item.short}
              </span>
              {active && !isLab && (
                <motion.span
                  layoutId="mobile-active"
                  className="absolute -top-px h-0.5 w-8 rounded-full bg-pitch"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
