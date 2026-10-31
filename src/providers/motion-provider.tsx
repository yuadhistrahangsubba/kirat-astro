"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Honors the OS "reduce motion" setting for every Motion animation. The
 * prefers-reduced-motion rule in globals.css only reaches CSS animations;
 * Motion's JS-driven springs bypass it.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
