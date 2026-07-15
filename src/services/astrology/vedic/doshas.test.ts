import { describe, expect, it } from "vitest";

import { checkKalsarpaDosha, checkManglikDosha } from "./doshas";

describe("checkManglikDosha", () => {
  it("flags Mars in a Manglik house from the Moon", () => {
    const result = checkManglikDosha(3, 0); // Mars in Cancer(3), Moon in Aries(0) -> house 4 from Moon
    expect(result.isManglik).toBe(true);
    expect(result.presentIn).toEqual(["moon"]);
    expect(result.marsHouseFromMoon).toBe(4);
    expect(result.marsHouseFromLagna).toBeUndefined();
  });

  it("is not present when Mars misses the Manglik houses in every available frame", () => {
    const result = checkManglikDosha(2, 0, 5); // Mars house 3 from Moon, house 10 from Lagna
    expect(result.isManglik).toBe(false);
    expect(result.presentIn).toEqual([]);
  });

  it("can flag both frames at once when an ascendant is supplied", () => {
    const result = checkManglikDosha(3, 0, 3); // Mars house 4 from Moon, house 1 from Lagna
    expect(result.isManglik).toBe(true);
    expect(result.presentIn.sort()).toEqual(["lagna", "moon"]);
  });

  it("omits the Lagna frame entirely when no ascendant is known", () => {
    const result = checkManglikDosha(7, 0); // Mars house 8 from Moon
    expect(result.marsHouseFromLagna).toBeUndefined();
    expect(result.presentIn).toEqual(["moon"]);
  });
});

describe("checkKalsarpaDosha", () => {
  const grahas = (values: Record<string, number>) => values as never;

  it("detects Kalsarpa when every graha falls in the Rahu-to-Ketu arc", () => {
    const result = checkKalsarpaDosha(
      grahas({ Sun: 150, Moon: 160, Mars: 170, Mercury: 180, Jupiter: 190, Venus: 200, Saturn: 210 }),
      100,
      280,
    );
    expect(result.isKalsarpa).toBe(true);
    expect(result.arc).toBe("rahu-to-ketu");
  });

  it("detects Kalsarpa when every graha falls in the Ketu-to-Rahu arc", () => {
    const result = checkKalsarpaDosha(
      grahas({ Sun: 300, Moon: 310, Mars: 320, Mercury: 330, Jupiter: 340, Venus: 350, Saturn: 10 }),
      100,
      280,
    );
    expect(result.isKalsarpa).toBe(true);
    expect(result.arc).toBe("ketu-to-rahu");
  });

  it("is not present when at least one graha sits outside the arc the others share", () => {
    const result = checkKalsarpaDosha(
      grahas({ Sun: 150, Moon: 160, Mars: 170, Mercury: 180, Jupiter: 190, Venus: 200, Saturn: 350 }),
      100,
      280,
    );
    expect(result.isKalsarpa).toBe(false);
    expect(result.arc).toBeUndefined();
  });

  it("names the type from Rahu's Lagna house only when Kalsarpa is present and the house is given", () => {
    const result = checkKalsarpaDosha(
      grahas({ Sun: 150, Moon: 160, Mars: 170, Mercury: 180, Jupiter: 190, Venus: 200, Saturn: 210 }),
      100,
      280,
      5,
    );
    expect(result.typeName).toBe("Padma");
  });

  it("omits the type name when Kalsarpa is not present, even if a house is given", () => {
    const result = checkKalsarpaDosha(
      grahas({ Sun: 150, Moon: 160, Mars: 170, Mercury: 180, Jupiter: 190, Venus: 200, Saturn: 350 }),
      100,
      280,
      5,
    );
    expect(result.typeName).toBeUndefined();
  });
});
