"use client";

import Link from "next/link";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";

import { OBSERVER } from "../constants";
import { useClock } from "../hooks/use-clock";

/**
 * Terminal-style chrome: wordmark, twin ticking clocks (observer + UTC),
 * location stamp, one action. Monospace digits so nothing jitters as
 * the seconds change.
 */
export function DashboardHeader() {
  const localTime = useClock(OBSERVER.timezone);
  const utcTime = useClock("UTC");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
      <PrayerFlagAccent className="rounded-none opacity-60" />
      <div className="mx-auto flex h-14 max-w-360 items-center justify-between gap-4 px-5">
        <div className="flex items-baseline gap-3">
          <Link href="/" className="font-serif text-lg italic tracking-tight">
            Kirat Astro
          </Link>
          <span className="rounded border border-gold/30 px-1.5 py-0.5 font-dense text-[9px] tracking-[0.18em] text-gold uppercase">
            Dashboard
          </span>
        </div>

        <div className="hidden items-center gap-5 font-mono text-xs text-muted-foreground tabular-nums sm:flex">
          <span>
            <span className="text-muted-foreground/50">{OBSERVER.place.toUpperCase()} </span>
            {localTime ?? "--:--:--"}
          </span>
          <span>
            <span className="text-muted-foreground/50">UTC </span>
            {utcTime ?? "--:--:--"}
          </span>
          <span className="hidden text-muted-foreground/50 lg:inline">
            {OBSERVER.latitude.toFixed(2)}°N {OBSERVER.longitude.toFixed(2)}°E
          </span>
        </div>

        <Button asChild size="sm" variant="outline">
          <Link href="/#demo">Generate chart</Link>
        </Button>
      </div>
    </header>
  );
}
