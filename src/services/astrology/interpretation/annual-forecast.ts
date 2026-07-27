import { calculateAntardasha, type AntardashaPeriod, type DashaPlanet } from "../vedic/dasha";
import type { SadesatiPhase } from "../vedic/sadesati";
import type { ChartResult } from "../types";

import { PLANET_HOUSE_PREDICTION } from "./planet-house-predictions";

export interface AnnualForecastSegment {
  antardasha: DashaPlanet;
  /** Pre-formatted, e.g. "Jul 2026 – Nov 2026" — clipped to the forecast window. */
  rangeLabel: string;
  /**
   * Ordinal of the natal house the sub-period's planet occupies, e.g. "3rd" —
   * the personal grounding that turns a generic planet theme into "this planet,
   * where it sits in *your* chart". Null when the birth time is date-only and
   * houses can't be computed.
   */
  houseLabel: string | null;
  theme: string;
  /** True for the sub-period covering the largest share of the window. */
  dominant: boolean;
  /** Finer Pratyantardasha (sub-sub-period) breakdown within this Antardasha, clipped to the window — the "show month-by-month" detail. */
  detail: AnnualForecastPratyantar[];
}

export interface AnnualForecastPratyantar {
  planet: DashaPlanet;
  /** Pre-formatted, e.g. "Aug 2026 – Oct 2026". */
  rangeLabel: string;
  /** Ordinal of the natal house this planet occupies, or null when the birth time is date-only. */
  houseLabel: string | null;
  /** A short focus phrase for the period — timing granularity without repeating the parent's full paragraph. */
  focus: string;
}

export interface AnnualForecast {
  /** Pre-formatted 12-month window, e.g. "July 2026 – July 2027". */
  windowLabel: string;
  mahadasha: DashaPlanet;
  summary: string;
  segments: AnnualForecastSegment[];
  sadesatiNote: string | null;
  guidance: string;
}

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

