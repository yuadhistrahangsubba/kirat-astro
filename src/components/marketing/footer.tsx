import { MoonPhase } from "@/components/marketing/moon-phase";
import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { SITE } from "@/constants/site";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "#demo", label: "Generate a chart" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <PrayerFlagAccent className="rounded-none opacity-50" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <MoonPhase size={40} />
            <div>
              <p className="font-serif text-lg italic">
                Kirat Astro{" "}
                <span lang="dz" className="font-dzongkha text-sm text-gold/70 not-italic">
                  སྐར་རྩིས
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
            </div>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Kirat Astro
          </p>
          <p className="font-dense text-xs tracking-[0.15em] text-muted-foreground uppercase">
            {SITE.regions.join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
