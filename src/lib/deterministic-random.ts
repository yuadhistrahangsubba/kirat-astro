/**
 * Deterministic pseudo-random in [0, 1), seeded by index. Used for
 * scattering decorative elements (stars, particles) — plain Math.random()
 * would render differently on the server than on the client and trigger a
 * hydration mismatch.
 *
 * Rounded to 6 decimal places: Math.sin isn't guaranteed bit-identical
 * across JS engines (Node's V8 on the server vs. the browser's V8 on the
 * client can differ in the last couple of bits), which on its own is
 * enough to fail React's hydration string comparison. Rounding clears
 * that noise floor.
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return round(x - Math.floor(x));
}

export function seededRange(seed: number, min: number, max: number): number {
  return round(min + seededRandom(seed) * (max - min));
}

export function round(value: number, decimals = 6): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
