"use client";

import { MotionConfig } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { useSettingsStore } from "@/stores/settingsStore";
import { Toaster } from "@/components/ui/Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  return (
    <MotionConfig reducedMotion={reducedMotion ? "always" : "user"}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </MotionConfig>
  );
}
