import { moonPosition } from "./moon";
import { outerPlanetPosition } from "./outer-planets";
import { sunPosition } from "./sun";
import type { CelestialBody, EclipticPosition, EphemerisProvider } from "./types";

/**
 * The only concrete EphemerisProvider in this package right now. Every
 * calculator depends on the `EphemerisProvider` interface, not on this
 * class, sun.ts/moon.ts, or outer-planets.ts directly. Sun and Moon keep
 * their original hand-written low-precision series (tested, already
 * accepted); every other body is delegated to the astronomy-engine
 * library rather than hand-derived, since getting a planet's position
 * subtly wrong is a real correctness bug for an astrology product.
 */
export class MeeusEphemerisProvider implements EphemerisProvider {
  getPosition(body: CelestialBody, julianDay: number): EclipticPosition {
    switch (body) {
      case "sun":
        return sunPosition(julianDay);
      case "moon":
        return moonPosition(julianDay);
      default:
        return outerPlanetPosition(body, julianDay);
    }
  }
}
