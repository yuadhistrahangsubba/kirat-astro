"use client";

import { Mail, Phone, User } from "lucide-react";
import { motion } from "motion/react";

import { GlassCard } from "@/components/marketing/glass-card";

const ASTROLOGER = {
  name: "Astrologer Name",
  phone: "+975 00 000 000",
  email: "astrologer@kirat-astro.com",
};

export function ContactPageContent() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-28 sm:py-36">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="font-dense text-xs tracking-[0.2em] text-gold uppercase"
      >
        Contact
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.05 }}
        className="mt-4 text-center font-sans text-3xl font-bold tracking-wide sm:text-4xl"
      >
        Talk to an astrologer
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 16, delay: 0.1 }}
        className="mt-4 text-center text-muted-foreground"
      >
        Reach out directly for a personal reading or consultation.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.18 }}
        className="mt-10 w-full"
      >
        <GlassCard className="w-full">
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              whileHover={{ scale: 1.06, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex size-20 items-center justify-center rounded-full border border-border bg-muted/40"
            >
              <User className="size-9 text-gold" aria-hidden="true" />
            </motion.div>

            <h2 className="font-sans text-xl font-bold tracking-wide">{ASTROLOGER.name}</h2>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a
                href={`tel:${ASTROLOGER.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-gold" aria-hidden="true" />
                {ASTROLOGER.phone}
              </a>
              <a
                href={`mailto:${ASTROLOGER.email}`}
                className="flex items-center justify-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-gold" aria-hidden="true" />
                {ASTROLOGER.email}
              </a>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </main>
  );
}
