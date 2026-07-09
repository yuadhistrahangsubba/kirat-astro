import { MoonPhase } from "@/components/marketing/moon-phase";
import { SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <MoonPhase size={40} />
          <div>
            <p className="font-serif text-lg italic">Astro Himalaya</p>
            <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
          </div>
        </div>
        <p className="font-dense text-xs tracking-[0.15em] text-muted-foreground uppercase">
          {SITE.regions.join(" · ")}
        </p>
      </div>
    </footer>
  );
}
