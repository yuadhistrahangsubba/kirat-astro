import { DASHA_SEQUENCE, type DashaPlanet } from "../vedic/dasha";
import { classifyDignity, DIGNITY_PHRASE } from "../vedic/dignity";
import { calculateNatalAspects, type NatalAspect, planetsAspecting } from "../vedic/graha-drishti";
import { RASHI_LORDS } from "../vedic/lords";
import type { ChartResult, Grahas } from "../types";

import { DOMAIN_CONFIGS, type DomainConfig } from "./config";
import { FLAVOR_TEXT } from "./flavor-text";
import { classifyHouseStrength, STRENGTH_PHRASES } from "./strength";
import type { DomainInterpretation, HouseStrength } from "./types";

const GRAHA_KEY: Record<DashaPlanet, keyof Grahas<unknown>> = {
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

interface Placement {
  houseNumber?: number;
  sign: string;
  signIndex: number;
}

function placementOf(result: ChartResult, planet: DashaPlanet): Placement {
  const body = result[GRAHA_KEY[planet]];
  return { houseNumber: body.house, sign: body.rashi.signName, signIndex: body.rashi.signIndex };
}

/** Every placed graha's whole-sign house, keyed by planet — the input `calculateNatalAspects` needs to compute who-aspects-what for a whole chart at once. */
function gatherGrahaHouses(result: ChartResult): Partial<Record<DashaPlanet, number>> {
  const houses: Partial<Record<DashaPlanet, number>> = {};
  for (const planet of DASHA_SEQUENCE) {
    houses[planet] = result[GRAHA_KEY[planet]].house;
  }
  return houses;
}

function formatPlanetList(planets: readonly DashaPlanet[]): string {
  if (planets.length === 0) return "";
  if (planets.length === 1) return planets[0]!;
  if (planets.length === 2) return `${planets[0]} and ${planets[1]}`;
  return `${planets.slice(0, -1).join(", ")}, and ${planets[planets.length - 1]}`;
}

/**
 * The combinatorial heart of a domain's summary sentence: dignity (is
 * this planet exalted, debilitated, at home, or placed with a friendly
 * or unfriendly sign-lord?) plus which named planets cast a graha-drishti
 * aspect onto its house — the same two facts AstroSage-style "Planet
 * Consideration" prose is built from, replacing what used to be a single
 * 4-bucket house-strength lookup with no sign or aspect awareness at all.
 */
function describePlacement(
  planet: DashaPlanet,
  signName: string,
  signIndex: number,
  house: number | undefined,
  aspects: readonly NatalAspect[],
): string {
  const dignityPhrase = DIGNITY_PHRASE[classifyDignity(planet, signIndex)];
  const houseClause = house ? `, sitting in your ${ordinal(house)} house` : "";
  const aspectingPlanets = house ? planetsAspecting(aspects, house) : [];
  const aspectClause = aspectingPlanets.length > 0 ? `, aspected by ${formatPlanetList(aspectingPlanets)}` : "";
  return `${dignityPhrase} in ${signName}${houseClause}${aspectClause}`;
}

/**
 * Computes one domain's interpretation from the real chart. When the
 * birth time is exact, the dynamic sentence is grounded in whole-sign
 * house placement (the domain's house, its lord, and where that lord
 * actually sits, its sign dignity, and who aspects it) — the standard
 * classical technique. Without an exact time, houses can't be computed
 * at all, so the reading instead leans on the Moon's sign and dignity,
 * transparently noting the fallback rather than fabricating a house
 * placement.
 *
 * `aspects` is optional and only exists so `interpretAllDomains` can
 * compute the whole chart's aspect graph once and share it across all 10
 * domains instead of recomputing it per call.
 */
export function interpretDomain(
  config: DomainConfig,
  result: ChartResult,
  aspects?: readonly NatalAspect[],
): DomainInterpretation {
  const resolvedAspects = aspects ?? calculateNatalAspects(gatherGrahaHouses(result));
  const ascendantSignIndex = result.ascendant?.rashi.signIndex;
  const flavorSign = result.ascendant?.rashi.signName ?? result.moon.rashi.signName;
  const flavor = FLAVOR_TEXT[config.key][flavorSign] ?? "";

  if (ascendantSignIndex === undefined) {
    const moonDignityPhrase = DIGNITY_PHRASE[classifyDignity("Moon", result.moon.rashi.signIndex)];
    const summary =
      `${config.title} ${config.framingVerb}. Your exact birth time isn't set, so this reading leans on ` +
      `your Moon sign, ${result.moon.rashi.signName} — currently ${moonDignityPhrase} — rather than house placements.`;
    return {
      key: config.key,
      title: config.title,
      house: 0,
      houseSign: result.moon.rashi.signName,
      lord: "Moon",
      lordSign: result.moon.rashi.signName,
      strength: "supportive",
      summary,
      flavor,
    };
  }

  if (config.planet) {
    const { houseNumber, sign, signIndex } = placementOf(result, config.planet);
    const strength: HouseStrength = houseNumber ? classifyHouseStrength(houseNumber) : "supportive";
    const placementDescription = describePlacement(config.planet, sign, signIndex, houseNumber, resolvedAspects);
    const strengthClause = houseNumber ? ` — ${STRENGTH_PHRASES[strength]}` : "";
    const summary = `${config.planet} ${config.framingVerb}. It's ${placementDescription}${strengthClause}.`;
    return {
      key: config.key,
      title: config.title,
      house: houseNumber ?? 0,
      houseSign: sign,
      lord: config.planet,
      lordHouse: houseNumber,
      lordSign: sign,
      strength,
      summary,
      flavor,
    };
  }

  const houseNumber = config.house!;
  const houseSignIndex = (ascendantSignIndex + houseNumber - 1) % 12;
  const houseSign = SIGN_NAMES[houseSignIndex]!;
  const lord = rasiLordBySignIndex(houseSignIndex);
  const { houseNumber: lordHouse, sign: lordSign, signIndex: lordSignIndex } = placementOf(result, lord);
  const strength: HouseStrength = lordHouse ? classifyHouseStrength(lordHouse) : "supportive";
  const placementDescription = describePlacement(lord, lordSign, lordSignIndex, lordHouse, resolvedAspects);
  const summary =
    `Your ${ordinal(houseNumber)} house (${houseSign}) ${config.framingVerb}. ` +
    `It's ruled by ${lord}, who is ${placementDescription} — ${STRENGTH_PHRASES[strength]}.`;

  return {
    key: config.key,
    title: config.title,
    house: houseNumber,
    houseSign,
    lord,
    lordHouse,
    lordSign,
    strength,
    summary,
    flavor,
  };
}

export function interpretAllDomains(result: ChartResult): DomainInterpretation[] {
  const aspects = calculateNatalAspects(gatherGrahaHouses(result));
  return DOMAIN_CONFIGS.map((config) => interpretDomain(config, result, aspects));
}

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

function rasiLordBySignIndex(signIndex: number): DashaPlanet {
  return RASHI_LORDS[signIndex]!;
}

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}
