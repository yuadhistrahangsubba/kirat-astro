import { SITE } from "@/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-lg italic">Astro Himalaya</p>
          <p className="mt-1 text-sm text-muted-foreground">{SITE.tagline}</p>
        </div>
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          {SITE.regions.join(" · ")}
        </p>
      </div>
    </footer>
  );
}
