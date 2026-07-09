"use client";

import { motion } from "motion/react";

import { ChartWheel } from "@/components/marketing/chart-wheel";
import { GlassCard } from "@/components/marketing/glass-card";
import { BirthChartForm } from "@/features/birth-chart/components/BirthChartForm";

export function ChartDemo() {
  return (
    <section id="demo" className="relative border-t border-white/10">
      <div className="mx-auto grid max-w-5xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
        >
          <p className="font-dense text-xs tracking-[0.2em] text-gold uppercase">Try it yourself</p>
          <h2 className="mt-4 font-serif text-3xl italic sm:text-4xl">See it work</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            The calculation engine isn&apos;t connected yet — this form
            validates and submits real, typed input, so you can see the
            intended flow end to end before the engine is wired up.
          </p>
          <p className="mt-6 text-xs text-muted-foreground/70">
            Hover a planet — this wheel is illustrative, not your real chart.
          </p>
          <div className="mt-2 flex justify-center lg:justify-start">
            <ChartWheel size="lg" className="h-64 w-64 sm:h-80 sm:w-80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.1 }}
          className="justify-self-center"
        >
          <GlassCard className="w-full max-w-md">
            <BirthChartForm />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
