import { describe, expect, it } from "vitest";

import { getKiratDate } from "./kirat-rules";

describe("getKiratDate", () => {
  it("matches known Kirat dates from the reference panchanga data", () => {
    expect(getKiratDate(2026, 6, 1)).toBe(18); // Kapmeppa 18, 5087
    expect(getKiratDate(2026, 6, 29)).toBe(15); // Thakmeppa 15, 5087
    expect(getKiratDate(2026, 6, 30)).toBe(16); // Thakmeppa 16, 5087
    expect(getKiratDate(2026, 7, 1)).toBe(17); // Thakmeppa 17, 5087
  });

  it("returns an empty string for years outside the supported range", () => {
    expect(getKiratDate(1999, 1, 1)).toBe("");
    expect(getKiratDate(2101, 1, 1)).toBe("");
  });

  it("covers years the legacy 2000-2051 table did not", () => {
    expect(typeof getKiratDate(2052, 1, 1)).toBe("number");
    expect(typeof getKiratDate(2100, 12, 31)).toBe("number");
  });
});
