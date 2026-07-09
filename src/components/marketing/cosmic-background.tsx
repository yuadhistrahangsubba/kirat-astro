import { AuroraLayer } from "@/components/marketing/aurora-layer";
import { FloatingParticles } from "@/components/marketing/floating-particles";
import { Starfield } from "@/components/marketing/starfield";

/**
 * The whole ambient backdrop, layered back-to-front: nebula wash → aurora
 * blobs → stars → dust particles → grain. Every layer is fixed and
 * pointer-events-none so it never competes for hit-testing with real
 * content, and static effects (nebula, grain) are plain CSS/SVG since
 * they never move — only continuous motion goes through Motion.
 */
export function CosmicBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-5] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklch,var(--color-aurora-violet)_14%,transparent),transparent)]"
      />
      <AuroraLayer />
      <Starfield />
      <FloatingParticles />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.04] mix-blend-overlay"
      >
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>
    </>
  );
}
