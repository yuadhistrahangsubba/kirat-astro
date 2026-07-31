import { describe, expect, it } from "vitest";

import { getKiratDayNumber, getKiratMonthYearLabel, gregorianToKirat, kiratToGregorian } from "./yele";

describe("gregorianToKirat", () => {
	// Cross-checked against the reference panchanga dataset
	it("converts 2026-06-29 to Thakmeppa 15, 5087", () => {
		const k = gregorianToKirat(2026, 6, 29);
		expect(k).not.toBeNull();
		expect(k?.monthName).toBe("Thakmeppa");
		expect(k?.kiratDay).toBe(15);
		expect(k?.kiratYear).toBe(5087);
	});

	it("converts 2026-07-08 to Thakmeppa 24, 5087", () => {
		const k = gregorianToKirat(2026, 7, 8);
		expect(k?.monthName).toBe("Thakmeppa");
		expect(k?.kiratDay).toBe(24);
		expect(k?.kiratYear).toBe(5087);
	});

	it("returns null outside the supported range", () => {
		expect(gregorianToKirat(1999, 12, 31)).toBeNull();
		expect(gregorianToKirat(2101, 1, 1)).toBeNull();
	});
});

describe("getKiratDayNumber", () => {
	// Same expectations as the legacy data/kirat-rules.test.ts
	it("matches known reference values", () => {
		expect(getKiratDayNumber(2026, 6, 1)).toBe(18); // Kapmeppa 18, 5087
		expect(getKiratDayNumber(2026, 6, 15)).toBe(1);
		expect(getKiratDayNumber(2026, 6, 14)).toBe(31);
	});

	it("covers years beyond the legacy 2051 table", () => {
		expect(typeof getKiratDayNumber(2075, 6, 15)).toBe("number");
		expect(getKiratDayNumber(2101, 1, 1)).toBe("");
	});
});

describe("kiratToGregorian round-trip", () => {
	it("round-trips arbitrary dates", () => {
		for (const [y, mo, d] of [
			[2026, 6, 29],
			[2026, 1, 5],
			[2030, 12, 31],
			[2000, 3, 15],
		] as const) {
			const k = gregorianToKirat(y, mo, d);
			expect(k).not.toBeNull();
			if (!k) continue;
			const g = kiratToGregorian(k.kiratYear, k.kiratMonth, k.kiratDay);
			expect(g).not.toBeNull();
			if (!g) continue;
			expect(g.adDate.getFullYear()).toBe(y);
			expect(g.adDate.getMonth() + 1).toBe(mo);
			expect(g.adDate.getDate()).toBe(d);
		}
	});
});

describe("getKiratMonthYearLabel", () => {
	it("labels June 2026 as spanning Kapmeppa and Thakmeppa of 5087", () => {
		expect(getKiratMonthYearLabel(2026, 6)).toBe("Kapmeppa - Thakmeppa, 5087");
	});

	it("returns empty outside the supported range", () => {
		expect(getKiratMonthYearLabel(2101, 5)).toBe("");
	});
});
