import { CalendarHeart, Compass, Sparkles, Users } from "lucide-react";

import { BirthChartForm } from "@/features/birth-chart/components/BirthChartForm";
import { SITE } from "@/constants/site";

import { Hero } from "./_sections/hero";

const FEATURES = [
  {
    icon: Compass,
    title: "Sidereal precision",
    body: "Lahiri ayanamsa charts built for Himalayan latitudes — not a Western tropical approximation.",
  },
  {
    icon: CalendarHeart,
    title: "Dasha timelines",
    body: "Vimshottari periods laid out clearly, so you know what's active now and what's next.",
  },
  {
    icon: Users,
    title: "Matchmaking",
    body: "Guna Milan compatibility scoring for families following Himalayan matchmaking tradition.",
  },
] as const;

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section aria-labelledby="features-heading" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <h2 id="features-heading" className="font-serif text-2xl font-semibold sm:text-3xl">
          Built for the Himalayan tradition
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {SITE.description}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border/60 bg-card p-6">
              <Icon className="size-6 text-accent" aria-hidden="true" />
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="demo-heading"
        className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-20 sm:py-28"
      >
        <div className="max-w-xl text-center">
          <Sparkles className="mx-auto size-6 text-accent" aria-hidden="true" />
          <h2 id="demo-heading" className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">
            Try a chart calculation
          </h2>
          <p className="mt-2 text-muted-foreground">
            The calculation engine isn&apos;t connected yet — this form validates and
            submits real, typed input so you can see the intended flow end to end.
          </p>
        </div>
        <BirthChartForm />
      </section>
    </main>
  );
}
