import { describe, expect, it } from "vitest";

import { AYANAMSHA_SYSTEMS, ayanamshaSystem, lahiriAyanamshaDeg } from "./ayanamsha";

const JD_2026_06_29 = 2461220.5;

describe("AYANAMSHA_SYSTEMS", () => {
	it("has the 8 reference systems", () => {
		expect(AYANAMSHA_SYSTEMS.map((s) => s.key)).toEqual([
			"tropical",
			"lahiri",
			"raman",
			"kp",
			"yukteshwar",
			"faganbradley",
			"truechitra",
			"truepushya",
		]);
	});

	it("tropical is always zero, others in [0, 360)", () => {
		for (const s of AYANAMSHA_SYSTEMS) {
			const v = s.calc(JD_2026_06_29);
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(360);
		}
		expect(ayanamshaSystem("tropical").calc(JD_2026_06_29)).toBe(0);
	});

	it("lahiri entry matches lahiriAyanamshaDeg and sits near 24.25° in 2026", () => {
		const v = ayanamshaSystem("lahiri").calc(JD_2026_06_29);
		expect(v).toBe(lahiriAyanamshaDeg(JD_2026_06_29));
		expect(v).toBeGreaterThan(24);
		expect(v).toBeLessThan(24.5);
	});

	it("falls back to lahiri for unknown keys", () => {
		// @ts-expect-error intentionally invalid key
		expect(ayanamshaSystem("nope").key).toBe("lahiri");
	});
});
