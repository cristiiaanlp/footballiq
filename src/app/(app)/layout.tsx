"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { LevelUpCelebration } from "@/components/layout/LevelUpCelebration";
import { CheckoutReturn } from "@/components/layout/CheckoutReturn";
import { ProgressSync } from "@/services/progressSync";
import { FullScreenLoader } from "@/components/ui/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <FullScreenLoader label="Warming up…" />;
  if (!user) return <FullScreenLoader label="Redirecting…" />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <MobileNav />
      </div>
      <LevelUpCelebration />
      <ProgressSync />
      <CheckoutReturn />
    </div>
  );
}
