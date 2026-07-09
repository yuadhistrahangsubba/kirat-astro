"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { seededRange } from "@/lib/deterministic-random";

const PARTICLE_COUNT = 14;
const HUES = ["var(--color-gold)", "var(--color-aurora-cyan)", "var(--color-aurora-violet)"];

interface Particle {
  top: number;
  left: number;
  size: number;
  drift: number;
  delay: number;
  stiffness: number;
  color: string;
}

/**
 * Slow-drifting glow motes — like dust caught in moonlight. Only
 * `transform` is animated (translateY/X), never top/left, so the browser
 * can composite these on the GPU without any layout or paint cost.
 */
export function FloatingParticles() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        top: seededRange(i * 4.4, 5, 95),
        left: seededRange(i * 6.6, 5, 95),
        size: seededRange(i * 3.3, 3, 7),
        drift: seededRange(i * 8.8, 18, 36),
        delay: seededRange(i * 1.7, 0, 3),
        stiffness: seededRange(i * 5.5, 4, 9),
        color: HUES[i % HUES.length]!,
      })),
    [],
  );

  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full blur-[1px]"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.5,
          }}
          animate={{ y: [0, -p.drift], x: [0, p.drift * 0.3] }}
          transition={{
            type: "spring",
            stiffness: p.stiffness,
            damping: 6,
            repeat: Infinity,
            repeatType: "mirror",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
