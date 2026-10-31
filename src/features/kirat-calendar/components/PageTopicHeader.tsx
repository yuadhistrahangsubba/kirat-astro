/**
 * A topic banner right under the site-wide header, shown only on the
 * Kirat Calendar home page — the header itself now reads "Kirat Astro" on
 * every page, so this is what actually tells a visitor "this page is the
 * calendar". Deliberately reuses the exact gold-on-bronze gradient the
 * month title banner (`.monthTitle` in kirat-calendar.module.css) already
 * uses, so the page's own "topic" reads as part of the same visual
 * language as the calendar beneath it. Flows normally with the page (not
 * fixed/sticky), same as the header above it. Deliberately just the
 * title — today's date/time/place lives in its own separate `TodayInfoBar`
 * card below, not merged into this banner.
 */
export function PageTopicHeader() {
  return (
    <div
      className="relative z-[9999] mt-5 py-3 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,.35)]"
      style={{
        background:
          "linear-gradient(135deg, var(--primary), color-mix(in oklch, var(--primary) 70%, var(--color-gold-bright) 30%))",
      }}
    >
      <p
        lang="lif"
        className="text-sm text-primary-foreground/85 sm:text-base"
        style={{ fontFamily: "var(--font-kirat)" }}
      >
        ᤀᤥᤳ ᤋᤠᤃᤧᤖᤠ ᤏᤡᤱᤘᤠᤓᤢᤔᤠᤱᤅᤣ ᤛᤣᤘᤠᤖᤥ॥
      </p>
      <p className="font-sans text-lg font-bold tracking-wide text-primary-foreground sm:text-xl">
        KIRAT KHAIK MUNDHUM CALENDAR
      </p>
    </div>
  );
}
