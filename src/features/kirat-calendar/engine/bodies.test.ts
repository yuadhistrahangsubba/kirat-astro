import { describe, expect, it } from "vitest";

import { computeBodyPositions } from "./bodies";
import { khesemukInclusiveCount, khesemukIndexFromCount, singlabamukCount } from "./tables";

const JD_2026_06_29 = 2461220.5;

describe("computeBodyPositions", () => {
	const rows = computeBodyPositions(JD_2026_06_29, 24.25);

	it("returns the ten bodies in reference order", () => {
		expect(rows.map((b) => b.label)).toEqual([
			"Sun",
			"Moon",
			"Mercury",
			"Venus",
			"Mars",
			"Jupiter",
			"Saturn",
			"Uranus",
			"Neptune",
			"Pluto",
		]);
	});

	it("produces sane coordinate ranges", () => {
		for (const b of rows) {
			expect(b.siderealLon).toBeGreaterThanOrEqual(0);
			expect(b.siderealLon).toBeLessThan(360);
			expect(Math.abs(b.eclipticLat)).toBeLessThan(20);
			expect(b.raDeg).toBeGreaterThanOrEqual(0);
			expect(b.raDeg).toBeLessThan(360);
			expect(b.distanceAu).toBeGreaterThan(0);
		}
		const moon = rows.find((b) => b.key === "moon");
		expect(moon?.distanceAu).toBeGreaterThan(0.002);
		expect(moon?.distanceAu).toBeLessThan(0.003);
	});
});

describe("khesemuk/singlabamuk counting", () => {
	it("counts inclusively with wrap-around", () => {
		expect(khesemukInclusiveCount(1, 1)).toBe(1);
		expect(khesemukInclusiveCount(1, 27)).toBe(27);
		expect(khesemukInclusiveCount(27, 1)).toBe(2);
		expect(singlabamukCount(1, 1)).toBe(1);
		expect(singlabamukCount(12, 1)).toBe(2);
		expect(singlabamukCount(2, 1)).toBe(12);
	});

	it("reduces counts mod 9 with 0 treated as 9", () => {
		expect(khesemukIndexFromCount(9)).toBe(9);
		expect(khesemukIndexFromCount(18)).toBe(9);
		expect(khesemukIndexFromCount(10)).toBe(1);
		expect(khesemukIndexFromCount(27)).toBe(9);
	});
});
