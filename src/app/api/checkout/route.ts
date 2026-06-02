import { NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Creates a Stripe Checkout session for Football IQ Premium.
 * Returns { configured: false } when Stripe env vars are missing, so the
 * client can gracefully fall back to the local demo unlock.
 *
 * Required env: STRIPE_SECRET_KEY, STRIPE_PRICE_ID.
 * Optional:     STRIPE_MODE ("subscription" | "payment", default subscription).
 */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const price = process.env.STRIPE_PRICE_ID;

  if (!key || !price) {
    return NextResponse.json({ configured: false });
  }

  const mode = (process.env.STRIPE_MODE as "subscription" | "payment") ?? "subscription";
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const stripe = new Stripe(key);

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/profile?checkout=success`,
      cancel_url: `${origin}/profile?checkout=cancel`,
      allow_promotion_codes: true,
    });
    return NextResponse.json({ configured: true, url: session.url });
  } catch {
    return NextResponse.json(
      { configured: true, error: "checkout_failed" },
      { status: 500 }
    );
  }
}
