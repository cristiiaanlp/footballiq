"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { NAV_SECTIONS, type NavItem } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { Brand } from "./Brand";
import { CoachStatus } from "./CoachStatus";
import { NavBadge } from "./NavBadge";
import { useAuth } from "@/hooks/useAuth";
import { useNavBadges } from "@/hooks/useNavBadges";
import { playSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const badges = useNavBadges();

  const isActive = (item: NavItem) =>
    pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="absolute left-0 top-0 flex h-full w-[82%] max-w-xs flex-col gap-4 overflow-y-auto border-r border-white/10 bg-ink-900/95 p-4 backdrop-blur-2xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between">
              <Brand href="/dashboard" size={34} />
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-chalk"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CoachStatus />

            <nav className="flex flex-1 flex-col gap-4">
              {NAV_SECTIONS.map((section, i) => (
                <div key={i}>
                  {section.title && (
                    <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-muted/70">
                      {section.title}
                    </p>
                  )}
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const active = isActive(item);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            playSound("click");
                            onClose();
                          }}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                            active
                              ? "bg-pitch/15 text-pitch-light"
                              : "text-haze hover:bg-white/5"
                          )}
                        >
                          <Icon name={item.icon} className="h-5 w-5" />
                          <span className="flex-1">{item.label}</span>
                          <NavBadge item={item} badges={badges} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-white/5 pt-3">
              <div className="mb-2 px-2 text-xs text-muted">{user?.email}</div>
              <button
                onClick={signOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger/10 hover:text-danger"
              >
                <LogOut className="h-5 w-5" /> Cerrar sesión
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
