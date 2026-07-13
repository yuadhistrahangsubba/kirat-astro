import { cn } from "@/lib/utils";

/**
 * A thin lungta (prayer-flag) strip in the traditional five-color order
 * — blue, white, red, green, yellow: sky, clouds, fire, water, earth.
 * Tones are muted to sit inside the dark palette; hard gradient stops
 * keep them reading as flags, not a rainbow blur.
 */
export function PrayerFlagAccent({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-[3px] w-full rounded-full opacity-70", className)}
      style={{
        background:
          "linear-gradient(to right, #3E6B9E 0 20%, #D8D4C8 20% 40%, #A8392E 40% 60%, #3E7B52 60% 80%, #C9A03B 80% 100%)",
      }}
    />
  );
}
