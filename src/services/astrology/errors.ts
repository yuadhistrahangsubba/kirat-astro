/**
 * Thrown for any body the ephemeris layer genuinely doesn't have a
 * position source for. In practice every `CelestialBody` this package
 * knows about today is covered — Sun via a documented Meeus series
 * (ephemeris/sun.ts), everything else including the Moon via
 * astronomy-engine (ephemeris/engine-bodies.ts) — so this is a guard
 * for a future new body added to the `CelestialBody` type without a
 * matching case in `engine-bodies.ts`'s `BODY_MAP`, not a currently
 * reachable state. Kept so that future gap gets a clear signal instead
 * of a silently wrong position.
 */
export class PlanetNotSupportedError extends Error {
  constructor(body: string) {
    super(
      `No ephemeris implementation for "${body}" yet. Sun is implemented ` +
        "via a documented low-precision series (Meeus); every other body " +
        "is expected to go through astronomy-engine — add it to " +
        "engine-bodies.ts's BODY_MAP.",
    );
    this.name = "PlanetNotSupportedError";
  }
}

/**
 * Thrown by a calculation system that has a defined module and typed
 * inputs/outputs, but whose actual rule set isn't implemented yet
 * because it depends on domain knowledge or reference data this
 * codebase doesn't have verified — e.g. the Tibetan lunisolar calendar
 * conversion needed for Bhutanese/Tibetan astrology. Never substitute
 * a plausible-looking guess for these; throw this instead.
 */
export class CalculationNotImplementedError extends Error {
  constructor(system: string, requirement: string) {
    super(`${system} is not implemented yet: ${requirement}`);
    this.name = "CalculationNotImplementedError";
  }
}
