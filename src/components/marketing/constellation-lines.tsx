"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { seededRange } from "@/lib/deterministic-random";

const POINT_COUNT = 8;
const EXTRA_LINKS: Array<[number, number]> = [
  [1, 5],
  [2, 6],
];

interface ConstellationLinesProps {
  className?: string;
}

/**
 * A faint constellation, drawn stroke-by-stroke as it scrolls into view —
 * Motion's pathLength animation, no raster assets. Points are deterministic
 * so server and client render the same markup.
 */
export function ConstellationLines({ className }: ConstellationLinesProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const points = useMemo(
    () =>
      Array.from({ length: POINT_COUNT }, (_, i) => ({
        x: seededRange(i * 11.3, 40, 760),
        y: seededRange(i * 17.9, 30, 470),
      })),
    [],
  );

  const chain = points.slice(1).map((p, i) => ({ from: points[i]!, to: p }));
  const links = [
    ...chain,
    ...EXTRA_LINKS.map(([a, b]) => ({ from: points[a]!, to: points[b]! })),
  ];

  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {links.map((link, i) => (
        <motion.line
          key={i}
          x1={link.from.x}
          y1={link.from.y}
          x2={link.to.x}
          y2={link.to.y}
          stroke="var(--color-aurora-cyan)"
          strokeOpacity={0.35}
          strokeWidth={1}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={reducedMotion ? { opacity: 0.35, pathLength: 1 } : { pathLength: 1, opacity: 0.35 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 40, damping: 16, delay: i * 0.15 }}
        />
      ))}
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill="var(--color-gold)"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.3 + i * 0.08 }}
        />
      ))}
    </svg>
  );
}
