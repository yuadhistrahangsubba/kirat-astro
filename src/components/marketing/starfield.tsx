"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { seededRange } from "@/lib/deterministic-random";

const STAR_COUNT = 60;

interface Star {
  top: number;
  left: number;
  size: number;
  delay: number;
  stiffness: number;
}

/**
 * A fixed field of twinkling stars. Only opacity is animated (compositor-
 * cheap) and every star shares one spring config, so the cost stays flat
 * no matter how many are on screen.
 */
export function Starfield() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: STAR_COUNT }, (_, i) => ({
        top: seededRange(i * 3.1, 0, 100),
        left: seededRange(i * 7.7, 0, 100),
        size: seededRange(i * 5.3, 1, 2.5),
        delay: seededRange(i * 2.2, 0, 4),
        stiffness: seededRange(i * 9.4, 8, 20),
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-3] overflow-hidden">
      {stars.map((star, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{ top: `${star.top}%`, left: `${star.left}%`, width: star.size, height: star.size }}
          initial={{ opacity: 0.15 }}
          animate={reducedMotion ? { opacity: 0.4 } : { opacity: [0.15, 0.9] }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: star.stiffness,
                  damping: 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: star.delay,
                }
          }
        />
      ))}
    </div>
  );
}
