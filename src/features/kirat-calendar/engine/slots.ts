/**
 * Senlendat (Kirat planetary hours: 12 Day + 12 Night slots) and Yenyem
 * (eightfold division: 8 Day + 8 Night slots) builders, ported from the
 * reference Kirat Calendar app. Hours are absolute from the base date's
 * midnight (24+ domain), like the sunrise reference itself.
 */

import { pick, SENLENDAT_CYCLE, SENLENDAT_RESULTS, YENYEM_CYCLE, YENYEM_INFO } from "./tables";

export interface Slot {
	no: number;
	name: string;
	startHours: number;
	endHours: number;
	/** Yenyem only */
	meaning?: string;
	result?: string;
}

export interface DayNightSlots {
	dayEntries: Slot[];
	nightEntries: Slot[];
}

/**
 * The 24-slot Senlendat run for civil weekday `w` starts at cycle index
 * (w*3) % 7 — the classical planetary-hour progression.
 */
export function computeSenlendatSlots(
	weekday: number,
	sunriseAbsHours: number,
	dayDurationHours: number,
	nightDurationHours: number,
): DayNightSlots {
	const startIdx = (weekday * 3) % 7;
	const dayEntries: Slot[] = [];
	const nightEntries: Slot[] = [];

	if (isFinite(dayDurationHours) && dayDurationHours > 0) {
		const dayLen = dayDurationHours / 12;
		for (let i = 0; i < 12; i++) {
			const name = pick(SENLENDAT_CYCLE, (startIdx + i) % 7);
			dayEntries.push({
				no: i + 1,
				name,
				startHours: sunriseAbsHours + i * dayLen,
				endHours: sunriseAbsHours + (i + 1) * dayLen,
				result: SENLENDAT_RESULTS[name],
			});
		}
	}

	if (isFinite(nightDurationHours) && nightDurationHours > 0) {
		const nightLen = nightDurationHours / 12;
		const nightBase = sunriseAbsHours + (isFinite(dayDurationHours) ? dayDurationHours : 0);
		for (let i = 0; i < 12; i++) {
			const name = pick(SENLENDAT_CYCLE, (startIdx + 12 + i) % 7);
			nightEntries.push({
				no: i + 1,
				name,
				startHours: nightBase + i * nightLen,
				endHours: nightBase + (i + 1) * nightLen,
				result: SENLENDAT_RESULTS[name],
			});
		}
	}

	return { dayEntries, nightEntries };
}

/**
 * Yenyem: Day steps +1 through the 7-name cycle each slot; Night steps +5
 * (≡ −2). Day start index = (weekday*3)%7, Night start = day start + 5.
 */
export function computeYenyemSlots(
	weekday: number,
	sunriseAbsHours: number,
	dayDurationHours: number,
	nightDurationHours: number,
): DayNightSlots {
	const dayStartIdx = (weekday * 3) % 7;
	const nightStartIdx = (dayStartIdx + 5) % 7;
	const dayEntries: Slot[] = [];
	const nightEntries: Slot[] = [];

	const makeEntry = (no: number, name: string, startHours: number, endHours: number): Slot => {
		const info = YENYEM_INFO[name] ?? { meaning: "", result: "" };
		return { no, name, startHours, endHours, meaning: info.meaning, result: info.result };
	};

	if (isFinite(dayDurationHours) && dayDurationHours > 0) {
		const dayLen = dayDurationHours / 8;
		for (let i = 0; i < 8; i++) {
			const name = pick(YENYEM_CYCLE, (dayStartIdx + i) % 7);
			dayEntries.push(makeEntry(i + 1, name, sunriseAbsHours + i * dayLen, sunriseAbsHours + (i + 1) * dayLen));
		}
	}

	if (isFinite(nightDurationHours) && nightDurationHours > 0) {
		const nightLen = nightDurationHours / 8;
		const nightBase = sunriseAbsHours + (isFinite(dayDurationHours) ? dayDurationHours : 0);
		for (let i = 0; i < 8; i++) {
			const name = pick(YENYEM_CYCLE, (nightStartIdx + 5 * i) % 7);
			nightEntries.push(makeEntry(i + 1, name, nightBase + i * nightLen, nightBase + (i + 1) * nightLen));
		}
	}

	return { dayEntries, nightEntries };
}
