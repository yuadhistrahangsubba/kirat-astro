import { normalizeDegrees } from "../astronomy/angles";
import { toJulianDay } from "../astronomy/julian-date";
import { lahiriAyanamsa } from "../ayanamsa/lahiri";
import { engineBodyPosition } from "../ephemeris/engine-bodies";

export type SadesatiPhase = "rising" | "peak" | "setting" | "dhaiya-4th" | "dhaiya-8th";

export interface SadesatiPeriod {
  phase: SadesatiPhase;
  /** The sidereal sign (0=Aries..11=Pisces) Saturn is transiting during this period — the "Shani Rashi" of a classical Sadesati table. */
  shaniRashiSignIndex: number;
  startDate: Date;
  endDate: Date;
  system: "Parashari";
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
// Saturn's fastest daily motion (direct or retrograde) is a couple of
// arcminutes — a fraction of a degree — so a 5-day step can never skip
// past an entire 30-degree sign in one hop, which is what lets the
// crossing-refinement below assume exactly one boundary per step.
const SCAN_STEP_DAYS = 5;
const BISECTION_ITERATIONS = 20;

function saturnSiderealLongitude(date: Date): number {
  const jd = toJulianDay(date);
  const tropicalLongitude = engineBodyPosition("saturn", jd).longitudeDegrees;
  return normalizeDegrees(tropicalLongitude - lahiriAyanamsa(jd));
}

function signIndexAt(date: Date): number {
  return Math.floor(saturnSiderealLongitude(date) / 30);
}

/** Which classical phase (if any) transiting Saturn's sign represents, given how many signs forward it sits from the natal Moon's sign (0 = Moon's own sign). */
function phaseForOffsetFromMoon(offset: number): SadesatiPhase | null {
  switch (offset) {
    case 11:
      return "rising"; // 12th from Moon
    case 0:
      return "peak"; // 1st from Moon (transiting the Moon's own natal sign)
    case 1:
      return "setting"; // 2nd from Moon
    case 3:
      return "dhaiya-4th"; // 4th from Moon — the lesser "Small Panoti"/Kantak Shani
    case 7:
      return "dhaiya-8th"; // 8th from Moon — the lesser "Small Panoti"/Ashtama Shani
    default:
      return null;
  }
}

/** Bisects between two dates known to straddle a Saturn sign-boundary crossing, returning the (approximate, to well under a day) date the new sign began. */
function refineCrossing(beforeDate: Date, afterDate: Date, beforeSign: number): Date {
  let lo = beforeDate.getTime();
  let hi = afterDate.getTime();

  for (let i = 0; i < BISECTION_ITERATIONS; i++) {
    const midTime = (lo + hi) / 2;
    const midSign = signIndexAt(new Date(midTime));
    if (midSign === beforeSign) lo = midTime;
    else hi = midTime;
  }

  return new Date(hi);
}

/**
 * Every Sadesati/Panoti period (the birth-anchored, multi-decade Saturn
 * transit timeline classical software reports as a life-long table) from
 * `from` across the next `yearsAhead` years. Scans Saturn's sidereal
 * longitude at a fixed step and refines each sign-boundary crossing by
 * bisection — this naturally reproduces the real retrograde-driven
 * back-and-forth (Saturn dipping back into the previous sign for a
 * stretch before resuming direct motion), which is why a birth's table
 * can show the same "Shani Rashi" more than once in a row rather than
 * one clean period per phase.
 */
export function findSadesatiPeriods(natalMoonSignIndex: number, from: Date, yearsAhead = 100): SadesatiPeriod[] {
  const totalDays = yearsAhead * 365.2425;
  const periods: SadesatiPeriod[] = [];

  let previousDate = from;
  let previousSign = signIndexAt(from);
  let openPeriod: { phase: SadesatiPhase; signIndex: number; startDate: Date } | null = null;

  const initialPhase = phaseForOffsetFromMoon((previousSign - natalMoonSignIndex + 12) % 12);
  if (initialPhase) openPeriod = { phase: initialPhase, signIndex: previousSign, startDate: from };

  for (let day = SCAN_STEP_DAYS; day <= totalDays; day += SCAN_STEP_DAYS) {
    const date = new Date(from.getTime() + day * MS_PER_DAY);
    const currentSign = signIndexAt(date);

    if (currentSign !== previousSign) {
      const crossingDate = refineCrossing(previousDate, date, previousSign);

      if (openPeriod) {
        periods.push({
          phase: openPeriod.phase,
          shaniRashiSignIndex: openPeriod.signIndex,
          startDate: openPeriod.startDate,
          endDate: crossingDate,
          system: "Parashari",
        });
        openPeriod = null;
      }

      const phase = phaseForOffsetFromMoon((currentSign - natalMoonSignIndex + 12) % 12);
      if (phase) openPeriod = { phase, signIndex: currentSign, startDate: crossingDate };

      previousSign = currentSign;
    }

    previousDate = date;
  }

  if (openPeriod) {
    periods.push({
      phase: openPeriod.phase,
      shaniRashiSignIndex: openPeriod.signIndex,
      startDate: openPeriod.startDate,
      endDate: previousDate,
      system: "Parashari",
    });
  }

  return periods;
}

/** The Sadesati/Panoti period covering a given moment, if any. */
export function findSadesatiPeriodAt(periods: readonly SadesatiPeriod[], at: Date): SadesatiPeriod | undefined {
  return periods.find((period) => at >= period.startDate && at < period.endDate);
}
