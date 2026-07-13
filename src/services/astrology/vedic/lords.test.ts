import { describe, expect, it } from "vitest";

import { nakshatraFromSiderealLongitude } from "./nakshatra";
import { rashiFromSiderealLongitude } from "./rashi";
import { ascLord, nakshatraLord, rasiLord, starLord } from "./lords";

describe("rasiLord", () => {
  it("Aries is ruled by Mars, Taurus by Venus (classical assignments)", () => {
    expect(rasiLord(rashiFromSiderealLongitude(15))).toBe("Mars");
    expect(rasiLord(rashiFromSiderealLongitude(45))).toBe("Venus");
  });

  it("Sagittarius (Moon's rashi in the reference chart) is ruled by Jupiter", () => {
    expect(rasiLord(rashiFromSiderealLongitude(255))).toBe("Jupiter");
  });

  it("ascLord is the same lookup as rasiLord", () => {
    expect(ascLord).toBe(rasiLord);
  });
});

describe("nakshatraLord / starLord", () => {
  it("Ashwini (index 0) is ruled by Ketu, the first planet in the Vimshottari sequence", () => {
    expect(nakshatraLord(0)).toBe("Ketu");
  });

  it("cycles through all 9 Vimshottari lords across the 27 nakshatras", () => {
    expect(nakshatraLord(9)).toBe("Ketu"); // 9 % 9 === 0, cycle repeats
    expect(nakshatraLord(26)).toBe("Mercury"); // 26 % 9 === 8, last in the 9-cycle
  });

  it("Mula (index 18, the reference chart's Moon nakshatra) is ruled by Ketu", () => {
    // 18 % 9 === 0
    expect(nakshatraLord(18)).toBe("Ketu");
  });

  it("starLord matches nakshatraLord for an actual placement", () => {
    const nakshatra = nakshatraFromSiderealLongitude(247); // falls in Mula
    expect(starLord(nakshatra)).toBe(nakshatraLord(nakshatra.index));
  });
});
