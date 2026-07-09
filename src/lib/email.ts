import { Resend } from "resend";

// Server-only — never import this from a Client Component.
export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? "Astro Himalaya <notifications@astro-himalaya.com>";
