import type { Metadata } from "next";
import { Inter, Instrument_Serif, Noto_Serif_Tibetan, Plus_Jakarta_Sans } from "next/font/google";
import { CosmicBackground } from "@/components/marketing/cosmic-background";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const denseUi = Inter({
  variable: "--font-dense-ui",
  subsets: ["latin"],
});

// Dzongkha is written in Tibetan script — needed for the སྐར་རྩིས
// (kar-tsi, "astrology") labels; system Tibetan fonts are unreliable
// across platforms, so ship one.
const tibetan = Noto_Serif_Tibetan({
  variable: "--font-tibetan",
  subsets: ["tibetan"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kirat Astro — Vedic Astrology for Bhutan, Nepal & India",
    template: "%s | Kirat Astro",
  },
  description:
    "Sidereal Vedic astrology for Bhutan, Nepal, India, and the diaspora — birth charts and planetary timing calculated with observatory-grade precision.",
  openGraph: {
    title: "Kirat Astro",
    description:
      "Sidereal Vedic astrology for Bhutan, Nepal, India, and the diaspora — calculated with observatory-grade precision.",
    url: siteUrl,
    siteName: "Kirat Astro",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${denseUi.variable} ${tibetan.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <CosmicBackground />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
