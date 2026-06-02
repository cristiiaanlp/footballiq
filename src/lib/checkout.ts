"use client";

/**
 * Kicks off Stripe Checkout. If Stripe isn't configured on the server, returns
 * { configured: false } so the caller can fall back to the demo unlock.
 */
export async function startCheckout(): Promise<{ configured: boolean }> {
  try {
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = (await res.json()) as { configured?: boolean; url?: string };
    if (data.configured && data.url) {
      window.location.href = data.url;
      return { configured: true };
    }
    return { configured: false };
  } catch {
    return { configured: false };
  }
}

/**
 * Upgrade flow: try real Stripe Checkout; if not configured, run the provided
 * demo activation (flips the local premium flag).
 */
export async function upgradeToPremium(demoActivate: () => void) {
  const { configured } = await startCheckout();
  if (!configured) demoActivate();
}
