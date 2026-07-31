import { describe, expect, it } from "vitest";

import { PANCHANGA_DATA } from "../data/panchanga-data";
import { getPanchanga } from "./index";

describe("getPanchanga", () => {
	it("returns computed data for dates with no static entry", () => {
		const p = getPanchanga("2027-05-20");
		expect(p).toBeDefined();
		expect(p?.Lamikkhok).toMatch(/upto/);
		expect(p?.KiratDate).toBeTruthy();
	});

	it("keeps hand-authored static values on reference days (static wins)", () => {
		const p = getPanchanga("2026-06-29");
		const s = PANCHANGA_DATA["2026-06-29"];
		expect(p?.Lamikkhok).toBe(s?.Lamikkhok);
		expect(p?.Wanma).toBe(s?.Wanma);
		expect(p?.HangHangwa).toBe(s?.HangHangwa);
		expect(p?.KaliYuga).toBe(s?.KaliYuga);
	});

	it("fills static empty-string placeholders with computed values", () => {
		// 2026-07-08's static entry has SunRise:"" — the computed value should show through
		const p = getPanchanga("2026-07-08");
		expect(p?.SunRise).toMatch(/AM$/);
		// while its hand-authored K-script fields survive
		expect(p?.KLamikkhok).toContain("ᤗᤠᤃᤶᤒᤠ");
	});

	it("returns only static data (if any) outside the yele range", () => {
		expect(getPanchanga("2101-01-01")).toBeUndefined();
	});

	it("memoizes results per date key", () => {
		expect(getPanchanga("2027-05-20")).toBe(getPanchanga("2027-05-20"));
	});
});
