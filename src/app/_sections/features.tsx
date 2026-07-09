"use client";

import { CalendarHeart, Compass, Users } from "lucide-react";
import { motion } from "motion/react";

import { GlassCard } from "@/components/marketing/glass-card";

const ENTRIES = [
  {
    icon: Compass,
    title: "Sidereal precision",
    body: "Lahiri ayanamsa, calculated for Himalayan latitudes — not a tropical approximation borrowed from the West.",
  },
  {
    icon: CalendarHeart,
    title: "Dasha timelines",
    body: "See exactly which planetary period governs your life right now, and precisely what comes next.",
  },
  {
    icon: Users,
    title: "Matchmaking, done properly",
    body: "Traditional Guna Milan compatibility scoring, the way Himalayan families have always practiced it.",
  },
] as const;

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="text-center font-serif text-3xl italic sm:text-4xl"
      >
        How it works
      </motion.h2>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {ENTRIES.map((entry, i) => (
          <motion.div
            key={entry.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: i * 0.12 }}
          >
            <GlassCard floatDelay={i * 0.6}>
              <entry.icon className="size-6 text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl">{entry.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
