"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Brand } from "./Brand";
import { Icon } from "@/components/ui/Icon";
import { CoachStatus } from "./CoachStatus";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col gap-2 border-r border-white/5 bg-ink-900/60 p-4 backdrop-blur-xl lg:flex">
      <Brand href="/dashboard" size={38} className="mb-2 px-2 py-1" />

      <CoachStatus />

      <nav className="mt-2 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-pitch/15 text-pitch-light shadow-glow"
                  : "text-haze hover:bg-white/5 hover:text-chalk"
              )}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 pt-3">
        <div className="mb-2 px-2 text-xs text-muted">
          {user?.name} · {user?.email}
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
