export type BoundaryConfidence = "high" | "boundary-sensitive";

export interface BoundaryConfidenceResult {
  confidence: BoundaryConfidence;
  degreesFromNearestBoundary: number;
}

const DEFAULT_SENSITIVE_THRESHOLD_DEGREES = 0.5;

/**
 * How close a value sits to either edge of the unit that contains it (a
 * zodiac sign, a nakshatra pada, etc.) — used so a placement right on
 * top of a boundary can be flagged as boundary-sensitive rather than
 * reported with the same unearned confidence as one placed mid-unit.
 * This matters most for the Moon's nakshatra pada, since that single
 * value decides the starting Vimshottari Dasha lord (see `index.ts`'s
 * `dashaConfidence` field, the one place this is currently wired in).
 *
 * `positionWithinUnit` and `unitSpanDegrees` must be in the same units
 * (both degrees, e.g. degrees into the current pada and the pada's
 * 3°20' span).
 */
export function assessBoundaryConfidence(
  positionWithinUnit: number,
  unitSpanDegrees: number,
  sensitiveThresholdDegrees = DEFAULT_SENSITIVE_THRESHOLD_DEGREES,
): BoundaryConfidenceResult {
  const distance = Math.min(positionWithinUnit, unitSpanDegrees - positionWithinUnit);
  return {
    degreesFromNearestBoundary: Math.round(distance * 100) / 100,
    confidence: distance < sensitiveThresholdDegrees ? "boundary-sensitive" : "high",
  };
}
