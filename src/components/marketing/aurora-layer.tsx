"use client";

import { motion } from "motion/react";

import { useMediaQuery } from "@/hooks/use-media-query";

const BLOBS = [
  { color: "var(--color-aurora-violet)", top: "-10%", left: "-10%", size: 620, range: 60, stiffness: 6 },
  { color: "var(--color-aurora-cyan)", top: "10%", left: "60%", size: 520, range: 50, stiffness: 5 },
  { color: "var(--color-aurora-magenta)", top: "55%", left: "5%", size: 560, range: 55, stiffness: 4.5 },
] as const;

/**
 * Three large, heavily blurred gradient blobs that drift slowly — the
 * aurora. Blur radius and opacity are static (expensive to animate);
 * only `transform` moves, and only three elements exist, so the
 * compositor cost stays negligible regardless of how busy the rest of
 * the page is.
 */
export function AuroraLayer() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-4] overflow-hidden">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-25 blur-[110px]"
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            backgroundColor: blob.color,
          }}
          animate={
            reducedMotion ? undefined : { x: [0, blob.range], y: [0, -blob.range * 0.6] }
          }
          transition={{
            type: "spring",
            stiffness: blob.stiffness,
            damping: 5,
            repeat: Infinity,
            repeatType: "mirror",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}
