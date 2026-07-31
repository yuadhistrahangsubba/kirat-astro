import { describe, expect, it } from "vitest";

import { formatClock12, formatDMSPlain, formatDurationHM, formatEndingTime } from "./format";

const BASE = { y: 2026, mo: 6, d: 29 };

describe("formatEndingTime", () => {
	// refHours 5.5 (05:30 sunrise), ending 3.25h later → 08:45 same day
	it("formats a same-day moment in all three modes", () => {
		expect(formatEndingTime(5.5, 3.25, BASE, "12h")).toBe("08:45 AM");
		expect(formatEndingTime(5.5, 3.25, BASE, "24h")).toBe("08:45");
		expect(formatEndingTime(5.5, 3.25, BASE, "24plus")).toBe("08:45");
	});

	it("rolls past midnight with a date suffix in 12h/24h, keeps counting in 24+", () => {
		// 5.5 + 24.47 = 29.97 → 05:58 next day / 29:58 in 24+
		expect(formatEndingTime(5.5, 24.466667, BASE, "24plus")).toBe("29:58");
		expect(formatEndingTime(5.5, 24.466667, BASE, "24h")).toBe("05:58, Jun 30");
		expect(formatEndingTime(5.5, 24.466667, BASE, "12h")).toBe("05:58 AM, Jun 30");
	});

	it("handles PM clock values", () => {
		expect(formatEndingTime(5, 9.5, BASE, "12h")).toBe("02:30 PM");
	});

	it("returns a dash for non-finite moments", () => {
		expect(formatEndingTime(5, NaN, BASE, "12h")).toBe("—");
	});
});

describe("formatClock12", () => {
	it("formats a fraction of day with seconds and meridiem", () => {
		expect(formatClock12(0.5)).toBe("12:00:00 PM");
		expect(formatClock12(5.145 / 24)).toBe("05:08:42 AM");
	});
});

describe("formatDurationHM", () => {
	it("formats decimal hours as Hh MMm", () => {
		expect(formatDurationHM(13.865)).toBe("13h 52m");
		expect(formatDurationHM(NaN)).toBe("—");
	});
});

describe("formatDMSPlain", () => {
	it("formats degrees as D° MM′ SS″", () => {
		expect(formatDMSPlain(24.175)).toBe("24° 10′ 30″");
	});
});
