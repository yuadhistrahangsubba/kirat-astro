"use client";

import { motion } from "motion/react";

const ENTRIES = [
  {
    index: "01",
    title: "Sidereal precision",
    body: "Lahiri ayanamsa, calculated for Himalayan latitudes — not a tropical approximation borrowed from the West.",
  },
  {
    index: "02",
    title: "Dasha timelines",
    body: "See exactly which planetary period governs your life right now, and precisely what comes next.",
  },
  {
    index: "03",
    title: "Matchmaking, done properly",
    body: "Traditional Guna Milan compatibility scoring, the way Himalayan families have always practiced it.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-3xl px-6 py-28 sm:py-36">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="font-serif text-3xl italic sm:text-4xl"
      >
        How it works
      </motion.h2>

      <div className="mt-14 divide-y divide-border/60 border-t border-border/60">
        {ENTRIES.map((entry, i) => (
          <motion.div
            key={entry.index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="grid grid-cols-[3rem_1fr] gap-6 py-9 sm:grid-cols-[4rem_1fr]"
          >
            <span className="font-mono text-sm text-gold/70">{entry.index}</span>
            <div>
              <h3 className="font-serif text-xl">{entry.title}</h3>
              <p className="mt-2 max-w-md text-muted-foreground">{entry.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
