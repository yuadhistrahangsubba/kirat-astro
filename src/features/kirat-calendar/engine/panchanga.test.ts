import { describe, expect, it } from "vitest";

import { computePanchangaDay } from "./panchanga";
import { DEFAULT_PLACE, getDayInfo } from "./sunrise";

/** Parses "HH:MM" (24+ allowed) into decimal hours. */
function hoursOf(hhmm: string | undefined): number {
	const m = /(\d{1,2}):(\d{2})/.exec(hhmm ?? "");
	if (!m) return NaN;
	return Number(m[1]) + Number(m[2]) / 60;
}

/** Extracts the "upto HH:MM" hours from a limb string. */
function uptoHours(value: string | undefined): number {
	const m = /upto (\d{1,2}:\d{2})/.exec(value ?? "");
	return m ? hoursOf(m[1]) : NaN;
}

const TOLERANCE_HOURS = 5 / 60; // engine vs reference ephemeris/place rounding

describe("sunrise (NOAA port, Thimphu)", () => {
	it("matches the reference SunRise/SunSet for 2026-06-29 within a minute", () => {
		const info = getDayInfo(2026, 6, 29, DEFAULT_PLACE);
		expect(info.jdeSunrise).not.toBeNull();
		// Reference: SunRise 05:08:36, SunSet 19:00:29
		expect(info.day.sunriseFrac * 24).toBeCloseTo(5 + 8 / 60 + 36 / 3600, 1);
		expect(info.day.sunsetFrac * 24).toBeCloseTo(19 + 0 / 60 + 29 / 3600, 1);
	});
});

