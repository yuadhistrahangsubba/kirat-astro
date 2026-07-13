import { describe, expect, it } from "vitest";

import { MeeusEphemerisProvider } from "./provider";

describe("MeeusEphemerisProvider", () => {
  const provider = new MeeusEphemerisProvider();

  it("delegates sun and moon to their real implementations", () => {
    const jd = 2451545.0;
    expect(provider.getPosition("sun", jd).longitudeDegrees).toBeGreaterThanOrEqual(0);
    expect(provider.getPosition("moon", jd).longitudeDegrees).toBeGreaterThanOrEqual(0);
  });

  it("delegates every other body to astronomy-engine with a valid normalized longitude", () => {
    const others = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"] as const;
    for (const body of others) {
      const position = provider.getPosition(body, 2451545.0);
      expect(position.longitudeDegrees).toBeGreaterThanOrEqual(0);
      expect(position.longitudeDegrees).toBeLessThan(360);
    }
  });

  it("still throws for a genuinely unknown body", () => {
    expect(() => provider.getPosition("rahu" as never, 2451545.0)).toThrow();
  });
});
