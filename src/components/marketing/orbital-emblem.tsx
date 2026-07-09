import { cn } from "@/lib/utils";

interface OrbitalEmblemProps {
  size?: "sm" | "lg";
  className?: string;
}

const TICK_COUNT = 24;
const TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = (i * 360) / TICK_COUNT;
  const rad = (angle * Math.PI) / 180;
  const outer = 190;
  const inner = i % 6 === 0 ? 172 : 181; // longer tick every quarter turn
  return {
    x1: 200 + outer * Math.sin(rad),
    y1: 200 - outer * Math.cos(rad),
    x2: 200 + inner * Math.sin(rad),
    y2: 200 - inner * Math.cos(rad),
    major: i % 6 === 0,
  };
});

/**
 * A hand-drawn instrument mark, not a zodiac wheel — three orbiting bodies
 * on hairline rings with a watch-bezel tick scale. Rotation speeds are
 * intentionally slow (90s/140s/220s) so it reads as ambient, not decorative.
 */
export function OrbitalEmblem({ size = "lg", className }: OrbitalEmblemProps) {
  const dimension = size === "lg" ? 560 : 28;

  return (
    <svg
      viewBox="0 0 400 400"
      width={dimension}
      height={dimension}
      className={cn("text-gold", className)}
      aria-hidden="true"
    >
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeOpacity="0.18" fill="none" />
      <circle cx="200" cy="200" r="140" stroke="currentColor" strokeOpacity="0.14" fill="none" />
      <circle cx="200" cy="200" r="90" stroke="currentColor" strokeOpacity="0.22" fill="none" />

      {TICKS.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="currentColor"
          strokeWidth={t.major ? 1.5 : 0.75}
          strokeOpacity={t.major ? 0.5 : 0.25}
        />
      ))}

      <g className="animate-orbit-slow">
        <circle cx="200" cy="10" r="4" fill="currentColor" opacity="0.9" />
      </g>
      <g className="animate-orbit-slower">
        <circle cx="200" cy="60" r="3" fill="currentColor" opacity="0.75" />
      </g>
      <g className="animate-orbit-slowest">
        <circle cx="200" cy="110" r="2.5" fill="currentColor" opacity="0.6" />
      </g>

      <circle cx="200" cy="200" r="2" fill="currentColor" />
    </svg>
  );
}
