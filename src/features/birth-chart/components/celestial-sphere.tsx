"use client";

import { useEffect, useRef } from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { GrahaLongitudes } from "@/services/astrology/sky-positions";

/**
 * A 3D celestial sphere drawn on a 2D canvas: the sidereal zodiac as a
 * tilted ring around the observer, a starfield behind it, and the nine
 * grahas placed at their real longitudes. Hand-rolled perspective
 * projection instead of WebGL keeps it dependency-free and light.
 *
 * Changing `longitudes` sweeps every graha along the ring to its new place
 * (used to "rewind" the sky from today to a birth moment). Drag rotates.
 * Auto-rotation and sweeps are disabled under prefers-reduced-motion, and
 * the render loop sleeps while the canvas is off screen or the tab hidden.
 */

const GRAHAS: { key: keyof GrahaLongitudes; glyph: string; name: string; color: string; size: number; node?: boolean }[] = [
  { key: "sun", glyph: "☉", name: "Sun", color: "#ffc94d", size: 1.5 },
  { key: "moon", glyph: "☽", name: "Moon", color: "#e9eef8", size: 1.2 },
  { key: "mars", glyph: "♂", name: "Mars", color: "#ff6b4a", size: 0.95 },
  { key: "mercury", glyph: "☿", name: "Mercury", color: "#7fd98a", size: 0.85 },
  { key: "jupiter", glyph: "♃", name: "Jupiter", color: "#ffad5c", size: 1.15 },
  { key: "venus", glyph: "♀", name: "Venus", color: "#f6c6ff", size: 1 },
  { key: "saturn", glyph: "♄", name: "Saturn", color: "#9fb4ff", size: 1.05 },
  { key: "rahu", glyph: "☊", name: "Rahu", color: "#b7bdd1", size: 0.85, node: true },
  { key: "ketu", glyph: "☋", name: "Ketu", color: "#d8b48a", size: 0.85, node: true },
];

// U+FE0E forces text (not emoji) presentation of the zodiac glyphs.
const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((g) => `${g}︎`);

const PITCH = -0.5; // camera tilt above the ecliptic plane, radians
const AUTO_YAW_SPEED = 0.06; // radians per second
const SWEEP_RATE = 1.6; // exponential approach rate for longitude sweeps
const STAR_COUNT = 420;

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  phase: number;
}

/** Deterministic starfield so the sky looks the same on every visit. */
function makeStars(): Star[] {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: STAR_COUNT }, () => {
    const u = rand() * 2 - 1;
    const theta = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    return { x: s * Math.cos(theta), y: u, z: s * Math.sin(theta), r: 0.4 + rand() * 1.1, phase: rand() * Math.PI * 2 };
  });
}

const shortestDelta = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;

interface CelestialSphereProps {
  /** Target positions; null shows the empty sky (e.g. before the client has computed today's). */
  longitudes: GrahaLongitudes | null;
  /** Where the grahas start before sweeping to `longitudes` (defaults to `longitudes`). */
  initialLongitudes?: GrahaLongitudes | null;
  /** Sidereal Ascendant longitude, drawn as the Lagna marker. */
  ascendant?: number;
  /** Text alternative describing what the sky shows. */
  label: string;
  className?: string;
}

