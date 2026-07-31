import { describe, expect, it } from "vitest";

import { computeYenlonDetail } from "./panchanga";
import { DEFAULT_PLACE } from "./sunrise";

describe("computeYenlonDetail (2026-06-29, Thimphu — reference day)", () => {
	const d = computeYenlonDetail(2026, 6, 29, DEFAULT_PLACE);

	it("carries the base identity fields", () => {
		expect(d.englishDay).toBe("Monday");
		expect(d.kiratDayName).toBe("Phoraba");
		expect(d.labhrang).toBe("Lanuppa");
		expect(d.kiratDate?.monthName).toBe("Thakmeppa");
		expect(d.kiratDate?.kiratDay).toBe(15);
	});

	it("computes the limbs with sane ending moments", () => {
		expect(d.tithi.serial).toBe(15);
		expect(d.tithi.name).toBe("Labhumba");
		// Reference "upto 29:58" → ending ≈ 29.97 − refHours (≈5.14) ≈ 24.8h after sunrise
		expect(d.refHours + d.tithi.endingMomentHours).toBeCloseTo(29 + 58 / 60, 0);
		expect(d.nak.name).toBe("Lingwa");
		expect(d.nak.nextName).toBe("Pewa");
		expect(d.yoga.name).toBe("Takyumba");
		expect(d.karana2.endingMomentHours).toBeGreaterThan(d.karana.endingMomentHours);
	});

	it("computes astronomical data consistently", () => {
		expect(d.noSunrise).toBe(false);
		expect(d.solarNoonFrac).toBeGreaterThan(d.sunriseFrac);
		expect(d.solarNoonFrac).toBeLessThan(d.sunsetFrac);
		expect(d.dayDurationHours + d.nightDurationHours).toBeCloseTo(d.totalKiratDayHours, 6);
		expect(d.julianDay).toBeGreaterThan(2461000);
		expect(d.ayanamshaDeg).toBeGreaterThan(24);
		expect(d.ayanamshaDeg).toBeLessThan(25);
	});

	it("lists the Moon padas ending within the Kirat day", () => {
		expect(d.moonPadas.length).toBeGreaterThan(0);
		expect(d.moonPadas.length).toBeLessThanOrEqual(5);
		for (const p of d.moonPadas) {
			expect(p.endingMomentHours).toBeGreaterThan(0);
			expect(p.endingMomentHours).toBeLessThanOrEqual(d.totalKiratDayHours + 1);
			expect(p.padaNum).toBeGreaterThanOrEqual(1);
			expect(p.padaNum).toBeLessThanOrEqual(4);
		}
	});

	it("computes inauspicious windows inside daylight", () => {
		const { yemPhakmura, gulakaiKala, yamagandaKala, tong } = d.inauspicious;
		for (const w of [yemPhakmura, gulakaiKala, yamagandaKala]) {
			expect(w).not.toBeNull();
			if (!w) continue;
			expect(w.startHours).toBeGreaterThanOrEqual(d.refHours - 1e-9);
			expect(w.endHours).toBeLessThanOrEqual(d.refHours + d.dayDurationHours + 1e-9);
		}
		// Monday: Yem Phakmura at part 0.125 → ref "06:52 to 08:36"
		expect(yemPhakmura?.startHours).toBeCloseTo(6 + 52 / 60, 1);
		// Tong always resolves to a current occurrence and/or a next one
		expect(tong === null || tong.current !== null || tong.next !== null).toBe(true);
	});

	it("computes the residence block per the reference formulas", () => {
		expect(d.residence.hangsam.currentName).toBe("Sijumbho");
		expect(d.residence.chrang.currentName).toBe("Northwest");
		expect(d.residence.singlaba.currentName).toBe("East");
		expect(["Khambek", "Tangsang", "Iksa"]).toContain(d.residence.midhung.currentName);
	});
});

describe("computeYenlonDetail (arbitrary uncovered date)", () => {
	it("produces a complete structure for 2030-03-15", () => {
		const d = computeYenlonDetail(2030, 3, 15, DEFAULT_PLACE);
		expect(d.tithi.name).toBeTruthy();
		expect(d.tithi.nextName).toBeTruthy();
		expect(isFinite(d.tithi.endingMomentHours)).toBe(true);
		expect(d.moonSign.kiratName).toBeTruthy();
		expect(d.kiratDate).not.toBeNull();
	});
});
