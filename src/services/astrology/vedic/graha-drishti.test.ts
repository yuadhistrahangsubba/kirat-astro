import { describe, expect, it } from "vitest";

import { calculateNatalAspects, housesAspectedBy, planetsAspecting } from "./graha-drishti";

const numeric = (a: number, b: number) => a - b;

describe("housesAspectedBy", () => {
  it("gives every graha the universal 7th-house (opposition) aspect", () => {
    expect(housesAspectedBy("Sun", 1)).toEqual([7]);
    expect(housesAspectedBy("Venus", 5)).toEqual([11]);
  });

  it("gives Mars its 4th and 8th special aspects in addition to the 7th", () => {
    expect(housesAspectedBy("Mars", 1).sort(numeric)).toEqual([4, 7, 8]);
  });

  it("gives Jupiter its 5th and 9th special aspects in addition to the 7th", () => {
    expect(housesAspectedBy("Jupiter", 1).sort(numeric)).toEqual([5, 7, 9]);
  });

  it("gives Saturn its 3rd and 10th special aspects in addition to the 7th", () => {
    expect(housesAspectedBy("Saturn", 1).sort(numeric)).toEqual([3, 7, 10]);
  });

  it("wraps correctly from a house near the end of the zodiac", () => {
    // Mars in house 10: 7th->4, 4th-special->1, 8th-special->5.
    expect(housesAspectedBy("Mars", 10).sort(numeric)).toEqual([1, 4, 5]);
  });
});

describe("calculateNatalAspects + planetsAspecting", () => {
  it("collects aspects from every placed planet and can be queried per target house", () => {
    const aspects = calculateNatalAspects({ Mars: 1, Saturn: 1, Sun: 4 });
    // Mars(1) -> 4,7,8; Saturn(1) -> 3,7,10; Sun(4) -> 10
    expect(planetsAspecting(aspects, 7).sort()).toEqual(["Mars", "Saturn"]);
    expect(planetsAspecting(aspects, 4)).toEqual(["Mars"]);
    expect(planetsAspecting(aspects, 10).sort()).toEqual(["Saturn", "Sun"]);
    expect(planetsAspecting(aspects, 2)).toEqual([]);
  });

  it("skips planets with no known house", () => {
    const aspects = calculateNatalAspects({ Sun: 1, Moon: undefined });
    expect(aspects.every((a) => a.from !== "Moon")).toBe(true);
  });
});
