"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-pitch" />,
  info: <Info className="h-5 w-5 text-sky-light" />,
  error: <XCircle className="h-5 w-5 text-danger" />,
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => dismiss(t.id)}
            className="glass-strong pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium shadow-glass"
          >
            {ICONS[t.type]}
            <span>{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
