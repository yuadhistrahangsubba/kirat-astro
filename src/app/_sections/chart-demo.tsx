"use client";

import { motion } from "motion/react";

import { BirthChartForm } from "@/features/birth-chart/components/BirthChartForm";

export function ChartDemo() {
  return (
    <section id="demo" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-5xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">Try it yourself</p>
          <h2 className="mt-4 font-serif text-3xl italic sm:text-4xl">See it work</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            The calculation engine isn&apos;t connected yet — this form
            validates and submits real, typed input, so you can see the
            intended flow end to end before the engine is wired up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="justify-self-center"
        >
          <BirthChartForm />
        </motion.div>
      </div>
    </section>
  );
}
