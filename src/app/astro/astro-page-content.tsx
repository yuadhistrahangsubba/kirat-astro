"use client";

import { ArrowDown, Clock, Lock, MapPin, Orbit, ScrollText, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { BirthChartForm } from "@/features/birth-chart/components/BirthChartForm";
import { CelestialSphere, describeSky } from "@/features/birth-chart/components/celestial-sphere";
import { KundliReport, type KundliSubject } from "@/features/birth-chart/components/kundli-report/kundli-report";
import { ZODIAC_SIGNS, type ChartResult } from "@/services/astrology";
import { grahaLongitudesAt, grahaLongitudesFromChart, type GrahaLongitudes } from "@/services/astrology/sky-positions";

const RISE = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { type: "spring" as const, stiffness: 100, damping: 18 },
};

const CHAPTERS = [
  {
    numeral: "I",
    icon: Clock,
    title: "Your moment",
    body: "A date, a time and a place. Minutes matter: the rising sign moves about one degree every four minutes.",
  },
  {
    numeral: "II",
    icon: Orbit,
    title: "Your sky",
    body: "We work out where the Sun, Moon and planets truly stood, then read them in the sidereal zodiac using the Lahiri ayanamsa.",
  },
  {
    numeral: "III",
    icon: ScrollText,
    title: "Your story",
    body: "Lagna and Navamsa charts, the Vimshottari Dasha chapters of your life, dosha checks and Saturn's Sadesati timeline.",
  },
] as const;

const JD_UNIX_EPOCH = 2440587.5;
const julianDayToDate = (jd: number) => new Date((jd - JD_UNIX_EPOCH) * 86_400_000);

/** The dark "window onto the sky" every sphere sits in. */
function SkyWindow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-gold/30 bg-[radial-gradient(120%_90%_at_50%_0%,#1d2547_0%,#0b0f22_55%,#05070f_100%)] text-[#f5ecd6] shadow-[0_40px_100px_-40px_rgba(10,14,40,.7)] ${className}`}
    >
      {children}
    </div>
  );
}

