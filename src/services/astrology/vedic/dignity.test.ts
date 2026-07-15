import { describe, expect, it } from "vitest";

import { classifyDignity, debilitationOf, EXALTATION } from "./dignity";

describe("classifyDignity", () => {
  it("recognizes exaltation", () => {
    expect(classifyDignity("Sun", 0)).toBe("exalted"); // Aries
    expect(classifyDignity("Moon", 1)).toBe("exalted"); // Taurus
    expect(classifyDignity("Mars", 9)).toBe("exalted"); // Capricorn
    expect(classifyDignity("Jupiter", 3)).toBe("exalted"); // Cancer
    expect(classifyDignity("Venus", 11)).toBe("exalted"); // Pisces
    expect(classifyDignity("Saturn", 6)).toBe("exalted"); // Libra
  });

  it("recognizes debilitation as exactly opposite the exaltation sign", () => {
    expect(classifyDignity("Sun", 6)).toBe("debilitated"); // Libra
    expect(classifyDignity("Moon", 7)).toBe("debilitated"); // Scorpio
    expect(classifyDignity("Mars", 3)).toBe("debilitated"); // Cancer
    expect(classifyDignity("Jupiter", 9)).toBe("debilitated"); // Capricorn
    expect(classifyDignity("Venus", 5)).toBe("debilitated"); // Virgo
    expect(classifyDignity("Saturn", 0)).toBe("debilitated"); // Aries
  });

  it("recognizes own sign", () => {
    expect(classifyDignity("Sun", 4)).toBe("own"); // Leo
    expect(classifyDignity("Moon", 3)).toBe("own"); // Cancer
    expect(classifyDignity("Mars", 0)).toBe("own"); // Aries
    expect(classifyDignity("Mars", 7)).toBe("own"); // Scorpio
  });

  it("reports Mercury's exaltation-in-own-sign coincidence (Virgo) as exalted, not merely own", () => {
    expect(classifyDignity("Mercury", 5)).toBe("exalted"); // Virgo
    expect(classifyDignity("Mercury", 2)).toBe("own"); // Gemini has no such coincidence
  });

  it("falls back to Naisargika friendship with the occupied sign's lord", () => {
    // Sun in Taurus (Venus's sign) — Sun/Venus are permanent enemies.
    expect(classifyDignity("Sun", 1)).toBe("enemy");
    // Sun in Cancer (Moon's sign) — Sun/Moon are permanent friends.
    expect(classifyDignity("Sun", 3)).toBe("friendly");
    // Sun in Gemini (Mercury's sign) — Sun/Mercury are neutral.
    expect(classifyDignity("Sun", 2)).toBe("neutral");
  });

  it("treats Rahu/Ketu as neutral rather than guessing a contested dignity", () => {
    expect(classifyDignity("Rahu", 0)).toBe("neutral");
    expect(classifyDignity("Ketu", 4)).toBe("neutral");
  });

  it("debilitationOf is always exactly 6 signs from EXALTATION", () => {
    for (const planet of Object.keys(EXALTATION) as (keyof typeof EXALTATION)[]) {
      const exaltedSign = EXALTATION[planet].signIndex;
      const debilitatedSign = debilitationOf(planet).signIndex;
      expect((debilitatedSign - exaltedSign + 12) % 12).toBe(6);
    }
  });
});
