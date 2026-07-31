import type { LucideIcon } from "lucide-react";
import {
	ArrowLeftRight,
	Clock3,
	Code,
	Compass,
	Globe,
	HelpCircle,
	Home,
	Hourglass,
	Moon,
	Orbit,
	Phone,
	Star,
	Telescope,
	User,
} from "lucide-react";

import type { InfoPageKey, ToolPageKey } from "../types";

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

interface ToolNavItem {
  kind: "tool";
  key: ToolPageKey;
  label: string;
  icon: LucideIcon;
}

interface RouteNavItem {
  kind: "route";
  href: string;
  label: string;
  icon: LucideIcon;
}

export type NavItem = HomeNavItem | InfoNavItem | ToolNavItem | RouteNavItem;

export interface NavSection {
  label: string | null;
  items: NavItem[];
}

/**
 * The drawer's full nav, grouped for scannability. `home`/`info`/`tool`
 * items switch local view state when the calendar's own callbacks are given
 * (see HamburgerMenu); everywhere else they fall back to real routes.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    label: null,
    items: [
      { kind: "home", label: "Home", icon: Home },
      { kind: "tool", key: "senlendat", label: "Senlendat", icon: Clock3 },
      { kind: "tool", key: "yenyemdat", label: "Yenyemdat", icon: Hourglass },
      { kind: "tool", key: "khesemuk", label: "Khesemuk", icon: Star },
      { kind: "tool", key: "singlabamuk", label: "Singlabamuk", icon: Moon },
      { kind: "tool", key: "planets", label: "Planets", icon: Orbit },
      { kind: "tool", key: "ephemeris", label: "Ephemeris", icon: Telescope },
      { kind: "tool", key: "ayanamsha", label: "Ayanamsha", icon: Globe },
      { kind: "tool", key: "yeleconverter", label: "Yele Converter", icon: ArrowLeftRight },
    ],
  },
  {
    label: "Explore",
    items: [
      { kind: "route", href: "/astro", label: "Astro", icon: Compass },
      { kind: "route", href: "/astrologer", label: "Astrologer", icon: Phone },
      { kind: "route", href: "/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "Contact",
    items: [
      { kind: "info", key: "about", label: "About Us", icon: User },
      { kind: "route", href: "/developer", label: "Developer", icon: Code },
    ],
  },
];
