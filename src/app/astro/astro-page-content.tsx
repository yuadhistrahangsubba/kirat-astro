"use client";

import { motion } from "motion/react";

import { ChartWheel } from "@/components/marketing/chart-wheel";
import { BirthChartForm } from "@/features/birth-chart/components/BirthChartForm";

export function AstroPageContent() {
  return (
    <main className="relative">
      <div className="mx-auto grid max-w-5xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
        >
          <p className="font-dense text-xs tracking-[0.2em] text-gold uppercase">Birth chart calculator</p>
          <h1 className="mt-4 font-sans text-3xl font-bold tracking-wide sm:text-4xl">Calculate your astrology</h1>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Sun, Moon, and Ascendant are calculated for real — sidereal positions, nakshatra, and planetary
            periods included. Mercury through Pluto aren&apos;t wired up yet.
          </p>
          <div className="mt-8 flex justify-center lg:justify-start">
            <ChartWheel size="lg" className="h-64 w-64 sm:h-80 sm:w-80" />
          </div>
        </motion.div>

        <div className="justify-self-center">
          <BirthChartForm />
        </div>
      </div>
    </main>
  );
}
