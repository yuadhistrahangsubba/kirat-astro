import { describe, expect, it } from "vitest";

import { computeChart } from "./index";
import { grahaLongitudesAt, grahaLongitudesFromChart } from "./sky-positions";

describe("grahaLongitudesAt", () => {
  it("matches computeChart's sidereal positions for the same instant", () => {
    const chart = computeChart({
      birthDate: "1998-04-12",
      birthTime: "06:00",
      timezone: "UTC",
      latitude: 27.47,
      longitude: 89.64,
    });
    const fromChart = grahaLongitudesFromChart(chart);
    const direct = grahaLongitudesAt(new Date("1998-04-12T06:00:00Z"));
    for (const key of Object.keys(fromChart) as (keyof typeof fromChart)[]) {
      expect(direct[key]).toBeCloseTo(fromChart[key], 4);
    }
  });

  it("keeps Ketu opposite Rahu", () => {
    const { rahu, ketu } = grahaLongitudesAt(new Date("2026-10-31T00:00:00Z"));
    expect((ketu - rahu + 360) % 360).toBeCloseTo(180, 6);
  });
});
