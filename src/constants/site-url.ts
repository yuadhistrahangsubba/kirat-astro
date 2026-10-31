/** Public origin for canonical URLs, sitemap and Open Graph. Set NEXT_PUBLIC_APP_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
