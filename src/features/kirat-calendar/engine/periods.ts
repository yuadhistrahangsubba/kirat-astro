/**
 * Moon-pada, Saran/Nganet and Tong period calculators, ported verbatim from
 * the reference Kirat Calendar app. All hour values are hours from the
 * Kirat day's sunrise reference, like calcEndingMoment's output.
 */

import { MANGYUK, normalize360, pick } from "./tables";

/** Each Mangyuk (13°20′) divides into 4 Padas of 3°20′. */
const PADA_SPAN = 10 / 3;

export interface MoonPada {
	nakName: string;
	nakSerial: number;
	padaNum: number;
	endingMomentHours: number;
}

/**
 * Lists every Moon Mangyuk Pada ending during the Kirat day (sunrise to
 * next sunrise), by linear interpolation of the Moon's daily motion.
 */
export function calcMoonPadas(startLon: number, motionPerDay: number): MoonPada[] {
	const results: MoonPada[] = [];
	if (!(motionPerDay > 0)) return results;
	const startNorm = normalize360(startLon);
	let idx = Math.floor(startNorm / PADA_SPAN); // active-at-sunrise global pada index, 0-107
	for (;;) {
		idx += 1;
		const boundaryUnwrapped = idx * PADA_SPAN;
		const diffFromStart = boundaryUnwrapped - startNorm;
		if (diffFromStart > motionPerDay + 1e-9) break;
		const globalPadaIdx = (((idx - 1) % 108) + 108) % 108; // the pada that just ended
		const nak = pick(MANGYUK, Math.floor(globalPadaIdx / 4));
		results.push({
			nakName: nak.name,
			nakSerial: nak.n,
			padaNum: (globalPadaIdx % 4) + 1,
			endingMomentHours: (diffFromStart / motionPerDay) * 24,
		});
	}
	return results;
}

export interface ZonePeriod {
	state: "upto" | "from" | "full";
	momentHours?: number;
}

/**
 * Saran and Nganet — once-a-month periods defined by the Moon's sidereal
 * longitude falling in a fixed zone ending at 360°/0°. Saran: 280°-360°,
 * Nganet: 300°-360°. Returns null when the zone doesn't touch this day.
 */
export function computeMoonZonePeriod(
	moonSidLon: number,
	moonMotionPerDay: number,
	startDeg: number,
): ZonePeriod | null {
	if (!(moonMotionPerDay > 0)) return null;
	const L0 = moonSidLon;
	const L1 = L0 + moonMotionPerDay;
	const inZoneAtSunrise = L0 >= startDeg && L0 < 360;
	if (inZoneAtSunrise) {
		if (L1 >= 360) {
			const remaining = 360 - L0;
			return { state: "upto", momentHours: (remaining / moonMotionPerDay) * 24 };
		}
		return { state: "full" };
	}
	if (L1 >= startDeg) {
		const remaining = startDeg - L0;
		return { state: "from", momentHours: (remaining / moonMotionPerDay) * 24 };
	}
	return null;
}

/**
 * Tong — five types, each triggered when the Sun's sidereal longitude sits
 * within the 1° span ending at a specific degree-in-sign marker ("the Nth
 * degree" = the span from N-1 up to N), repeating identically in every sign.
 */
export const TONG_TYPES = [
	{ name: "Si Tong", degrees: [2, 11, 20, 29] },
	{ name: "Midhung Tong", degrees: [3, 12, 21, 30] },
	{ name: "Tomi Tong", degrees: [5, 14, 23] },
	{ name: "Kundhek Tong", degrees: [7, 16, 25] },
	{ name: "Tung Tong", degrees: [9, 18, 27] },
] as const;

interface TongWindowStart {
	name: string;
	start: number;
}

function buildTongWindowStarts(): TongWindowStart[] {
	const starts: TongWindowStart[] = [];
	for (let sign = 0; sign < 12; sign++) {
		for (const type of TONG_TYPES) {
			for (const deg of type.degrees) {
				starts.push({ name: type.name, start: sign * 30 + deg - 1 });
			}
		}
	}
	starts.sort((a, b) => a.start - b.start);
	return starts;
}
const TONG_WINDOW_STARTS = buildTongWindowStarts();

interface TongZonePeriod extends ZonePeriod {
	windowEndAbs: number;
}

function computeTongZonePeriod(
	sunSidLon: number,
	sunMotionPerDay: number,
	triggerDegrees: readonly number[],
): TongZonePeriod | null {
	if (!(sunMotionPerDay > 0)) return null;
	const L0 = normalize360(sunSidLon);
	const L1 = L0 + sunMotionPerDay;

	const zoneStarts: number[] = [];
	for (let sign = 0; sign < 12; sign++) {
		for (const deg of triggerDegrees) {
			zoneStarts.push(sign * 30 + deg - 1);
		}
	}

	for (const zsBase of zoneStarts) {
		for (const zs of [zsBase - 360, zsBase, zsBase + 360]) {
			const ze = zs + 1;
			if (L0 >= zs && L0 < ze) {
				if (L1 >= ze) return { state: "upto", momentHours: ((ze - L0) / sunMotionPerDay) * 24, windowEndAbs: ze };
				return { state: "full", windowEndAbs: ze };
			}
			if (L0 < zs && L1 >= zs) {
				return { state: "from", momentHours: ((zs - L0) / sunMotionPerDay) * 24, windowEndAbs: zs + 1 };
			}
		}
	}
	return null;
}

function findNextTongOccurrence(
	afterAbsLon: number,
	sunMotionPerDay: number,
): { name: string; momentHours: number } | null {
	if (!(sunMotionPerDay > 0)) return null;
	for (let cycle = 0; cycle <= 2; cycle++) {
		for (const w of TONG_WINDOW_STARTS) {
			const zs = w.start + cycle * 360;
			if (zs > afterAbsLon) {
				return { name: w.name, momentHours: ((zs - afterAbsLon) / sunMotionPerDay) * 24 };
			}
		}
	}
	return null;
}

export interface TongResult {
	current: { name: string; state: ZonePeriod["state"]; momentHours?: number } | null;
	next: { name: string; momentHours: number } | null;
}

/**
 * Checks all five Tong types for what's active/ending/starting today, then
 * looks up whichever occurrence comes next after that.
 */
export function computeTong(sunSidLon: number, sunMotionPerDay: number): TongResult | null {
	const L0 = normalize360(sunSidLon);
	let current: (TongZonePeriod & { name: string }) | null = null;
	for (const type of TONG_TYPES) {
		const period = computeTongZonePeriod(L0, sunMotionPerDay, type.degrees);
		if (!period) continue;
		if (period.state === "full" || period.state === "upto") {
			current = { ...period, name: type.name };
			break; // zones never overlap, so at most one can be truly active
		}
		if (!current) current = { ...period, name: type.name };
	}

	const searchAfter = current ? current.windowEndAbs : L0;
	const next = findNextTongOccurrence(searchAfter, sunMotionPerDay);

	if (!current && !next) return null;
	return {
		current: current ? { name: current.name, state: current.state, momentHours: current.momentHours } : null,
		next,
	};
}
