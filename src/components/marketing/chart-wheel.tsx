"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { round } from "@/lib/deterministic-random";
import { cn } from "@/lib/utils";

interface ChartWheelProps {
  size?: "sm" | "lg";
  className?: string;
}

const CENTER = 200;
const TICK_COUNT = 24;
const HOUSE_COUNT = 12;

const PLANETS = [
  { glyph: "☉", name: "Sun", angle: 20, radius: 130 },
  { glyph: "☽", name: "Moon", angle: 95, radius: 108 },
  { glyph: "♂", name: "Mars", angle: 160, radius: 142 },
  { glyph: "♃", name: "Jupiter", angle: 235, radius: 118 },
  { glyph: "♀", name: "Venus", angle: 305, radius: 138 },
] as const;

// Rounded to 3 decimals — SVG coordinates don't need more, and it clears
// the cross-engine floating-point noise floor that trips up hydration
// (see deterministic-random.ts for why Math.sin/cos need this).
function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: round(CENTER + radius * Math.sin(rad), 3),
    y: round(CENTER - radius * Math.cos(rad), 3),
  };
}

/**
 * The illustrative birth-chart wheel — houses fixed, outer zodiac ring
 * slowly turning (the sky moves, the chart doesn't). Hover a planet to
 * see its name. This is a stand-in visual: no real ephemeris data is
 * plotted here, see services/astrology for the actual calculation seam.
 */
export function ChartWheel({ size = "lg", className }: ChartWheelProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [active, setActive] = useState<number | null>(null);
  const dimension = size === "lg" ? 560 : 28;

  const ticks = useMemo(
    () =>
      Array.from({ length: TICK_COUNT }, (_, i) => {
        const angle = (i * 360) / TICK_COUNT;
        const major = i % 6 === 0;
        return { ...polar(angle, 190), inner: polar(angle, major ? 172 : 181), major };
      }),
    [],
  );

  const houseLines = useMemo(
    () =>
      Array.from({ length: HOUSE_COUNT }, (_, i) => {
        const angle = (i * 360) / HOUSE_COUNT;
        return { from: polar(angle, 90), to: polar(angle, 165) };
      }),
    [],
  );

  return (
    <svg
      viewBox="0 0 400 400"
      width={dimension}
      height={dimension}
      className={cn("text-gold", className)}
      aria-label={size === "lg" ? "Illustrative Vedic birth chart wheel" : undefined}
      aria-hidden={size === "sm" || undefined}
    >
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={reducedMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={CENTER} cy={CENTER} r="190" stroke="currentColor" strokeOpacity="0.18" fill="none" />
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x}
            y1={t.y}
            x2={t.inner.x}
            y2={t.inner.y}
            stroke="currentColor"
            strokeWidth={t.major ? 1.5 : 0.75}
            strokeOpacity={t.major ? 0.5 : 0.25}
          />
        ))}
      </motion.g>

      <motion.circle
        cx={CENTER}
        cy={CENTER}
        r="165"
        stroke="var(--color-aurora-cyan)"
        strokeOpacity="0.25"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ type: "spring", stiffness: 30, damping: 16 }}
      />
      <circle cx={CENTER} cy={CENTER} r="90" stroke="currentColor" strokeOpacity="0.22" fill="none" />

      {houseLines.map((h, i) => (
        <motion.line
          key={i}
          x1={h.from.x}
          y1={h.from.y}
          x2={h.to.x}
          y2={h.to.y}
          stroke="currentColor"
          strokeOpacity="0.2"
          strokeWidth={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ type: "spring", stiffness: 50, damping: 18, delay: i * 0.04 }}
        />
      ))}

      {size === "lg" &&
        PLANETS.map((planet, i) => {
          const pos = polar(planet.angle, planet.radius);
          const isActive = active === i;
          return (
            <g
              key={planet.name}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer"
            >
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 12 : 9}
                fill="var(--color-ink)"
                stroke="var(--color-gold)"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.6 + i * 0.1 }}
              />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize={13} fill="var(--color-gold-bright)">
                {planet.glyph}
              </text>
              <AnimatePresence>
                {isActive && (
                  <motion.g
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <rect
                      x={pos.x - 26}
                      y={pos.y - 34}
                      width={52}
                      height={20}
                      rx={6}
                      fill="var(--color-ink)"
                      stroke="var(--color-gold)"
                      strokeOpacity={0.4}
                    />
                    <text x={pos.x} y={pos.y - 20} textAnchor="middle" fontSize={11} fill="var(--foreground)">
                      {planet.name}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

      <circle cx={CENTER} cy={CENTER} r="2" fill="currentColor" />
    </svg>
  );
}
