import Link from "next/link";

import { ChartWheel } from "@/components/marketing/chart-wheel";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <ChartWheel size="sm" />
          <span className="font-serif text-lg italic tracking-tight">Kirat Astro</span>
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

        <Button asChild size="sm" breathing>
          <a href="#demo">Get your chart</a>
        </Button>
      </div>
    </header>
  );
}
