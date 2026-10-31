import { describe, expect, it } from "vitest";

import { todayInZone } from "./today";

describe("todayInZone", () => {
	it("uses the reference zone's date, not the visitor's", () => {
		// 2026-10-31T20:00Z is already 1 Nov 02:00 in Thimphu (UTC+6).
		const today = todayInZone("Asia/Thimphu", new Date("2026-10-31T20:00:00Z"));
		expect([today.getFullYear(), today.getMonth(), today.getDate()]).toEqual([2026, 10, 1]);
	});
});