// Dasha/Sadesati boundary dates are UTC calendar arithmetic (see dasha.ts),
// so read their month/year from the UTC fields to match how the Dasha table
// renders them elsewhere in the report.
function monthYearLong(date: Date): string {
  return `${MONTHS_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function monthYearShort(date: Date): string {
  return `${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Maps a Dasha planet name to its key on ChartResult, to read that planet's natal house. */
const PLANET_KEY: Record<
  DashaPlanet,
  "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu"
> = {
  Sun: "sun",
  Moon: "moon",
  Mars: "mars",
  Mercury: "mercury",
  Jupiter: "jupiter",
  Venus: "venus",
  Saturn: "saturn",
  Rahu: "rahu",
  Ketu: "ketu",
};

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

/** The classical Vimshottari significations, written for this app as one-year sub-period themes. */
const PLANET_THEME: Record<DashaPlanet, string> = {
  Sun: "A year that pushes you toward visibility and responsibility — recognition, leadership, and dealings with authority (or your father) come to the fore. Guard your vitality, and let quiet confidence rather than ego lead.",
  Moon: "Emotions, home, and the people who feel like family set the tone; expect a more inward, fluctuating rhythm and perhaps a change of place. Rest and comfort aren't indulgences now — they're how you stay steady.",
  Mars: "Energy and initiative run high — good for property, physical goals, and pushing stalled plans forward, though haste and short tempers can spark disputes. Channel the drive into building rather than fighting.",
  Mercury: "A sharp, communicative stretch favouring study, trade, writing, and networking; deals and conversations move quickly. Keep commitments clear — scattered attention is the main risk.",
  Jupiter: "One of the more fortunate periods — growth in wisdom, finances, and standing, with support from mentors and, for some, children or teaching. Expansion is favoured, as long as you don't overreach on optimism alone.",
  Venus: "Relationships, comfort, and the finer things take centre stage — favourable for love, marriage, art, and material ease. Enjoy it, but keep spending and indulgence within sensible limits.",
  Saturn: "A period of discipline and slow, real progress; responsibilities weigh heavier and results come through patience rather than speed. Nothing here is wasted — the structure you build now lasts.",
  Rahu: "Ambition surges and the unconventional pulls at you — foreign links, sudden openings, and rapid material gains are possible, alongside restlessness. Aim high, but stay honest about what's solid and what's illusion.",
  Ketu: "A more inward, detaching phase that quietly closes chapters and turns you toward meaning over acquisition. Loosen your grip on what's ending; clarity arrives once you stop forcing outcomes.",
};

const PLANET_GUIDANCE: Record<DashaPlanet, string> = {
  Sun: "measured confidence over pride",
  Moon: "rest, routine, and tending your inner life",
  Mars: "disciplined action over impulsive reaction",
  Mercury: "focus and clear, honest communication",
  Jupiter: "generosity paired with grounded optimism",
  Venus: "balance between pleasure and restraint",
  Saturn: "patience and steady, honest effort",
  Rahu: "ambition tempered by realism",
  Ketu: "letting go and looking inward",
};

function sadesatiNoteFor(phase: SadesatiPhase): string {
  switch (phase) {
    case "rising":
      return "Saturn's Sadesati is in its rising phase this year — early pressure to restructure your life. Pace yourself; the tests are only beginning.";
    case "peak":
      return "You are in the peak of Sadesati — the most demanding stretch of Saturn's cycle. Steadiness, patience, and honest effort matter more now than results.";
    case "setting":
      return "Sadesati is setting — the hardest tests are easing. Consolidate what you've rebuilt rather than starting anew.";
    case "dhaiya-4th":
    case "dhaiya-8th":
      return "A Dhaiya (Saturn's smaller cycle) touches this year — tend carefully to home, health, and finances, and avoid overreaching.";
  }
}

interface RawSegment {
  antardasha: DashaPlanet;
  start: Date;
  end: Date;
  overlapMs: number;
  /** The full (un-clipped) Antardasha period, needed to subdivide it into Pratyantardashas. */
  period: AntardashaPeriod;
}

/** A planet's natal-house ordinal (e.g. "3rd"), or null when houses aren't known. */
function houseLabelOf(result: ChartResult, planet: DashaPlanet): string | null {
  const house = result[PLANET_KEY[planet]].house;
  return house ? ordinal(house) : null;
}

/** Pratyantardashas of one Antardasha that overlap the window, as display-ready blocks. */
function pratyantarDetail(result: ChartResult, sub: AntardashaPeriod, windowStart: Date, windowEnd: Date): AnnualForecastPratyantar[] {
  const periods = calculateAntardasha({ planet: sub.planet, startDate: sub.startDate, durationYears: sub.durationYears });
  return periods
    .filter((p) => p.endDate > windowStart && p.startDate < windowEnd)
    .map((p) => {
      const start = p.startDate < windowStart ? windowStart : p.startDate;
      const end = p.endDate > windowEnd ? windowEnd : p.endDate;
      return {
        planet: p.planet,
        rangeLabel: `${monthYearShort(start)} – ${monthYearShort(end)}`,
        houseLabel: houseLabelOf(result, p.planet),
        focus: PLANET_GUIDANCE[p.planet],
      };
    });
}

/**
 * Synthesizes a rolling 12-month forecast from `from` (typically now),
 * grounded in the running Vimshottari Antardasha sub-periods that overlap
 * the window and any Saturn Sadesati phase active during it — the same
 * timing tools a classical annual reading uses. Pure: pass the reference
 * date in rather than reading the clock here.
 */
export function computeAnnualForecast(result: ChartResult, from: Date): AnnualForecast | null {
  const windowStart = from;
  const windowEnd = new Date(from.getTime());
  windowEnd.setUTCFullYear(windowEnd.getUTCFullYear() + 1);

  const windowLabel = `${monthYearLong(windowStart)} – ${monthYearLong(windowEnd)}`;

  // Mahadasha active at the window's start — the year's overarching cycle.
  const activeMaha =
    result.vimshottariDasha.find((m) => m.startDate <= windowStart && windowStart < m.endDate) ??
    result.vimshottariDasha.find((m) => m.endDate > windowStart);

  // The chart's Dasha timeline runs ~120 years from birth; if the window
  // somehow falls outside it (e.g. a far-future reference date), there's
  // nothing honest to say.
  if (!activeMaha) return null;

  const raw: RawSegment[] = [];
  for (const maha of result.vimshottariDasha) {
    if (maha.endDate <= windowStart || maha.startDate >= windowEnd) continue;
    for (const sub of maha.antardasha) {
      if (sub.endDate <= windowStart || sub.startDate >= windowEnd) continue;
      const start = sub.startDate < windowStart ? windowStart : sub.startDate;
      const end = sub.endDate > windowEnd ? windowEnd : sub.endDate;
      raw.push({ antardasha: sub.planet, start, end, overlapMs: end.getTime() - start.getTime(), period: sub });
    }
  }

  if (raw.length === 0) return null;

  const dominantMs = Math.max(...raw.map((s) => s.overlapMs));
  const dominant = raw.find((s) => s.overlapMs === dominantMs)!;

  const segments: AnnualForecastSegment[] = raw.map((s) => {
    const house = result[PLANET_KEY[s.antardasha]].house;
    return {
      antardasha: s.antardasha,
      rangeLabel: `${monthYearShort(s.start)} – ${monthYearShort(s.end)}`,
      houseLabel: house ? ordinal(house) : null,
      // House-specific reading when the birth time gives us houses; otherwise
      // the generic planet theme, since the house can't be known.
      theme: house ? PLANET_HOUSE_PREDICTION[s.antardasha][house]! : PLANET_THEME[s.antardasha],
      dominant: s.overlapMs === dominantMs,
      detail: pratyantarDetail(result, s.period, windowStart, windowEnd),
    };
  });

  const summary =
    `Across ${windowLabel} you remain in your ${activeMaha.planet} Mahadasha. ` +
    (segments.length === 1
      ? `The ${dominant.antardasha} sub-period (Antardasha) runs through the whole year, setting its tone.`
      : `The ${dominant.antardasha} sub-period (Antardasha) covers the largest share of these twelve months and sets the year's dominant tone.`);

  const sadesati = result.sadesatiPeriods.find((p) => p.endDate > windowStart && p.startDate < windowEnd);

  return {
    windowLabel,
    mahadasha: activeMaha.planet,
    summary,
    segments,
    sadesatiNote: sadesati ? sadesatiNoteFor(sadesati.phase) : null,
    guidance: `Above all, this year rewards ${PLANET_GUIDANCE[dominant.antardasha]}.`,
  };
}
