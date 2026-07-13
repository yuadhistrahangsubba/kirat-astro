import { describe, expect, it } from "vitest";

import { navamsaFromSiderealLongitude } from "./navamsa";

describe("navamsaFromSiderealLongitude", () => {
  it("Aries pada 9 (movable, starts in itself) lands in Sagittarius", () => {
    // Aries = signIndex 0, movable → offset 0. Pada 9 = index 8.
    // navamsaSignIndex = (0 + 0 + 8) % 12 = 8 = Sagittarius.
    const result = navamsaFromSiderealLongitude(29); // last pada of Aries (0-30deg)
    expect(result.signName).toBe("Sagittarius");
  });

  it("Aries pada 1 (movable, starts in itself) lands in Aries", () => {
    const result = navamsaFromSiderealLongitude(1);
    expect(result.signName).toBe("Aries");
  });

  it("Taurus pada 1 (fixed, starts 9th from itself) lands in Capricorn", () => {
    // Taurus = signIndex 1, fixed → offset 8. Pada 1 = index 0.
    // navamsaSignIndex = (1 + 8 + 0) % 12 = 9 = Capricorn.
    const result = navamsaFromSiderealLongitude(31);
    expect(result.signName).toBe("Capricorn");
  });

  it("Gemini pada 1 (dual, starts 5th from itself) lands in Libra", () => {
    // Gemini = signIndex 2, dual → offset 4. Pada 1 = index 0.
    // navamsaSignIndex = (2 + 4 + 0) % 12 = 6 = Libra.
    const result = navamsaFromSiderealLongitude(61);
    expect(result.signName).toBe("Libra");
  });

  it("wraps around the zodiac boundary correctly", () => {
    // Pisces (signIndex 11, dual, offset 4) pada 9 (index 8):
    // navamsaSignIndex = (11 + 4 + 8) % 12 = 23 % 12 = 11 = Pisces.
    const result = navamsaFromSiderealLongitude(359);
    expect(result.signName).toBe("Pisces");
  });

  it("returns a placement with 0 degreesInSign, since Navamsa only records the sign", () => {
    const result = navamsaFromSiderealLongitude(15);
    expect(result.degreesInSign).toBe(0);
  });
});
