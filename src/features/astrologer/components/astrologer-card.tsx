"use client";

import { Languages, Mail, Phone, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";

import type { Astrologer } from "../data/astrologers";

const RISE = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};

export function AstrologerCard({ astrologer }: { astrologer: Astrologer }) {
  return (
    <motion.div variants={RISE} className="relative h-full">
      <div
        aria-hidden="true"
        className="absolute -inset-px rounded-[calc(var(--radius-xl)+1px)] bg-gradient-to-br from-gold/50 via-gold/10 to-transparent"
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/90 p-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg ring-1 ring-gold/25">
          <Image
            src={astrologer.photo}
            alt={astrologer.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/5 to-transparent"
          />
          <div className="absolute inset-x-2.5 bottom-2.5 flex items-center gap-1.5 rounded-full border border-border/60 bg-card/90 px-2.5 py-1 text-[11px] backdrop-blur-md">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-foreground/90">Available</span>
          </div>
        </div>

        <h3 className="mt-4 font-sans text-lg font-bold tracking-wide">{astrologer.name}</h3>
        <p className="mt-0.5 text-sm font-medium text-gold">{astrologer.title}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{astrologer.bio}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {astrologer.specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-foreground/85"
            >
              {specialty}
            </span>
          ))}
        </div>

        <PrayerFlagAccent className="mt-4 mb-4 opacity-70" />

        <div className="mt-auto flex flex-col gap-2">
          <Button asChild size="sm">
            <a href={`tel:${astrologer.phone.replace(/\s+/g, "")}`}>
              <Phone className="size-3.5" aria-hidden="true" />
              Call Now
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`mailto:${astrologer.email}`}>
              <Mail className="size-3.5" aria-hidden="true" />
              Email
            </a>
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3 shrink-0 text-gold" aria-hidden="true" />
            Consulted privately — details never shared.
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="size-3 shrink-0 text-gold" aria-hidden="true" />
            Speaks {astrologer.languages}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
