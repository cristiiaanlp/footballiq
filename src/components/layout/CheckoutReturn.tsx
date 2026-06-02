"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { playSound } from "@/lib/sound";

/**
 * Detects the `?checkout=success` redirect from Stripe and unlocks Premium.
 * (In a full production setup a webhook would persist this server-side; here we
 * also flip the local flag so the UX completes.) Cleans the URL afterwards.
 */
export function CheckoutReturn() {
  const setPremium = useGameStore((s) => s.setPremium);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setPremium(true);
      playSound("levelup");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [setPremium]);

  return null;
}
