"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import type { ChartResult } from "@/services/astrology";

import { NorthIndianChart, type ChartPlacement } from "./north-indian-chart";
import { TraditionalTable } from "./traditional-table";
import { VimshottariDashaTable } from "./vimshottari-dasha-table";

export interface KundliSubject {
  name: string;
  gender: "male" | "female";
  placeName: string;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface KundliReportProps extends KundliSubject {
  result: ChartResult;
}

const GRAHA_ABBR = {
  sun: "Su",
  moon: "Mo",
  mars: "Ma",
  mercury: "Me",
  jupiter: "Ju",
  venus: "Ve",
  saturn: "Sa",
  rahu: "Ra",
  ketu: "Ke",
  uranus: "Ur",
  neptune: "Ne",
  pluto: "Pl",
} as const;

const GRAHA_ORDER = Object.keys(GRAHA_ABBR) as (keyof typeof GRAHA_ABBR)[];

function lagnaPlacements(result: ChartResult): ChartPlacement[] {
  return GRAHA_ORDER.map((body) => ({ abbreviation: GRAHA_ABBR[body], signIndex: result[body].rashi.signIndex }));
}

function navamsaPlacements(result: ChartResult): ChartPlacement[] {
  return GRAHA_ORDER.map((body) => ({ abbreviation: GRAHA_ABBR[body], signIndex: result.navamsa[body].signIndex }));
}

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

export function KundliReport({ result, name, gender, placeName, timezone, latitude, longitude }: KundliReportProps) {
  const birthUtc = result.vimshottariDasha[0]?.startDate ?? new Date();

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      className="mx-auto w-full max-w-5xl"
    >
      <motion.div variants={FADE_UP} className="text-center">
        <p className="font-dense text-[11px] tracking-[0.25em] text-gold uppercase">Full Vedic Report</p>
        <h2 className="mt-2 font-sans text-2xl font-bold tracking-wide sm:text-3xl">{name}&apos;s Kundli</h2>
        <PrayerFlagAccent className="mx-auto mt-5 max-w-xs opacity-70" />
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Traditional</SectionLabel>
        <TraditionalTable
          result={result}
          name={name}
          gender={gender}
          placeName={placeName}
          birthUtc={birthUtc}
          timezone={timezone}
          latitude={latitude}
          longitude={longitude}
        />
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <NorthIndianChart title="Lagna Chart" placements={lagnaPlacements(result)} ascendantSignIndex={result.ascendant?.rashi.signIndex} />
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
          <NorthIndianChart
            title="Navamsa Chart"
            placements={navamsaPlacements(result)}
            ascendantSignIndex={result.navamsa.ascendant?.signIndex}
          />
        </div>
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Vimshottari Dasha</SectionLabel>
        <VimshottariDashaTable periods={result.vimshottariDasha} />
      </motion.div>
    </motion.section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 font-sans text-lg font-bold tracking-wide">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" aria-hidden="true" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" aria-hidden="true" />
    </h3>
  );
}
