"use client";

import { useEffect, useState, type ReactNode } from "react";

import { DEFAULT_PLACE } from "../engine";

/**
 * The "Kirat Yenlon" header card, following the reference app's home card:
 * title, today's date, place/time-zone and coordinate lines, then the
 * selected date in a bordered display — sits above the month controls.
 */
export function TodayInfoBar({ selectedDate, children }: { selectedDate: Date; children?: ReactNode }) {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		const tick = () => setNow(new Date());
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, []);

	const todayLabel = (now ?? selectedDate).toLocaleDateString("en-US", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const selectedLabel = `${selectedDate.toLocaleDateString("en-US", { weekday: "long" })}, ${selectedDate.getDate()} ${selectedDate.toLocaleDateString("en-US", { month: "long" })}, ${selectedDate.getFullYear()}`;

	return (
		<div className="mt-4 rounded-2xl border border-border/60 bg-card/60 px-5 pt-4 pb-5 text-center shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)] backdrop-blur-xl">
			<p className="font-sans text-base font-bold text-foreground sm:text-lg">Kirat Yenlon</p>

			<p className="mt-2 text-sm text-foreground/80">{todayLabel}</p>
			<p className="mt-1 text-sm text-foreground/80">
				Place: {DEFAULT_PLACE.name}
				{DEFAULT_PLACE.country ? `, ${DEFAULT_PLACE.country}` : ""} | Time Zone: {DEFAULT_PLACE.timezone}
			</p>
			<p className="mt-1 text-sm text-foreground/80">
				Longitude: {formatLatLonDMS(DEFAULT_PLACE.lon, false)} | Latitude: {formatLatLonDMS(DEFAULT_PLACE.lat, true)}
			</p>

			<div className="mt-4 border-t border-dashed border-gold/40 pt-4">
				<div className="mx-auto w-full rounded-xl border border-gold/50 bg-gold/5 px-4 py-2.5 font-serif text-base font-bold text-foreground sm:text-lg">
					{selectedLabel}
				</div>
			</div>

			{children && <div className="mt-4">{children}</div>}
		</div>
	);
}

/** "89°E 38′21″" / "27°N 28′22″" — signed degrees as degree°Hemisphere minutes′seconds″. */
function formatLatLonDMS(deg: number, isLat: boolean): string {
	const hemisphere = isLat ? (deg >= 0 ? "N" : "S") : (deg >= 0 ? "E" : "W");
	const abs = Math.abs(deg);
	const totalSec = Math.round(abs * 3600);
	const d = Math.floor(totalSec / 3600);
	const m = Math.floor((totalSec % 3600) / 60);
	const s = totalSec % 60;
	const pad2 = (n: number) => String(n).padStart(2, "0");
	return `${d}°${hemisphere} ${pad2(m)}'${pad2(s)}"`;
}
