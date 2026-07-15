"use client";

import { motion } from "motion/react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";

import { ASTROLOGERS } from "../data/astrologers";
import { AstrologerCard } from "./astrologer-card";

const RISE = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

export function AstrologerDirectory() {
  return (
    <div className="w-full max-w-6xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="flex flex-col items-center text-center"
      >
        <motion.div variants={RISE} className="flex items-center gap-2">
          <span className="font-dense text-[11px] tracking-[0.25em] text-gold uppercase">
            Vedic Astrology Consultation
          </span>
          <span lang="dz" className="font-dzongkha text-sm text-gold/70">
            སྐར་རྩིས
          </span>
        </motion.div>
        <motion.h1 variants={RISE} className="mt-3 font-sans text-3xl font-bold tracking-wide sm:text-4xl">
          Talk to an astrologer
        </motion.h1>
        <motion.p variants={RISE} className="mt-3 max-w-md text-muted-foreground">
          Reach out directly for a personal reading or consultation — pick whoever fits what you&apos;re looking for.
        </motion.p>
        <motion.div variants={RISE} className="mt-6 w-full max-w-xs">
          <PrayerFlagAccent className="opacity-70" />
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ASTROLOGERS.map((astrologer) => (
          <AstrologerCard key={astrologer.id} astrologer={astrologer} />
        ))}
      </motion.div>
    </div>
  );
}
