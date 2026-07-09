"use client";

import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/constants/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-himalaya-indigo-glow/20 blur-3xl" />
        <div className="absolute -top-32 right-0 size-96 rounded-full bg-himalaya-gold/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-medium tracking-wide text-accent uppercase"
        >
          {SITE.regions.join(" · ")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-3xl font-serif text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {SITE.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {SITE.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button size="lg" asChild>
            <a href="#demo-heading">Get your chart</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#features-heading">See what&apos;s included</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
