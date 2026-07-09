import type { Metadata } from "next";
import { Inter, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { CosmicBackground } from "@/components/marketing/cosmic-background";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Astro Himalaya — Vedic Astrology for Bhutan, Nepal & India",
    template: "%s | Astro Himalaya",
  },
  description:
    "Sidereal Vedic astrology for Bhutan, Nepal, India, and the diaspora — birth charts and planetary timing calculated with observatory-grade precision.",
  openGraph: {
    title: "Astro Himalaya",
    description:
      "Sidereal Vedic astrology for Bhutan, Nepal, India, and the diaspora — calculated with observatory-grade precision.",
    url: siteUrl,
    siteName: "Astro Himalaya",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${denseUi.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryProvider>
            <CosmicBackground />
            <Navbar />
            {children}
            <Footer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
