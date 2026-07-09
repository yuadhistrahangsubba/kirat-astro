import Stripe from "stripe";

// Server-only — never import this from a Client Component.
// apiVersion intentionally omitted — defaults to the version pinned by the installed SDK.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});