export function CelestialSphere({ longitudes, initialLongitudes, ascendant, label, className }: CelestialSphereProps) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    yaw: 0.9,
    shown: (initialLongitudes ?? longitudes ?? null) as GrahaLongitudes | null,
    target: longitudes,
    ascendant,
    reducedMotion,
    dragging: false,
    lastX: 0,
    visible: true,
    wake: () => {},
  });

  // Feed prop changes into the running scene without restarting it.
  useEffect(() => {
    const s = state.current;
    s.target = longitudes;
    s.ascendant = ascendant;
    s.reducedMotion = reducedMotion;
    if (!s.shown || reducedMotion) s.shown = longitudes ? { ...longitudes } : null;
    s.wake();
  }, [longitudes, ascendant, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = state.current;
    const stars = makeStars();
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(x: number, y: number, z: number, radius: number) {
      const cy = Math.cos(s.yaw);
      const sy = Math.sin(s.yaw);
      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const cp = Math.cos(PITCH);
      const sp = Math.sin(PITCH);
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      const distance = 3.2;
      const f = distance / (distance + z2);
      return { x: width / 2 + x1 * f * radius, y: height / 2 - y2 * f * radius, depth: z2, f };
    }

    const onRing = (deg: number, r: number) => {
      const a = (deg * Math.PI) / 180;
      return [Math.cos(a) * r, 0, -Math.sin(a) * r] as const;
    };

    function draw(time: number) {
      // Fill the frame: the tilted ring is wide but flat, so width limits it.
      const radius = Math.min(width * 0.38, height * 0.62);
      ctx!.clearRect(0, 0, width, height);

      // Starfield on a far sphere, twinkling gently.
      for (const star of stars) {
        const p = project(star.x * 3, star.y * 3, star.z * 3, radius);
        const twinkle = s.reducedMotion ? 0.8 : 0.65 + 0.35 * Math.sin(time / 900 + star.phase);
        ctx!.globalAlpha = Math.max(0, Math.min(1, (0.25 + 0.55 * (1 - p.depth / 3)) * twinkle));
        ctx!.fillStyle = "#fdf6e3";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, star.r * p.f, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      // Zodiac ring: brighter on the near side to read as depth.
      const SEGMENTS = 144;
      for (let i = 0; i < SEGMENTS; i++) {
        const a = project(...onRing((i / SEGMENTS) * 360, 1), radius);
        const b = project(...onRing(((i + 1) / SEGMENTS) * 360, 1), radius);
        ctx!.strokeStyle = `rgba(232, 196, 106, ${0.25 + 0.5 * Math.max(0, -a.depth)})`;
        ctx!.lineWidth = 1.4 * a.f;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }

      // 27 nakshatra ticks and 12 rashi dividers with sign glyphs.
      for (let i = 0; i < 27; i++) {
        const deg = (i * 360) / 27;
        const a = project(...onRing(deg, 1), radius);
        const b = project(...onRing(deg, 1.04), radius);
        ctx!.strokeStyle = `rgba(232, 196, 106, ${0.15 + 0.3 * Math.max(0, -a.depth)})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();
      }
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (let i = 0; i < 12; i++) {
        const a = project(...onRing(i * 30, 1), radius);
        const b = project(...onRing(i * 30, 1.12), radius);
        ctx!.strokeStyle = `rgba(232, 196, 106, ${0.3 + 0.5 * Math.max(0, -a.depth)})`;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
        ctx!.stroke();

        const g = project(...onRing(i * 30 + 15, 1.2), radius);
        ctx!.fillStyle = `rgba(245, 225, 170, ${0.35 + 0.55 * Math.max(0, -g.depth)})`;
        ctx!.font = `${Math.round(13 * g.f)}px system-ui, sans-serif`;
        ctx!.fillText(SIGN_GLYPHS[i]!, g.x, g.y);
      }

      // Bodies and the observer, painter-sorted by depth.
      type Drawable = { depth: number; draw: () => void };
      const drawables: Drawable[] = [];
      // Graha names are drawn last, nearest first, nudged apart so clustered
      // planets (a conjunction) stay readable.
      type Label = { x: number; y: number; text: string; size: number; alpha: number; depth: number };
      const labels: Label[] = [];

      const earth = project(0, 0, 0, radius);
      drawables.push({
        depth: earth.depth,
        draw: () => {
          const r = radius * 0.07;
          const grad = ctx!.createRadialGradient(earth.x - r * 0.35, earth.y - r * 0.35, r * 0.1, earth.x, earth.y, r);
          grad.addColorStop(0, "#9fd8ff");
          grad.addColorStop(0.6, "#2f7fb8");
          grad.addColorStop(1, "#173a5c");
          ctx!.fillStyle = grad;
          ctx!.beginPath();
          ctx!.arc(earth.x, earth.y, r, 0, Math.PI * 2);
          ctx!.fill();
        },
      });

      if (s.ascendant !== undefined) {
        const tip = project(...onRing(s.ascendant, 1.12), radius);
        drawables.push({
          depth: tip.depth - 0.5,
          draw: () => {
            ctx!.setLineDash([4, 4]);
            ctx!.strokeStyle = "rgba(255, 214, 120, 0.85)";
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();
            ctx!.moveTo(earth.x, earth.y);
            ctx!.lineTo(tip.x, tip.y);
            ctx!.stroke();
            ctx!.setLineDash([]);
            ctx!.fillStyle = "rgba(255, 224, 150, 0.95)";
            ctx!.font = `600 ${Math.round(11 * tip.f)}px system-ui, sans-serif`;
            ctx!.fillText("LAGNA", tip.x, tip.y - 10 * tip.f);
          },
        });
      }

      if (s.shown) {
        for (const graha of GRAHAS) {
          const p = project(...onRing(s.shown[graha.key], 1), radius);
          drawables.push({
            depth: p.depth,
            draw: () => {
              const r = Math.max(3, radius * 0.032 * graha.size * p.f);
              const dim = 0.55 + 0.45 * Math.max(0, Math.min(1, 0.5 - p.depth));
              const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
              glow.addColorStop(0, `${graha.color}88`);
              glow.addColorStop(1, `${graha.color}00`);
              ctx!.globalAlpha = dim;
              ctx!.fillStyle = glow;
              ctx!.beginPath();
              ctx!.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
              ctx!.fill();
              ctx!.beginPath();
              ctx!.arc(p.x, p.y, r, 0, Math.PI * 2);
              if (graha.node) {
                ctx!.strokeStyle = graha.color;
                ctx!.lineWidth = 1.5;
                ctx!.stroke();
              } else {
                ctx!.fillStyle = graha.color;
                ctx!.fill();
              }
              ctx!.globalAlpha = 1;
              labels.push({
                x: p.x,
                y: p.y + r + 10 * p.f,
                text: `${graha.glyph} ${graha.name}`,
                size: Math.round(11 * p.f),
                alpha: dim,
                depth: p.depth,
              });
            },
          });
        }
      }

      drawables.sort((a, b) => b.depth - a.depth).forEach((d) => d.draw());

      const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
      for (const label of labels.sort((a, b) => a.depth - b.depth)) {
        ctx!.font = `500 ${label.size}px system-ui, sans-serif`;
        const w = ctx!.measureText(label.text).width + 6;
        const h = label.size + 3;
        const step = h;
        let y = label.y;
        for (const offset of [0, step, -2 * step, 2 * step, -3 * step, 3 * step]) {
          y = label.y + offset;
          const box = { x0: label.x - w / 2, x1: label.x + w / 2, y0: y - h / 2, y1: y + h / 2 };
          if (!placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) {
            placed.push(box);
            break;
          }
        }
        ctx!.globalAlpha = label.alpha;
        ctx!.fillStyle = "rgba(5, 7, 15, 0.55)";
        ctx!.fillRect(label.x - w / 2, y - h / 2, w, h);
        ctx!.fillStyle = "#fbf3dc";
        ctx!.fillText(label.text, label.x, y);
        ctx!.globalAlpha = 1;
      }
    }

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let animating = false;

      if (!s.reducedMotion && !s.dragging) s.yaw += AUTO_YAW_SPEED * dt;

      if (s.target) {
        if (!s.shown || s.reducedMotion) s.shown = { ...s.target };
        const k = 1 - Math.exp(-SWEEP_RATE * dt);
        for (const graha of GRAHAS) {
          const delta = shortestDelta(s.shown[graha.key], s.target[graha.key]);
          if (Math.abs(delta) > 0.01) {
            s.shown[graha.key] += delta * k;
            animating = true;
          } else {
            s.shown[graha.key] = s.target[graha.key];
          }
        }
      }

      draw(now);
      const keepGoing = s.visible && !document.hidden && (!s.reducedMotion || animating || s.dragging);
      frame = keepGoing ? requestAnimationFrame(tick) : 0;
    }

    s.wake = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      s.wake();
    });
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => {
      s.visible = entry?.isIntersecting ?? true;
      if (s.visible) s.wake();
    });
    intersection.observe(canvas);
    const onVisibility = () => !document.hidden && s.wake();
    document.addEventListener("visibilitychange", onVisibility);

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
      s.wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.yaw += (e.clientX - s.lastX) * 0.008;
      s.lastX = e.clientX;
    };
    const onUp = () => {
      s.dragging = false;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    s.wake();
    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      s.wake = () => {};
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div role="img" aria-label={label} className={cn("relative", className)}>
      {/* touch-action pan-y: horizontal drags rotate, vertical swipes still scroll. */}
      <canvas ref={canvasRef} aria-hidden="true" className="size-full cursor-grab touch-pan-y active:cursor-grabbing" />
    </div>
  );
}

/** "Sun in Libra 14°, Moon in Taurus 3°, …" — the sphere's text alternative. */
export function describeSky(longitudes: GrahaLongitudes | null, signNames: readonly string[]): string {
  if (!longitudes) return "The zodiac ring and stars; planet positions are loading.";
  return GRAHAS.map(({ key, name }) => {
    const lon = longitudes[key];
    return `${name} in ${signNames[Math.floor(lon / 30)]} ${Math.floor(lon % 30)}°`;
  }).join(", ");
}
