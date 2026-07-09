"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface MagneticButtonProps extends ComponentProps<typeof Button> {
  children: ReactNode;
}

const PULL = 0.35;
const RANGE = 14;

/**
 * A button that drifts a few pixels toward the cursor on hover, like a
 * needle finding true north. Range is deliberately small — this should
 * feel precise, not bouncy.
 */
export function MagneticButton({ children, ...props }: MagneticButtonProps) {
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);
    x.set(Math.max(-RANGE, Math.min(RANGE, offsetX * PULL)));
    y.set(Math.max(-RANGE, Math.min(RANGE, offsetY * PULL)));
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
}
