"use client";

import { motion } from "motion/react";

import { MagneticButton } from "@/components/marketing/magnetic-button";
import { OrbitalEmblem } from "@/components/marketing/orbital-emblem";
import { SITE } from "@/constants/site";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
      >
        <OrbitalEmblem size="lg" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl animate-breathe"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-40 pb-28 text-center sm:pt-48 sm:pb-36"
      >
        <motion.span
          variants={rise}
          className="rounded-full border border-gold/25 px-4 py-1 font-mono text-[11px] tracking-[0.2em] text-gold uppercase"
        >
          {SITE.regions.join(" · ")}
        </motion.span>

        <motion.h1
          variants={rise}
          className="mt-8 font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl"
        >
          The sky kept time
          <br />
          <em className="text-gold italic">before we did.</em>
        </motion.h1>

        <motion.p variants={rise} className="mt-7 max-w-xl text-lg text-muted-foreground">
          Sidereal Vedic astrology for {SITE.regions.slice(0, 3).join(", ")}, and the
          diaspora — birth charts and planetary timing calculated with
          observatory-grade precision.
        </motion.p>

        <motion.div variants={rise} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticButton size="lg" asChild>
            <a href="#demo">Calculate your chart</a>
          </MagneticButton>
          <MagneticButton size="lg" variant="outline" asChild>
            <a href="#features">How it works</a>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
