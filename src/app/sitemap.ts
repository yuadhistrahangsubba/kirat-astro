import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/site-url";

const ROUTES = ["/", "/astro", "/astrologer", "/faq", "/developer"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