export function AstroPageContent() {
  const [report, setReport] = useState<{ result: ChartResult; subject: KundliSubject } | null>(null);
  // Today's sky is computed on the client only, so server HTML never
  // depends on the clock (no hydration mismatch).
  const [skyNow, setSkyNow] = useState<GrahaLongitudes | null>(null);
  const revealHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const update = () => setSkyNow(grahaLongitudesAt(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // When a chart arrives, bring the reveal into view and move focus to it
  // so keyboard and screen-reader users land on the result too.
  useEffect(() => {
    if (!report) return;
    revealHeading.current?.focus({ preventScroll: true });
    revealHeading.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [report]);

  const birthSky = report ? grahaLongitudesFromChart(report.result) : null;
  const birthDate = report
    ? julianDayToDate(report.result.julianDayUtc).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: report.subject.timezone,
      })
    : "";

  return (
    <main id="main" className="relative">
      {/* ── Prologue: the sky remembers ─────────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-12 sm:px-6 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
        {/* No entrance animation on the headline: it's the LCP element and must
            be visible in the server HTML. */}
        <div>
          <p className="font-dense text-xs tracking-[0.25em] text-primary uppercase">Vedic birth chart · Free</p>
          <h1 className="mt-4 font-sans text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl">
            The sky remembers the moment you were born.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            At your first breath, the Sun, Moon and planets stood in one exact arrangement that will never repeat.
            Vedic astrology reads that arrangement. Tell us your moment, and we&apos;ll rebuild your sky.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#begin"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Begin your chart
            </a>
            <a
              href="#how"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              How it works
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <motion.div {...RISE} transition={{ ...RISE.transition, delay: 0.1 }}>
          <SkyWindow>
            <div className="flex items-center justify-between px-5 pt-4 text-xs tracking-[0.18em] uppercase">
              <span className="font-semibold text-gold-bright">The sky right now</span>
              <span className="inline-flex items-center gap-1.5 text-[#f5ecd6]/80">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden="true" />
                Live
              </span>
            </div>
            <CelestialSphere
              longitudes={skyNow}
              label={`The sky right now: ${describeSky(skyNow, ZODIAC_SIGNS)}.`}
              className="aspect-square w-full sm:aspect-[5/4]"
            />
            <p className="px-5 pb-4 text-center text-xs text-[#f5ecd6]/75">
              Real positions in the sidereal zodiac · drag to turn the sky
            </p>
          </SkyWindow>
        </motion.div>
      </section>

      {/* ── From a moment to a map ──────────────────────────────── */}
      <section id="how" aria-labelledby="how-heading" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-12 sm:px-6">
        <motion.h2 {...RISE} id="how-heading" className="text-center font-sans text-2xl font-bold tracking-wide sm:text-3xl">
          From a moment to a map
        </motion.h2>
        <ol className="relative mt-10 grid gap-5 md:grid-cols-3">
          {/* The thread that ties the three chapters together. */}
          <span
            aria-hidden="true"
            className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-linear-to-r from-transparent via-primary/40 to-transparent md:block"
          />
          {CHAPTERS.map(({ numeral, icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              {...RISE}
              transition={{ ...RISE.transition, delay: i * 0.12 }}
              className="relative rounded-2xl border border-border/60 bg-card/85 p-6 text-center backdrop-blur-xl"
            >
              <span className="relative mx-auto flex size-16 items-center justify-center rounded-full border border-primary/30 bg-background font-serif text-xl font-bold text-primary">
                {numeral}
              </span>
              <h3 className="mt-4 inline-flex items-center gap-2 font-sans text-lg font-bold">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ── Chapter I: tell us your moment ──────────────────────── */}
      <section
        id="begin"
        aria-labelledby="begin-heading"
        className="mx-auto grid max-w-6xl scroll-mt-8 items-start gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16"
      >
        <motion.div {...RISE} className="lg:sticky lg:top-10">
          <p className="font-dense text-xs tracking-[0.25em] text-primary uppercase">Chapter I</p>
          <h2 id="begin-heading" className="mt-3 font-sans text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Tell us your moment
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
            Three details are all it takes. The more exact your birth time, the sharper your rising sign, houses and
            Dasha timeline.
          </p>
          <ul className="mt-7 grid max-w-md gap-4">
            {[
              { icon: Clock, title: "Don't know the time?", body: "Tick “time unknown” — every planet's sign and nakshatra still resolve." },
              { icon: MapPin, title: "Born anywhere", body: "Pick a place from the list, or enter coordinates and timezone yourself." },
              { icon: Lock, title: "Not stored", body: "Your details are used only to calculate your chart." },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="w-full justify-self-center">
          <BirthChartForm onResult={setReport} />
        </div>
      </section>

      {/* ── Chapter II & III: this was your sky, and its story ──── */}
      {report && birthSky && (
        <section aria-labelledby="reveal-heading" className="mx-auto max-w-6xl scroll-mt-6 px-4 pt-8 pb-28 sm:px-6">
          <SkyWindow className="grid items-center gap-2 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="p-6 sm:p-10">
              <p className="font-dense text-xs tracking-[0.25em] text-gold-bright uppercase">Chapter II</p>
              <h2
                id="reveal-heading"
                ref={revealHeading}
                tabIndex={-1}
                className="mt-3 font-sans text-3xl font-bold tracking-tight text-balance outline-none sm:text-4xl"
              >
                This was your sky.
              </h2>
              <p className="mt-4 leading-relaxed text-[#f5ecd6]/85">
                On {birthDate}
                {report.subject.placeName ? ` in ${report.subject.placeName}` : ""}, the Moon stood in{" "}
                <strong className="text-[#fff4d6]">{report.result.moon.nakshatra.name}</strong> nakshatra in{" "}
                <strong className="text-[#fff4d6]">{report.result.moon.rashi.signName}</strong>, and the Sun in{" "}
                <strong className="text-[#fff4d6]">{report.result.sun.rashi.signName}</strong>
                {report.result.ascendant ? (
                  <>
                    , with <strong className="text-[#fff4d6]">{report.result.ascendant.rashi.signName}</strong> rising
                    on the eastern horizon.
                  </>
                ) : (
                  "."
                )}
              </p>
              <p className="mt-4 text-sm text-[#f5ecd6]/70">
                Watch the planets travel back from today&apos;s sky to where they stood when you were born.
              </p>
            </div>
            <CelestialSphere
              key={report.result.julianDayUtc}
              initialLongitudes={skyNow}
              longitudes={birthSky}
              ascendant={report.result.ascendant?.siderealLongitude}
              label={`Your birth sky: ${describeSky(birthSky, ZODIAC_SIGNS)}.`}
              className="aspect-square w-full"
            />
          </SkyWindow>

          <div className="mt-14">
            <p className="text-center font-dense text-xs tracking-[0.25em] text-primary uppercase">Chapter III · Your story</p>
            <div className="mt-6">
              <KundliReport result={report.result} {...report.subject} />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
