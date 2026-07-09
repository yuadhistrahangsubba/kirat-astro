"use client";

import { motion } from "motion/react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface MoonPhaseProps {
  size?: number;
  className?: string;
}

/**
 * A waxing crescent, built from two overlapping circles (no image asset).
 * The halo behind it breathes slowly — Calm/Headspace-style ambient
 * motion, scale + opacity only.
 */
export function MoonPhase({ size = 64, className }: MoonPhaseProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-gold/25 blur-lg"
        animate={reducedMotion ? undefined : { scale: [1, 1.15], opacity: [0.5, 0.9] }}
        transition={{ type: "spring", stiffness: 8, damping: 5, repeat: Infinity, repeatType: "mirror" }}
      />
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative" aria-hidden="true">
        <circle cx="50" cy="50" r="42" fill="var(--color-gold)" />
        <circle cx="66" cy="42" r="38" fill="var(--background)" />
      </svg>
    </div>
  );
}
