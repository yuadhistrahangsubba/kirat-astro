import {
  ArrowLeftRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  Compass,
  Globe,
  Hourglass,
  Lock,
  Mail,
  Moon,
  Orbit,
  PencilLine,
  Sparkles,
  Star,
  Telescope,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { DEVELOPER } from "@/features/developer/data/developer";

// Server-rendered, like /developer — nothing here needs client JavaScript.

interface Tool {
  icon: LucideIcon;
  name: string;
  description: string;
  href: string;
}

const TOOL_GROUPS: { title: string; intro: string; tools: Tool[] }[] = [
  {
    title: "Kirat time & timing",
    intro: "Traditional divisions of the day and the Moon's strength, worked out for every date.",
    tools: [
      { icon: Clock3, name: "Senlendat", description: "Kirat planetary hours — 12 day and 12 night slots.", href: "/?panel=senlendat" },
      { icon: Hourglass, name: "Yenyem", description: "The eightfold Kirat division of day and night, with meanings.", href: "/?panel=yenyemdat" },
      { icon: Star, name: "Khesemuk", description: "Moon Mangyuk strength (Tarabala) against each birth Mangyuk.", href: "/?panel=khesemuk" },
      { icon: Moon, name: "Singlabamuk", description: "The Moon's current Titlum and its result for each birth Titlum.", href: "/?panel=singlabamuk" },
    ],
  },
  {
    title: "Sky & reference",
    intro: "The astronomy underneath the calendar, open for anyone to check.",
    tools: [
      { icon: Orbit, name: "Planets", description: "Sidereal longitude, Mangyuk and pada of all ten bodies at any time.", href: "/?panel=planets" },
      { icon: Telescope, name: "Ephemeris", description: "Daily positions, latitude, right ascension and distance.", href: "/?panel=ephemeris" },
      { icon: Globe, name: "Ayanamsha", description: "Today's value in the major sidereal reference systems.", href: "/?panel=ayanamsha" },
      { icon: ArrowLeftRight, name: "Yele Converter", description: "Convert between Gregorian and Kirat solar dates (AD 2000–2100).", href: "/?panel=yeleconverter" },
    ],
  },
];

const METHOD: { term: string; detail: string }[] = [
  {
    term: "Real astronomy",
    detail: "Sun, Moon and planet positions come from an astronomical ephemeris, not from printed tables or templates.",
  },
  {
    term: "Sidereal zodiac",
    detail: "Positions use the Lahiri (Chitrapaksha) ayanamsa, the standard reference for Vedic astrology in the region.",
  },
  {
    term: "Thimphu reference",
    detail: "Calendar days, sunrise and time slots are computed for Thimphu on Bhutan time (Asia/Thimphu), wherever you view them from.",
  },
  {
    term: "Tested",
    detail: "The calendar and astrology engines are covered by automated tests that run on every change.",
  },
];

const PRINCIPLES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Sparkles, title: "Free for everyone", body: "No account, no payment and no limit on how often you use it." },
  { icon: Lock, title: "Private by design", body: "Birth details are used only to calculate your chart and are not stored." },
  { icon: PencilLine, title: "Open to correction", body: "If a date, name or reading looks wrong, tell us — community knowledge comes first." },
];

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-dense text-xs font-semibold tracking-[0.2em] text-primary uppercase">
      {children}
    </h2>
  );
}

const CARD = "rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8";

export function AboutPageContent() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-dense text-xs tracking-[0.25em] text-primary uppercase">About us</p>
        <h1 className="mt-3 font-sans text-3xl font-bold tracking-wide text-balance sm:text-4xl">
          Kirat reckoning and the modern calendar, in one place
        </h1>
        <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground">
          Kirat Khaik Mundhum Paturo brings the traditional Kirat lunar-solar calendar together with the Gregorian
          calendar, so festivals, auspicious timings and daily Panchanga details are easy to find, trust and share.
        </p>
        <PrayerFlagAccent className="mx-auto mt-7 max-w-xs" />
      </header>

      <div className="mt-12 grid gap-6">
        {/* The two main entry points. */}
        <section aria-labelledby="offer" className="grid gap-4 sm:grid-cols-2">
          <h2 id="offer" className="sr-only">
            What you can do here
          </h2>
          <Link
            href="/"
            className="group flex flex-col rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-gold/5 p-6 transition-colors hover:border-primary/50 sm:p-8"
          >
            <CalendarDays className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-sans text-xl font-bold">Kirat Khaik Mundhum Calendar</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Every day shows its Kirat date, Mangyuk and Lamikkhok alongside the Gregorian date, with sunrise and full
              Panchanga details in month and year views.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Open the calendar
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/astro"
            className="group flex flex-col rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl transition-colors hover:border-primary/40 sm:p-8"
          >
            <Compass className="size-6 text-primary" aria-hidden="true" />
            <h3 className="mt-4 font-sans text-xl font-bold">Vedic birth chart</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              A free Kundli with Lagna and Navamsa charts, Vimshottari Dasha, dosha checks and a Sadesati timeline —
              for a birth anywhere in the world.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Make a birth chart
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        </section>

        <section aria-labelledby="tools" className={CARD}>
          <SectionHeading id="tools">Tools in the calendar</SectionHeading>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {TOOL_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-base font-semibold">{group.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{group.intro}</p>
                <ul className="mt-4 grid gap-2.5">
                  {group.tools.map(({ icon: Icon, name, description, href }) => (
                    <li key={name}>
                      <Link
                        href={href}
                        className="group flex min-h-14 items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{name}</span>
                          <span className="block text-sm text-muted-foreground">{description}</span>
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <section aria-labelledby="method" className={CARD}>
            <SectionHeading id="method">How it&apos;s calculated</SectionHeading>
            <dl className="mt-5 grid gap-4">
              {METHOD.map(({ term, detail }) => (
                <div key={term} className="border-l-2 border-primary/30 pl-4">
                  <dt className="text-sm font-semibold">{term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="principles" className={CARD}>
            <SectionHeading id="principles">What we stand for</SectionHeading>
            <ul className="mt-5 grid gap-4">
              {PRINCIPLES.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          aria-labelledby="contact"
          className="flex flex-col items-start gap-5 rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-gold/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 id="contact" className="font-sans text-lg font-bold">
              Spotted a mistake or have a suggestion?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Built and maintained by{" "}
              <Link href="/developer" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                {DEVELOPER.name}
              </Link>
              . Corrections from the Kirat community are always welcome.
            </p>
          </div>
          <a
            href={`mailto:${DEVELOPER.email}?subject=${encodeURIComponent("Kirat Khaik Mundhum Paturo")}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="size-4" aria-hidden="true" />
            Get in touch
          </a>
        </section>
      </div>
    </main>
  );
}
