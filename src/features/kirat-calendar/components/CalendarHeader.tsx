"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { InfoPageKey } from "../types";
import { HamburgerMenu } from "./HamburgerMenu";

interface CalendarHeaderProps {
  onSelectHome?: () => void;
  onSelectInfoPage?: (key: InfoPageKey) => void;
}

/**
 * A minimal, mostly-transparent bar — wordmark on the left, a single
 * text-only "Menu"/"Close" trigger on the right, no icon, no border, no
 * shadow. The content anchors to the screen edges (padding grows with the
 * breakpoint) rather than floating in a fixed-width centered island, which
 * on large monitors left a small block of content marooned in a wide empty
 * bar. Edge-anchoring is the standard navbar read: the eye rests on both
 * ends, so the open center is spaciousness, not emptiness.
 */
export function CalendarHeader({ onSelectHome, onSelectInfoPage }: CalendarHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-[10000] bg-primary/80 py-4 backdrop-blur-xl"
      >
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          <span className="font-sans text-base font-bold tracking-[0.03em] text-primary-foreground sm:text-lg md:text-xl">
            Kirat Khaik Mundhum Paturo
          </span>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="text-primary-foreground/90 transition-colors hover:text-primary-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "menu"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="inline-block font-dense text-sm font-semibold tracking-[0.25em] uppercase sm:text-base"
              >
                {menuOpen ? "Close" : "Menu"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Rendered as a sibling, not a header child — motion.header carries an
          inline transform once animated, which would otherwise become the
          containing block for this drawer's `position: fixed` and clip it
          to the header's own height instead of the viewport. */}
      <HamburgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectHome={onSelectHome}
        onSelectInfoPage={onSelectInfoPage}
      />
    </>
  );
}
