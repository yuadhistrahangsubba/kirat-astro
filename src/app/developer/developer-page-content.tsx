import {
  ArrowUpRight,
  CalendarDays,
  Facebook,
  FileText,
  GraduationCap,
  Instagram,
  Mail,
  Orbit,
  Phone,
  type LucideIcon,
} from "lucide-react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { DEVELOPER } from "@/features/developer/data/developer";

// Server-rendered on purpose: the previous client version hid the whole page
// at opacity 0 until JavaScript ran, which delayed LCP and blanked the page
// without JS. Hover and focus states are plain CSS.

const PHONE_E164 = `+975${DEVELOPER.phone}`;
const PHONE_DISPLAY = `+975 ${DEVELOPER.phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")}`;

const BUILT_HERE: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: CalendarDays,
    title: "Kirat Khaik Mundhum Calendar",
    body: "Daily Kirat dates, Mangyuk and Lamikkhok, panchanga and sunrise for Thimphu, computed in the browser.",
  },
  {
    icon: Orbit,
    title: "Vedic astrology engine",
    body: "Sidereal planet positions, Lagna and Navamsa charts, Vimshottari Dasha, doshas and Sadesati, backed by unit tests.",
  },
  {
    icon: FileText,
    title: "Kundli report & PDF",
    body: "A full birth-chart report on screen, exportable as a printable PDF.",
  },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

function ContactRow({ href, icon: Icon, label, value }: { href: string; icon: LucideIcon; label: string; value: string }) {
  return (
    <a
      href={href}
      className="group flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block text-sm font-medium break-all text-foreground">{value}</span>
      </span>
    </a>
  );
}

function SocialLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <Icon className="size-4 text-primary" aria-hidden="true" />
      {label}
      <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-dense text-xs font-semibold tracking-[0.2em] text-primary uppercase">
      {children}
    </h2>
  );
}

export function DeveloperPageContent() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="text-center">
        <p className="font-dense text-xs tracking-[0.25em] text-primary uppercase">About the developer</p>
        <h1 className="mt-3 font-sans text-3xl font-bold tracking-wide text-balance sm:text-4xl">
          The person behind Kirat Khaik Mundhum Paturo
        </h1>
        <PrayerFlagAccent className="mx-auto mt-6 max-w-xs" />
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        {/* Profile card — sticks beside the details on wide screens. */}
        <section
          aria-labelledby="profile-name"
          className="relative rounded-2xl border border-border/60 bg-card/90 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-8 lg:sticky lg:top-6"
        >
          <div className="flex flex-col items-center text-center">
            <div
              aria-hidden="true"
              className="flex size-24 items-center justify-center rounded-full border-2 border-primary/30 bg-linear-to-br from-primary/15 to-gold/10 font-sans text-3xl font-bold text-primary"
            >
              {initials(DEVELOPER.name)}
            </div>
            <h2 id="profile-name" className="mt-4 font-sans text-2xl font-bold tracking-wide">
              {DEVELOPER.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-primary">{DEVELOPER.role}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              {DEVELOPER.yearsOfExperience} years building for the web
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-2.5">
            <ContactRow href={`mailto:${DEVELOPER.email}`} icon={Mail} label="Email" value={DEVELOPER.email} />
            <ContactRow href={`tel:${PHONE_E164}`} icon={Phone} label="Phone" value={PHONE_DISPLAY} />
          </div>

          <div className="mt-3 flex gap-2.5">
            <SocialLink href={DEVELOPER.facebook} icon={Facebook} label="Facebook" />
            <SocialLink href={DEVELOPER.instagram} icon={Instagram} label="Instagram" />
          </div>
        </section>

        <div className="grid gap-6">
          <section
            aria-labelledby="built-here"
            className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8"
          >
            <SectionHeading id="built-here">Built on this site</SectionHeading>
            <ul className="mt-5 grid gap-3">
              {BUILT_HERE.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4 rounded-xl border border-border/50 bg-background/50 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="skills"
            className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8"
          >
            <SectionHeading id="skills">Skills</SectionHeading>
            <dl className="mt-5 grid gap-5">
              {DEVELOPER.skillGroups.map((group) => (
                <div key={group.title} className="grid gap-2 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="pt-1 text-sm font-medium text-foreground">{group.title}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li
                          key={skill}
                          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="education"
            className="rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-xl sm:p-8"
          >
            <SectionHeading id="education">Education</SectionHeading>
            <div className="mt-5 flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{DEVELOPER.college}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">Graduated {DEVELOPER.graduationYear}</p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="contact-cta"
            className="flex flex-col items-start gap-4 rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-gold/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <div>
              <h2 id="contact-cta" className="font-sans text-lg font-bold">
                Have feedback or a project in mind?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Corrections to the calendar are especially welcome.</p>
            </div>
            <a
              href={`mailto:${DEVELOPER.email}?subject=${encodeURIComponent("Kirat Khaik Mundhum Paturo")}`}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="size-4" aria-hidden="true" />
              Send an email
            </a>
          </section>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Designed &amp; built by {DEVELOPER.name} for Kirat Khaik Mundhum Paturo.
      </p>
    </main>
  );
}
