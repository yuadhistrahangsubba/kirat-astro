"use client";

import { Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { PrayerFlagAccent } from "@/components/marketing/prayer-flag-accent";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { InfoPageKey, ToolPageKey } from "../types";
import { NAV_SECTIONS, type NavItem } from "./nav-items";

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
  /** Omit on pages outside the calendar — Home/info/tool items then navigate via real links instead of switching local view state. */
  onSelectHome?: () => void;
  onSelectInfoPage?: (key: InfoPageKey) => void;
  onSelectTool?: (key: ToolPageKey) => void;
}

const LIST_STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
};

const ITEM_RISE = {
  hidden: { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
};

export const SITE_MENU_ID = "site-menu";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function HamburgerMenu({ open, onClose, onSelectHome, onSelectInfoPage, onSelectTool }: HamburgerMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Callers pass an inline onClose; reading it through a ref keeps the
  // effect below from re-running (and re-grabbing focus) on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Modal dialog behavior (ARIA APG): move focus in on open, keep Tab inside,
  // close on Escape, and hand focus back to whatever opened the menu.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[99998] cursor-default bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {/* Slides from the right, under the "Menu" trigger it opens from —
              the old left-sliding panel opened on the opposite side of the
              screen from its own button, which reads as a small but real
              spatial disconnect once you notice it. */}
          <motion.div
            ref={panelRef}
            id={SITE_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[99999] flex w-[85vw] max-w-[400px] flex-col overflow-hidden border-l border-border/60 bg-card/97 backdrop-blur-2xl shadow-[-12px_0_50px_-12px_rgba(0,0,0,.45)]"
          >
            {/* An oversized, low-opacity glyph standing in for a stock photo
                banner — the same quiet-depth trick as the hero, sized to the
                drawer instead. */}
            <span
              aria-hidden="true"
              lang="dz"
              className="pointer-events-none absolute -top-8 -right-12 font-dzongkha text-[16rem] leading-none text-gold/[0.05] select-none"
            >
              སྐར
            </span>

            <div className="relative flex items-start justify-between gap-3 px-6 pt-7 pb-5">
              <div className="min-w-0">
                <span className="font-sans text-lg font-bold tracking-wide">Kirat Khaik Mundhum Paturo</span>
                <p className="mt-1 text-xs text-muted-foreground">Vedic Astrology &amp; Kirat Calendar</p>
                <PrayerFlagAccent className="mt-3 max-w-[140px] opacity-70" />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <motion.nav
              initial="hidden"
              animate="visible"
              variants={LIST_STAGGER}
              className="relative flex-1 overflow-y-auto px-4 py-2"
            >
              {NAV_SECTIONS.map((section, i) => (
                <div key={section.label ?? `section-${i}`} className={cn(i > 0 && "mt-5")}>
                  {section.label && (
                    <p className="px-3.5 pb-2 font-dense text-[10px] tracking-[0.18em] text-muted-foreground/70 uppercase">
                      {section.label}
                    </p>
                  )}
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => (
                      <NavRow
                        key={item.label}
                        item={item}
                        onClose={onClose}
                        onSelectHome={onSelectHome}
                        onSelectInfoPage={onSelectInfoPage}
                        onSelectTool={onSelectTool}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.nav>

            <div className="relative border-t border-border/60 bg-card/60 p-4">
              <Button asChild breathing className="w-full">
                <Link href="/astro" onClick={onClose}>
                  <Sparkles className="size-4" aria-hidden="true" />
                  Get your Kundli
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NavRow({
  item,
  onClose,
  onSelectHome,
  onSelectInfoPage,
  onSelectTool,
}: {
  item: NavItem;
  onClose: () => void;
  onSelectHome?: () => void;
  onSelectInfoPage?: (key: InfoPageKey) => void;
  onSelectTool?: (key: ToolPageKey) => void;
}) {
  const Icon = item.icon;
  const rowClassName =
    "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium text-foreground/90 transition-all duration-200 hover:translate-x-1 hover:bg-gold/10 hover:text-foreground";
  const iconWrapClassName =
    "flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors group-hover:border-gold/40 group-hover:text-gold";

  const content = (
    <>
      <span className={iconWrapClassName}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      {item.label}
    </>
  );

  if (item.kind === "home") {
    return (
      <motion.div variants={ITEM_RISE}>
        {onSelectHome ? (
          <button
            type="button"
            className={cn(rowClassName, "w-full")}
            onClick={() => {
              onSelectHome();
              onClose();
            }}
          >
            {content}
          </button>
        ) : (
          <Link href="/" className={rowClassName} onClick={onClose}>
            {content}
          </Link>
        )}
      </motion.div>
    );
  }

  if (item.kind === "info") {
    return (
      <motion.div variants={ITEM_RISE}>
        {onSelectInfoPage ? (
          <button
            type="button"
            className={cn(rowClassName, "w-full")}
            onClick={() => {
              onSelectInfoPage(item.key);
              onClose();
            }}
          >
            {content}
          </button>
        ) : (
          <Link href={`/?panel=${item.key}`} className={rowClassName} onClick={onClose}>
            {content}
          </Link>
        )}
      </motion.div>
    );
  }

  if (item.kind === "tool") {
    return (
      <motion.div variants={ITEM_RISE}>
        {onSelectTool ? (
          <button
            type="button"
            className={cn(rowClassName, "w-full")}
            onClick={() => {
              onSelectTool(item.key);
              onClose();
            }}
          >
            {content}
          </button>
        ) : (
          <Link href={`/?panel=${item.key}`} className={rowClassName} onClick={onClose}>
            {content}
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={ITEM_RISE}>
      <Link href={item.href} className={rowClassName} onClick={onClose}>
        {content}
      </Link>
    </motion.div>
  );
}
