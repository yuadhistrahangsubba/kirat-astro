import { cn } from "@/lib/utils";

export interface ChartPlacement {
  abbreviation: string;
  /** 0-11, Aries=0 ... Pisces=11 (i.e. `ZodiacPlacement.signIndex`). */
  signIndex: number;
}

interface NorthIndianChartProps {
  title: string;
  placements: readonly ChartPlacement[];
  /** 0-11 — the box housing this sign gets a small "Asc" marker. */
  ascendantSignIndex?: number;
  className?: string;
}

type Point = readonly [number, number];

/**
 * The classical North Indian chart: an outer square, a diamond connecting
 * the midpoints of its sides, and both of the square's corner-to-corner
 * diagonals. That produces 12 fixed regions — 4 "kite" quadrilaterals
 * (touching the top/right/bottom/left edge midpoints) and 8 corner
 * triangles — and each region is a FIXED rashi (Aries=1 ... Pisces=12) in
 * every North Indian chart, regardless of the Ascendant; only which
 * grahas fall in which box changes.
 *
 * This exact box layout — which rashi number lands in which of the 12
 * regions — was reverse-engineered pixel-by-pixel from AstroSage's own
 * reference chart (real birth data, cross-checked against every
 * non-empty box: Scorpio->8, Sagittarius->9, Gemini->3, Aries->1,
 * Taurus->2, Capricorn->10, Aquarius->11 all matched), not assumed from
 * memory — North Indian house-drawing conventions vary enough between
 * software that this was worth verifying against a real fixture.
 */
const TL: Point = [0, 0];
const TR: Point = [400, 0];
const BR: Point = [400, 400];
const BL: Point = [0, 400];
const TM: Point = [200, 0];
const RM: Point = [400, 200];
const BM: Point = [200, 400];
const LM: Point = [0, 200];
const O: Point = [200, 200];
const A: Point = [100, 100];
const B: Point = [300, 100];
const C: Point = [300, 300];
const D: Point = [100, 300];

interface BoxDef {
  points: readonly Point[];
  /** The vertex nearest the box's number label — the shared crossing point for corner triangles, the center for kites. */
  inner: Point;
}

/** Keyed by rashi number, 1 = Aries ... 12 = Pisces. */
const BOXES: Record<number, BoxDef> = {
  1: { points: [BR, BM, C], inner: C },
  2: { points: [RM, BR, C], inner: C },
  3: { points: [O, B, RM, C], inner: O },
  4: { points: [TR, RM, B], inner: B },
  5: { points: [TM, TR, B], inner: B },
  6: { points: [O, A, TM, B], inner: O },
  7: { points: [TL, TM, A], inner: A },
  8: { points: [TL, A, LM], inner: A },
  9: { points: [O, A, LM, D], inner: O },
  10: { points: [BL, LM, D], inner: D },
  11: { points: [BL, D, BM], inner: D },
  12: { points: [O, C, BM, D], inner: O },
};

function centroid(points: readonly Point[]): Point {
  const [sx, sy] = points.reduce(([ax, ay], [x, y]) => [ax + x, ay + y], [0, 0]);
  return [sx / points.length, sy / points.length];
}

function lerp(from: Point, to: Point, t: number): Point {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
}

const LINE_HEIGHT = 24;

export function NorthIndianChart({ title, placements, ascendantSignIndex, className }: NorthIndianChartProps) {
  const byBox = new Map<number, ChartPlacement[]>();
  for (const placement of placements) {
    const rashiNumber = placement.signIndex + 1;
    const list = byBox.get(rashiNumber) ?? [];
    list.push(placement);
    byBox.set(rashiNumber, list);
  }
  const ascendantBox = ascendantSignIndex !== undefined ? ascendantSignIndex + 1 : undefined;

  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <svg viewBox="0 0 400 400" className="w-full max-w-[22rem]" role="img" aria-label={title}>
        <rect x="1" y="1" width="398" height="398" fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
        {(
          [
            [TM, LM],
            [TM, RM],
            [RM, BM],
            [BM, LM],
            [TL, BR],
            [TR, BL],
          ] as const
        ).map(([[x1, y1], [x2, y2]], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" className="text-border" />
        ))}

        {Array.from({ length: 12 }, (_, i) => i + 1).map((rashiNumber) => {
          const box = BOXES[rashiNumber]!;
          const boxCentroid = centroid(box.points);
          const numberPos = lerp(box.inner, boxCentroid, 0.3);
          const stackAnchor = lerp(box.inner, boxCentroid, 0.68);
          const bodies = byBox.get(rashiNumber) ?? [];
          const isAscendant = rashiNumber === ascendantBox;
          const firstLineY = stackAnchor[1] - ((bodies.length - 1) * LINE_HEIGHT) / 2 + (isAscendant ? LINE_HEIGHT * 0.6 : 0);

          return (
            <g key={rashiNumber}>
              <text
                x={numberPos[0]}
                y={numberPos[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground/60 font-dense"
                fontSize="13"
              >
                {rashiNumber}
              </text>
              {isAscendant && (
                <text
                  x={stackAnchor[0]}
                  y={firstLineY - LINE_HEIGHT * 0.9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gold font-dense font-bold uppercase"
                  fontSize="11"
                  letterSpacing="1.5"
                >
                  Asc
                </text>
              )}
              {bodies.map((body, i) => (
                <text
                  key={body.abbreviation + i}
                  x={stackAnchor[0]}
                  y={firstLineY + i * LINE_HEIGHT}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-sans font-semibold"
                  fontSize="17"
                >
                  {body.abbreviation}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-3 font-dense text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {title}
      </figcaption>
    </figure>
  );
}