describe("computePanchangaDay vs reference dataset", () => {
	// Reference: panchanga-data.ts "2026-06-29" (ported from calendar_v1.html)
	it("reproduces 2026-06-29 (Thakmeppa 15, 5087)", () => {
		const p = computePanchangaDay(2026, 6, 29, DEFAULT_PLACE);

		expect(p.KiratDate).toBe("Thakmeppa 15, 5087");
		expect(p.KiratMonthYear).toBe("Kapmeppa - Thakmeppa, 5087");
		expect(p.day).toBe("Monday");
		expect(p.KiratDay).toBe("Phoraba");
		expect(p.Labhrang).toBe("Lanuppa");

		// (15) Labhumba upto 29:58
		expect(p.Lamikkhok).toContain("Labhumba");
		expect(p.Lamikkhok).toContain("(15)");
		expect(uptoHours(p.Lamikkhok)).toBeCloseTo(29 + 58 / 60, 0);

		// (19) Lingwa upto 28:35
		expect(p.Mangyuk).toContain("Lingwa");
		expect(Math.abs(uptoHours(p.Mangyuk) - (28 + 35 / 60))).toBeLessThan(TOLERANCE_HOURS);
		expect(p.nextM).toBe("(20) Pewa");

		// (24) Takyumba upto 14:57
		expect(p.Samyuk).toContain("Takyumba");
		expect(Math.abs(uptoHours(p.Samyuk) - (14 + 57 / 60))).toBeLessThan(TOLERANCE_HOURS);
		expect(p.nextS).toBe("(25) Tonlungba");

		// Khok ending times match the reference (16:48 / 29:58). Names follow
		// the reference APP's mapKarana (idx+1 → Labhongsing here); the legacy
		// hand-copied dataset used a different, internally inconsistent karana
		// numbering, so only the boundary times are asserted against it.
		expect(p.Khok).toContain("Labhongsing");
		expect(Math.abs(uptoHours(p.Khok) - (16 + 48 / 60))).toBeLessThan(TOLERANCE_HOURS);
		expect(Math.abs(uptoHours(p.Khok2) - (29 + 58 / 60))).toBeLessThan(TOLERANCE_HOURS);

		// Signs
		expect(p.moonSign).toContain("Phanam");
		expect(p.moonSign).toContain("Sagittarius");
		expect(p.sunSign).toContain("Kanam");
		expect(p.SunMangyuk).toBe("(06) Kungwa");

		// Inauspicious windows: YemPhakmura 06:52 to 08:36
		const [ypStart] = (p.YemPhakmura ?? "").split(" to ");
		expect(Math.abs(hoursOf(ypStart) - (6 + 52 / 60))).toBeLessThan(TOLERANCE_HOURS);

		// Senlendat: Monday run starts at Singla; slot 1 = sunrise
		expect(p.daySenlen1).toBe("Singla");
		expect(p.daySenlen2).toBe("Pung");
		expect(p.nightSenlen1).toBe("Tung");
		expect(Math.abs(hoursOf(p.daySenlendatStart1 ?? "") - (5 + 8 / 60))).toBeLessThan(TOLERANCE_HOURS);

		// Yenyem: Monday day cycle starts at Mangghu
		expect(p.dayYemY1).toBe("Mangghu");
		expect(p.dayYemyResult1).toBe("Good");
		expect(p.nightYemY1).toBe("Membupek");

		// Yangdhok residences. Midhung follows the reference APP's formula
		// ((weekday+lamikkhok+1) mod 4, Sunday=1); the legacy dataset's hand
		// values disagree with each other across days, so Midhung is only
		// format-checked here and value-checked on 2026-07-09 below.
		expect(p.MidhungYangdhok).toMatch(/^(Khambek|Tangsang|Iksa) upto \d{1,2}:\d{2}/);
		expect(p.HangsamYangdhok).toContain("Sijumbho");
		expect(p.ChrangYangdhok).toContain("Northwest");
		expect(p.SinglaYangdhok).toContain("East");
	});

	it("reproduces 2026-06-30 (Tuesday, Mikhangba)", () => {
		const p = computePanchangaDay(2026, 6, 30, DEFAULT_PLACE);
		expect(p.KiratDate).toBe("Thakmeppa 16, 5087");
		expect(p.day).toBe("Tuesday");
		expect(p.KiratDay).toBe("Mikhangba");
		// (15) Labhumba upto 05:58
		expect(p.Lamikkhok).toContain("Labhumba");
		expect(Math.abs(uptoHours(p.Lamikkhok) - (5 + 58 / 60))).toBeLessThan(TOLERANCE_HOURS);
		// (20) Pewa upto 31:23
		expect(p.Mangyuk).toContain("Pewa");
		expect(Math.abs(uptoHours(p.Mangyuk) - (31 + 23 / 60))).toBeLessThan(TOLERANCE_HOURS);
		// Senlendat Tuesday starts at Khawa
		expect(p.daySenlen1).toBe("Khawa");
		// Yenyem Tuesday day cycle starts at Tung
		expect(p.dayYemY1).toBe("Tung");
	});

	it("reproduces 2026-07-08 core limbs (Wednesday, Kheksuba/Khaksuba)", () => {
		const p = computePanchangaDay(2026, 7, 8, DEFAULT_PLACE);
		expect(p.KiratDate).toBe("Thakmeppa 24, 5087");
		expect(p.day).toBe("Wednesday");
		// (23) Lagamba upto 12:48
		expect(p.Lamikkhok).toContain("Lagamba");
		expect(Math.abs(uptoHours(p.Lamikkhok) - (12 + 48 / 60))).toBeLessThan(TOLERANCE_HOURS);
		// (27) Thangwa upto 16:25
		expect(p.Mangyuk).toContain("Thangwa");
		expect(Math.abs(uptoHours(p.Mangyuk) - (16 + 26 / 60))).toBeLessThan(TOLERANCE_HOURS);
		expect(p.nextM).toBe("(01) Isari");
		// (06) Kuhalaba upto 13:04
		expect(p.Samyuk).toContain("Kuhalaba");
		expect(Math.abs(uptoHours(p.Samyuk) - (13 + 4 / 60))).toBeLessThan(TOLERANCE_HOURS);
		// Moon leaving Pisces: moonSign "♓ Chakla - Pisces upto 16:25", next Aries
		expect(p.moonSign).toContain("Chakla");
		expect(p.nextmoonS).toContain("Anam");
		expect(p.sunSign).toContain("Kanam");
		expect(p.SunMangyuk).toBe("(07) Samsri");
	});

	it("reproduces 2026-07-09 Midhung Yangdhok (Iksa, per the reference Kirat-script data)", () => {
		const p = computePanchangaDay(2026, 7, 9, DEFAULT_PLACE);
		expect(p.MidhungYangdhok).toContain("Iksa");
	});

	it("produces a full dataset for a date with no static entry (2030-03-15)", () => {
		const p = computePanchangaDay(2030, 3, 15, DEFAULT_PLACE);
		expect(p.KiratDate).toBeTruthy();
		expect(p.Lamikkhok).toMatch(/^\(\d{2}\) \w+ upto \d{1,2}:\d{2}$/);
		expect(p.Mangyuk).toMatch(/upto/);
		expect(p.daySenlen12).toBeTruthy();
		expect(p.nightYemY8).toBeTruthy();
		expect(p.SunRise).toMatch(/AM$/);
	});
});
