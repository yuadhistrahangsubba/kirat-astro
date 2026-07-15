import type { DashaPlanet } from "./dasha";

/**
 * Which additional houses (beyond the universal 7th) a planet casts a
 * special Vedic aspect (graha drishti) on, counted forward from its own
 * house. Every graha aspects its 7th house; Mars/Jupiter/Saturn
 * additionally cast the aspects below — the one set of special aspects
 * universally agreed across Parashari sources. Rahu/Ketu's special-aspect
 * claims are contested across traditions (some texts give them
 * Saturn-like or Mars-like casts); left at the universal 7th-only rather
 * than guessing, matching this codebase's "don't fake contested classical
 * points" convention (see errors.ts).
 */
const SPECIAL_ASPECT_OFFSETS: Partial<Record<DashaPlanet, readonly number[]>> = {
  Mars: [4, 8],
  Jupiter: [5, 9],
  Saturn: [3, 10],
};

const UNIVERSAL_ASPECT_OFFSET = 7;

function wrapHouse(house: number): number {
  const wrapped = house % 12;
  return wrapped <= 0 ? wrapped + 12 : wrapped;
}

/** Every house (1-12) `planet` casts a graha-drishti aspect on, given the whole-sign house it itself occupies. */
export function housesAspectedBy(planet: DashaPlanet, ownHouse: number): number[] {
  const offsets = [UNIVERSAL_ASPECT_OFFSET, ...(SPECIAL_ASPECT_OFFSETS[planet] ?? [])];
  return offsets.map((offset) => wrapHouse(ownHouse + offset - 1));
}

export interface NatalAspect {
  from: DashaPlanet;
  toHouse: number;
}

/**
 * Every graha-drishti aspect cast by any placed graha, from a map of
 * planet -> whole-sign house (typically every body in a ChartResult that
 * has a `.house`, i.e. only when `timeConfidence` is "exact"). This is
 * the Vedic house-counting aspect model — distinct from the Western
 * degree-and-orb aspects in transits/index.ts, which measure angular
 * separation rather than house position and serve a different purpose
 * (transit timing, not natal "who aspects this house" narrative).
 */
export function calculateNatalAspects(grahaHouses: Partial<Record<DashaPlanet, number>>): NatalAspect[] {
  const aspects: NatalAspect[] = [];
  for (const [planet, house] of Object.entries(grahaHouses) as [DashaPlanet, number | undefined][]) {
    if (house === undefined) continue;
    for (const toHouse of housesAspectedBy(planet, house)) {
      aspects.push({ from: planet, toHouse });
    }
  }
  return aspects;
}

/** Every planet aspecting a given house, per a set of aspects already computed by `calculateNatalAspects`. */
export function planetsAspecting(aspects: readonly NatalAspect[], house: number): DashaPlanet[] {
  return aspects.filter((aspect) => aspect.toHouse === house).map((aspect) => aspect.from);
}
