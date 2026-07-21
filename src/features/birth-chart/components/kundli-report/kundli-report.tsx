"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import type { ChartResult } from "@/services/astrology";
import { interpretAllDomains } from "@/services/astrology/interpretation";

import { lagnaPlacements, navamsaPlacements } from "./chart-geometry";
import { Doshas } from "./doshas";
import { KundliPdfButton } from "./kundli-pdf";
import { KundliSeals } from "./kundli-seals";
import { LifePredictions } from "./life-predictions";
import { NorthIndianChart } from "./north-indian-chart";
import { SadesatiTimeline } from "./sadesati-timeline";
import { ShadbalaTable } from "./shadbala-table";
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

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

export function KundliReport({ result, name, gender, placeName, timezone, latitude, longitude }: KundliReportProps) {
  const birthUtc = result.vimshottariDasha[0]?.startDate ?? new Date();
  const domains = interpretAllDomains(result);

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
        <div className="mt-5 flex justify-center">
          <KundliPdfButton
            result={result}
            domains={domains}
            name={name}
            gender={gender}
            placeName={placeName}
            birthUtc={birthUtc}
            timezone={timezone}
            latitude={latitude}
            longitude={longitude}
          />
        </div>
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-8">
        <KundliSeals result={result} />
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

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Doshas</SectionLabel>
        <Doshas manglik={result.manglikDosha} kalsarpa={result.kalsarpaDosha} />
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Sadesati Timeline</SectionLabel>
        <SadesatiTimeline periods={result.sadesatiPeriods} />
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Planetary Strength</SectionLabel>
        <ShadbalaTable basicShadbala={result.basicShadbala} />
      </motion.div>

      <motion.div variants={FADE_UP} className="mt-10">
        <SectionLabel>Life Predictions</SectionLabel>
        <LifePredictions domains={domains} />
        <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
          Traditional interpretive guidance drawn from your chart — not medical, legal, or financial advice.
        </p>
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
