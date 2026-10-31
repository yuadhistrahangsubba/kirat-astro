import { ImageResponse } from "next/og";

export const alt = "Kirat Khaik Mundhum Paturo — Kirat calendar and Vedic astrology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social share card for every route (Open Graph / Twitter).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #2a1f0e 0%, #6b4f1d 100%)",
          color: "#fbf6ea",
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 6, color: "#e8c46a" }}>KIRAT KHAIK MUNDHUM PATURO</div>
        <div style={{ marginTop: 24, fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          Kirat Calendar &amp; Vedic Astrology
        </div>
        <div style={{ marginTop: 28, fontSize: 32, opacity: 0.85 }}>
          Daily Kirat dates, panchanga and free birth charts for Bhutan and the Himalaya
        </div>
      </div>
    ),
    size,
  );
}
