"use client";

import { Facebook, GraduationCap, Instagram, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";
import { DEVELOPER } from "@/features/developer/data/developer";

const RISE = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function DeveloperPageContent() {
  return (
    <main id="main" className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center px-6 py-28 sm:py-36">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        className="flex flex-col items-center text-center"
      >
        <motion.p variants={RISE} className="font-dense text-[11px] tracking-[0.25em] text-gold uppercase">
          About the Developer
        </motion.p>
        <motion.h1 variants={RISE} className="mt-3 font-sans text-3xl font-bold tracking-wide sm:text-4xl">
          Meet the Developer
        </motion.h1>
        <motion.div variants={RISE} className="mt-6 w-full max-w-xs">
          <PrayerFlagAccent className="opacity-70" />
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
        className="relative mt-10 w-full"
      >
        <div
          aria-hidden="true"
          className="absolute -inset-px rounded-[calc(var(--radius-2xl)+1px)] bg-gradient-to-br from-gold/50 via-gold/10 to-transparent"
        />
        <div className="relative flex flex-col items-center rounded-2xl border border-border/60 bg-card/90 p-8 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,.35)] backdrop-blur-xl sm:p-10">
          <motion.div
            variants={RISE}
            className="flex size-20 items-center justify-center rounded-full border-2 border-gold/40 bg-gold/10 font-sans text-2xl font-bold text-primary shadow-[0_0_20px_-6px_var(--color-gold)]"
          >
            {initials(DEVELOPER.name)}
          </motion.div>

          <motion.h2 variants={RISE} className="mt-4 font-sans text-2xl font-bold tracking-wide">
            {DEVELOPER.name}
          </motion.h2>
          <motion.p variants={RISE} className="mt-1 text-sm font-medium text-gold">
            {DEVELOPER.role} &middot; {DEVELOPER.yearsOfExperience} years experience
          </motion.p>

          <motion.div variants={RISE} className="mt-6 flex flex-col gap-2.5 text-sm text-muted-foreground sm:flex-row sm:gap-6">
            <a href={`mailto:${DEVELOPER.email}`} className="flex items-center justify-center gap-2 transition-colors hover:text-foreground">
              <Mail className="size-4 text-gold" aria-hidden="true" />
              {DEVELOPER.email}
            </a>
            <a href={`tel:${DEVELOPER.phone}`} className="flex items-center justify-center gap-2 transition-colors hover:text-foreground">
              <Phone className="size-4 text-gold" aria-hidden="true" />
              {DEVELOPER.phone}
            </a>
          </motion.div>

          <motion.div variants={RISE} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="size-4 shrink-0 text-gold" aria-hidden="true" />
            <span>
              {DEVELOPER.college} &middot; Class of {DEVELOPER.graduationYear}
            </span>
          </motion.div>

          <motion.div variants={RISE} className="mt-6 flex flex-wrap justify-center gap-2">
            {DEVELOPER.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-foreground/85"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div variants={RISE}>
            <PrayerFlagAccent className="mt-7 mb-6 opacity-70" />
          </motion.div>

          <motion.div variants={RISE} className="flex gap-3">
            <Button asChild variant="outline" size="sm">
              <a href={DEVELOPER.facebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="size-4" aria-hidden="true" />
                Facebook
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={DEVELOPER.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="size-4" aria-hidden="true" />
                Instagram
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-6 text-center text-[11px] text-muted-foreground/70"
      >
        Designed &amp; built Kirat Astro.
      </motion.p>
    </main>
  );
}
