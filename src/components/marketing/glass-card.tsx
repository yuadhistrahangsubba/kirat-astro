"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { MouseEvent, ReactNode } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset for the idle float, so neighboring cards don't bob in sync. */
  floatDelay?: number;
}

const TILT_RANGE = 8;

/**
 * A glass panel that floats gently, tilts toward the cursor, and wears a
 * slowly spinning gradient ring as its border. Two motion layers are kept
 * separate on purpose: the outer div owns the idle float loop, the inner
 * div owns cursor-tracked tilt — mixing both concerns on one element made
 * the transform math harder to reason about for no visual benefit.
 */
export function GlassCard({ children, className, floatDelay = 0 }: GlassCardProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 18 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateY.set(px * TILT_RANGE);
    rotateX.set(-py * TILT_RANGE);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      animate={reducedMotion ? undefined : { y: [0, -8] }}
      transition={{
        type: "spring",
        stiffness: 5,
        damping: 4,
        repeat: Infinity,
        repeatType: "mirror",
        delay: floatDelay,
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.015 }}
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={cn("relative overflow-hidden rounded-2xl p-px", className)}
      >
        <motion.div
          aria-hidden="true"
          className="absolute -inset-[60%] rounded-[inherit]"
          style={{
            background:
              "conic-gradient(from 0deg, var(--color-gold), var(--color-aurora-violet), var(--color-aurora-cyan), var(--color-gold))",
          }}
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 h-full rounded-[calc(1rem-1px)] border border-white/5 bg-card/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
