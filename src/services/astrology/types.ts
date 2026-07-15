// The typed seam between validated user input and the calculation engine.
// Everything upstream (forms, API routes) should depend on these types,
// not on any individual calculator's internals.

import type { WesternSignPlacement } from "./western/zodiac-sign";
import type { ZodiacPlacement } from "./constants";
import type { BoundaryConfidenceResult } from "./confidence";
import type { HouseCusps } from "./astronomy/houses";
import type { AntardashaPeriod, MahadashaPeriod } from "./vedic/dasha";
import type { ClassicalGraha } from "./vedic/dignity";
import type { KalsarpaResult, ManglikResult } from "./vedic/doshas";
import type { MoonPhaseResult } from "./moon-phase";
import type { NakshatraPlacement } from "./vedic/nakshatra";
import type { PanchangResult } from "./vedic/panchang";
import type { RashiPlacement } from "./vedic/rashi";
import type { SadesatiPeriod } from "./vedic/sadesati";
import type { BasicShadbalaResult } from "./vedic/shadbala";

export interface BirthInput {
  birthDate: string; // ISO date, e.g. "1998-04-12"
  birthTime?: string; // "HH:mm", 24-hour, local to `timezone`. Omitted = unknown birth time.
  timezone: string; // IANA tz, e.g. "Asia/Thimphu"
  latitude: number;
  longitude: number;
}

export interface BodyPlacement {
  tropicalLongitude: number;
  siderealLongitude: number;
  rashi: RashiPlacement;
  nakshatra: NakshatraPlacement;
  westernSign: WesternSignPlacement;
  /** 1-12, whole-sign Vedic house from the Ascendant. Only present when `timeConfidence` is "exact". */
  house?: number;
}

export interface AscendantPlacement {
  tropicalLongitude: number;
  siderealLongitude: number;
  rashi: RashiPlacement;
  nakshatra: NakshatraPlacement;
  westernSign: WesternSignPlacement;
}

/** The 9 classical grahas — the set every Dasha, Navamsa, and lord lookup in this package uses. */
export interface Grahas<T> {
  sun: T;
  moon: T;
  mars: T;
  mercury: T;
  jupiter: T;
  venus: T;
  saturn: T;
  rahu: T;
  ketu: T;
}

export interface DashaBalance {
  years: number;
  months: number;
  days: number;
}

export interface MahadashaWithAntardasha extends MahadashaPeriod {
  antardasha: AntardashaPeriod[];
}

export interface ChartResult {
  julianDayUtc: number;
  ayanamsaDegrees: number;
  /** Human-readable label for `ayanamsaDegrees` — this engine only implements Lahiri today. */
  ayanamsaName: string;
  /** Local sidereal time at birth, in degrees — only present when `timeConfidence` is "exact" (needs longitude + exact time). */
  siderealTimeDegrees?: number;
  /**
   * "exact" when a birth time was given; "date-only" when it wasn't and
   * local noon was used as a placeholder — in that case `ascendant` and
   * `houses` are omitted entirely rather than returning a value that
   * would just be wrong (the Ascendant moves about 1 degree every 4
   * minutes, so a whole day's uncertainty makes it meaningless).
   */
  timeConfidence: "exact" | "date-only";
  sun: BodyPlacement;
  moon: BodyPlacement;
  mars: BodyPlacement;
  mercury: BodyPlacement;
  jupiter: BodyPlacement;
  venus: BodyPlacement;
  saturn: BodyPlacement;
  rahu: BodyPlacement;
  ketu: BodyPlacement;
  /** Uranus/Neptune/Pluto — computed for completeness; not part of the classical 9-graha Dasha/Navamsa/lord system used elsewhere in this chart. */
  uranus: BodyPlacement;
  neptune: BodyPlacement;
  pluto: BodyPlacement;
  ascendant?: AscendantPlacement;
  houses?: {
    western: HouseCusps; // equal house, tropical ascendant
    vedic: HouseCusps; // whole sign, sidereal ascendant
  };
  /**
   * Navamsa (D9) sign for each graha, Uranus/Neptune/Pluto, and the
   * Navamsa Ascendant when the birth time is exact. Unlike Dasha/lord
   * lookups, the Navamsa division is pure longitude-to-sign geometry
   * with no dependence on the classical 9-graha system, so the outer
   * planets are included here (matching AstroSage's own Navamsa chart).
   */
  navamsa: Grahas<ZodiacPlacement> & { uranus: ZodiacPlacement; neptune: ZodiacPlacement; pluto: ZodiacPlacement; ascendant?: ZodiacPlacement };
  panchang: PanchangResult;
  vimshottariDasha: MahadashaWithAntardasha[];
  /** Remaining balance of the birth (first) Mahadasha, as it's conventionally reported — Y/M/D. */
  dashaBalanceAtBirth: DashaBalance;
  /** How close the Moon sits to a nakshatra-pada boundary — see confidence.ts's doc comment for why this specifically is flagged. */
  dashaConfidence: BoundaryConfidenceResult;
  moonPhase: MoonPhaseResult;
  sunrise?: Date;
  sunset?: Date;
  manglikDosha: ManglikResult;
  kalsarpaDosha: KalsarpaResult;
  /** The birth-anchored Saturn transit timeline, ~100 years forward from birth. */
  sadesatiPeriods: SadesatiPeriod[];
  /** A deliberately partial (3-of-6) Shadbala per classical graha — see shadbala.ts's doc comment for scope. */
  basicShadbala: Record<ClassicalGraha, BasicShadbalaResult>;
}
