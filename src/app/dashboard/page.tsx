"use client";

import { motion } from "motion/react";

import { AiAstrologerWidget } from "@/features/dashboard/components/ai-astrologer-widget";
import { HoroscopeWidget } from "@/features/dashboard/components/horoscope-widget";
import { LuckyColorsWidget, LuckyNumbersWidget } from "@/features/dashboard/components/lucky-widgets";
import { MoonPhaseWidget } from "@/features/dashboard/components/moon-phase-widget";
import { PanchangWidget } from "@/features/dashboard/components/panchang-widget";
import {
  CompatibilityWidget,
  RecentReportsWidget,
  SavedChartsWidget,
} from "@/features/dashboard/components/placeholder-widgets";
import { PlanetaryPositionsWidget } from "@/features/dashboard/components/planetary-positions-widget";
import { TransitsWidget } from "@/features/dashboard/components/transits-widget";
import { useSkyNow } from "@/features/dashboard/hooks/use-sky-now";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export default function DashboardPage() {
  const { data: sky } = useSkyNow();

  return (
    <main id="main" className="mx-auto max-w-360 px-5 pt-6 pb-16">
      <h1 className="sr-only">Dashboard</h1>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 md:grid-cols-6 xl:grid-cols-12"
      >
        <HoroscopeWidget sky={sky} className="md:col-span-3 xl:col-span-5" />
        <PlanetaryPositionsWidget sky={sky} className="md:col-span-3 xl:col-span-4" />
        <MoonPhaseWidget sky={sky} className="md:col-span-3 xl:col-span-3" />

        <PanchangWidget sky={sky} className="md:col-span-3 xl:col-span-4" />
        <TransitsWidget sky={sky} className="md:col-span-3 xl:col-span-4" />
        <LuckyNumbersWidget sky={sky} className="md:col-span-3 xl:col-span-2" />
        <LuckyColorsWidget sky={sky} className="md:col-span-3 xl:col-span-2" />

        <CompatibilityWidget className="md:col-span-2 xl:col-span-4" />
        <SavedChartsWidget className="md:col-span-2 xl:col-span-4" />
        <RecentReportsWidget className="md:col-span-2 xl:col-span-4" />

        <AiAstrologerWidget className="md:col-span-6 xl:col-span-12" />
      </motion.div>
    </main>
  );
}
