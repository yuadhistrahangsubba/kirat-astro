import { engineBodyPosition } from "./engine-bodies";
import { sunPosition } from "./sun";
import type { CelestialBody, EclipticPosition, EphemerisProvider } from "./types";

/**
 * The only concrete EphemerisProvider in this package right now. Every
 * calculator depends on the `EphemerisProvider` interface, not on this
 * class or sun.ts/engine-bodies.ts directly. Sun keeps its original
 * hand-written low-precision series (tested, already accepted, and
 * accurate to ~0.01° — plenty for a Sun sign/house placement); every
 * other body, including the Moon, is delegated to the astronomy-engine
 * library rather than hand-derived, since getting a planet's position
 * subtly wrong is a real correctness bug for an astrology product.
 */
export class MeeusEphemerisProvider implements EphemerisProvider {
  getPosition(body: CelestialBody, julianDay: number): EclipticPosition {
    if (body === "sun") return sunPosition(julianDay);
    return engineBodyPosition(body, julianDay);
  }
}
