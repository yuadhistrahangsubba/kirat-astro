import { describe, expect, it } from "vitest";

import { computePanchangaDay } from "./panchanga";
import { computeSenlendatSlots, computeYenyemSlots } from "./slots";
import { DEFAULT_PLACE } from "./sunrise";

describe("computeSenlendatSlots", () => {
	// Monday (weekday 1): reference dataset 2026-06-29 starts at Singla
	it("cycles Monday's day run starting at Singla", () => {
		const { dayEntries, nightEntries } = computeSenlendatSlots(1, 5.14, 13.86, 10.14);
		expect(dayEntries).toHaveLength(12);
		expect(nightEntries).toHaveLength(12);
		expect(dayEntries.map((s) => s.name).slice(0, 7)).toEqual([
			"Singla",
			"Pung",
			"Payang",
			"Khawa",
			"Thung",
			"Tung",
			"Saya",
		]);
		expect(nightEntries[0]?.name).toBe("Tung");
	});

	it("produces contiguous, equal slots", () => {
		const { dayEntries } = computeSenlendatSlots(3, 6, 12, 12);
		for (let i = 1; i < dayEntries.length; i++) {
			expect(dayEntries[i]?.startHours).toBeCloseTo(dayEntries[i - 1]?.endHours ?? NaN, 9);
		}
		expect(dayEntries[0]?.startHours).toBe(6);
		expect(dayEntries[11]?.endHours).toBeCloseTo(18, 9);
	});

	it("returns empty arrays for non-finite durations", () => {
		const { dayEntries, nightEntries } = computeSenlendatSlots(0, 6, NaN, NaN);
		expect(dayEntries).toHaveLength(0);
		expect(nightEntries).toHaveLength(0);
	});
});

describe("computeYenyemSlots", () => {
	// Monday: reference dataset 2026-06-29 day cycle starts at Mangghu
	it("cycles Monday's day run starting at Mangghu, night at Membupek", () => {
		const { dayEntries, nightEntries } = computeYenyemSlots(1, 5.14, 13.86, 10.14);
		expect(dayEntries.map((s) => s.name)).toEqual([
			"Mangghu",
			"Siya",
			"Pano",
			"Tung",
			"Mudo",
			"Membupek",
			"Labo",
			"Mangghu",
		]);
		expect(nightEntries[0]?.name).toBe("Membupek");
		expect(dayEntries[0]?.meaning).toBe("Nectar");
		expect(dayEntries[0]?.result).toBe("Good");
	});
});

describe("parity with computePanchangaDay fields", () => {
	it("2026-06-29 daySenlen/dayYemY fields come from the same slot builders", () => {
		const p = computePanchangaDay(2026, 6, 29, DEFAULT_PLACE);
		expect(p.daySenlen1).toBe("Singla");
		expect(p.daySenlen12).toBe("Thung");
		expect(p.nightSenlen1).toBe("Tung");
		expect(p.dayYemY1).toBe("Mangghu");
		expect(p.nightYemY1).toBe("Membupek");
	});
});
