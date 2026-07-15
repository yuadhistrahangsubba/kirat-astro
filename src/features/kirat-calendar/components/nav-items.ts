import type { LucideIcon } from "lucide-react";
import { Clock, Code, Compass, HelpCircle, Home, Orbit, PartyPopper, Phone, User } from "lucide-react";

import type { InfoPageKey } from "../types";

interface HomeNavItem {
  kind: "home";
  label: string;
  icon: LucideIcon;
}

interface InfoNavItem {
  kind: "info";
  key: InfoPageKey;
  label: string;
  icon: LucideIcon;
}

interface RouteNavItem {
  kind: "route";
  href: string;
  label: string;
  icon: LucideIcon;
}

export type NavItem = HomeNavItem | InfoNavItem | RouteNavItem;

export interface NavSection {
  label: string | null;
  items: NavItem[];
}

/**
 * The drawer's full nav, grouped for scannability. `home`/`info` items
 * switch local view state when the calendar's own callbacks are given
 * (see HamburgerMenu); everywhere else they fall back to real routes.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [{ kind: "home", label: "Home", icon: Home }],
  },
  {
    label: "Explore",
    items: [
      { kind: "route", href: "/astro", label: "Astro", icon: Compass },
      { kind: "route", href: "/astrologer", label: "Astrologer", icon: Phone },
      { kind: "route", href: "/faq", label: "FAQ", icon: HelpCircle },
      { kind: "route", href: "/developer", label: "Developer", icon: Code },
    ],
  },
  {
    label: "Calendar Guide",
    items: [
      { kind: "info", key: "about", label: "About Us", icon: User },
      { kind: "info", key: "yamdhangsang", label: "Yamdhangsang", icon: Clock },
      { kind: "info", key: "festivals", label: "Festivals", icon: PartyPopper },
      { kind: "info", key: "planets", label: "Planets", icon: Orbit },
    ],
  },
];
