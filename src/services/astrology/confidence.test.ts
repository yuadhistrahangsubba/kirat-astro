import { describe, expect, it } from "vitest";

import { assessBoundaryConfidence } from "./confidence";

describe("assessBoundaryConfidence", () => {
  it("is boundary-sensitive right at the start of a unit", () => {
    const result = assessBoundaryConfidence(0.1, 3 + 1 / 3);
    expect(result.confidence).toBe("boundary-sensitive");
    expect(result.degreesFromNearestBoundary).toBeCloseTo(0.1, 2);
  });

  it("is boundary-sensitive right at the end of a unit", () => {
    const span = 3 + 1 / 3;
    const result = assessBoundaryConfidence(span - 0.1, span);
    expect(result.confidence).toBe("boundary-sensitive");
    expect(result.degreesFromNearestBoundary).toBeCloseTo(0.1, 2);
  });

  it("is high confidence comfortably mid-unit", () => {
    const span = 3 + 1 / 3;
    const result = assessBoundaryConfidence(span / 2, span);
    expect(result.confidence).toBe("high");
    expect(result.degreesFromNearestBoundary).toBeCloseTo(span / 2, 2);
  });

  it("respects a custom sensitivity threshold", () => {
    const result = assessBoundaryConfidence(1, 30, 2);
    expect(result.confidence).toBe("boundary-sensitive");
  });
});
