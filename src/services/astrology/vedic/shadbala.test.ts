import { describe, expect, it } from "vitest";

import { calculateBasicShadbala, NAISARGIKA_BALA, rankByShadbala } from "./shadbala";

describe("calculateBasicShadbala — Uccha Bala", () => {
  it("is 0 exactly at the debilitation point", () => {
    // Sun debilitates at Libra 10 deg = 190 absolute degrees.
    const result = calculateBasicShadbala("Sun", 190);
    expect(result.uchchaBala).toBe(0);
  });

  it("is 60 exactly at the exaltation point", () => {
    // Sun exalts at Aries 10 deg = 10 absolute degrees.
    const result = calculateBasicShadbala("Sun", 10);
    expect(result.uchchaBala).toBe(60);
  });

  it("is 30 exactly halfway between debilitation and exaltation", () => {
    const result = calculateBasicShadbala("Sun", 100);
    expect(result.uchchaBala).toBe(30);
  });
});

describe("calculateBasicShadbala — Dig Bala", () => {
  it("is 60 in the planet's strong house and 0 in the exactly opposite (weak) house", () => {
    expect(calculateBasicShadbala("Sun", 10, 10).digBala).toBe(60); // Sun strong in house 10
    expect(calculateBasicShadbala("Sun", 10, 4).digBala).toBe(0); // house 4 is opposite
    expect(calculateBasicShadbala("Saturn", 190, 7).digBala).toBe(60); // Saturn strong in house 7
    expect(calculateBasicShadbala("Saturn", 190, 1).digBala).toBe(0); // house 1 is opposite
  });

  it("is 0 (not guessed) when no house is given", () => {
    expect(calculateBasicShadbala("Jupiter", 58).digBala).toBe(0);
  });

  it("scales linearly with house-distance from the strong house", () => {
    // Sun strong in house 10; house 1 is 3 houses away (10->11->12->1).
    expect(calculateBasicShadbala("Sun", 10, 1).digBala).toBe(30);
  });
});

describe("calculateBasicShadbala — Naisargika Bala and totals", () => {
  it("matches the fixed classical natural-strength table", () => {
    expect(NAISARGIKA_BALA.Sun).toBe(60);
    expect(NAISARGIKA_BALA.Saturn).toBeCloseTo(8.57, 2);
  });

  it("totals are the sum of all three components", () => {
    const result = calculateBasicShadbala("Sun", 10, 10); // uccha 60, dig 60, naisargika 60
    expect(result.totalShashtiamsa).toBe(180);
    expect(result.totalRupas).toBe(3);
    expect(result.scope).toBe("basic");
    expect(result.system).toBe("Parashari");
  });
});

describe("rankByShadbala", () => {
  it("orders grahas strongest-first by total shashtiamsa", () => {
    const results = {
      Sun: calculateBasicShadbala("Sun", 10, 10), // very strong
      Moon: calculateBasicShadbala("Moon", 33, 4), // decently strong
      Mars: calculateBasicShadbala("Mars", 100, 4), // weak placement
      Mercury: calculateBasicShadbala("Mercury", 100, 4),
      Jupiter: calculateBasicShadbala("Jupiter", 95, 4),
      Venus: calculateBasicShadbala("Venus", 100, 4),
      Saturn: calculateBasicShadbala("Saturn", 10, 1), // Saturn at its own debilitation & weak house
    };

    const ranking = rankByShadbala(results);
    expect(ranking[0]).toBe("Sun");
    expect(ranking[ranking.length - 1]).toBe("Saturn");
  });
});
