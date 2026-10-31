"use server";

import { computeChart, type BirthInput, type ChartResult } from "@/services/astrology";

import { birthInputSchema } from "./schema";

export type ComputeChartOutcome = { ok: true; result: ChartResult } | { ok: false; message: string };

/**
 * Server-side twin of `computeChart` — runs the engine on the server instead
 * of the visitor's device. Server Actions are public POST endpoints, so the
 * input is re-validated here rather than trusting the client form. Internal
 * error text is logged, never returned: it can leak implementation details.
 */
export async function computeChartAction(input: BirthInput): Promise<ComputeChartOutcome> {
  const parsed = birthInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Some birth details look invalid — please check the date, time and place." };
  }

  try {
    return { ok: true, result: computeChart(parsed.data) };
  } catch (err) {
    console.error("computeChartAction failed", err instanceof Error ? err.message : err);
    return { ok: false, message: "We couldn't calculate this chart. Please try again." };
  }
}
