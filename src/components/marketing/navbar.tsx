import Link from "next/link";

import { OrbitalEmblem } from "@/components/marketing/orbital-emblem";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#features", label: "How it works" },
  { href: "#demo", label: "Try a chart" },
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <OrbitalEmblem size="sm" />
          <span className="font-serif text-lg italic tracking-tight">Astro Himalaya</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
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

        <Button asChild size="sm">
          <a href="#demo">Get your chart</a>
        </Button>
      </div>
    </header>
  );
}
