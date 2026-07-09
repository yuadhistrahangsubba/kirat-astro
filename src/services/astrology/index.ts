import type { BirthInput, ChartResult } from "./types";

export class AstrologyEngineNotConfiguredError extends Error {
  constructor() {
    super(
      "No sidereal ephemeris engine is wired up yet. Decide between a " +
        "Swiss Ephemeris binding (e.g. `swisseph`, self-hosted, most accurate) " +
        "and a hosted ephemeris API (faster to ship, per-request cost/latency) " +
        "before implementing this function.",
    );
    this.name = "AstrologyEngineNotConfiguredError";
  }
}

// Intentionally unimplemented — see AstrologyEngineNotConfiguredError.
// Everything calling this already depends only on BirthInput/ChartResult,
// so swapping in a real engine later requires no changes upstream.
export async function computeChart(input: BirthInput): Promise<ChartResult> {
  void input;
  throw new AstrologyEngineNotConfiguredError();
}
