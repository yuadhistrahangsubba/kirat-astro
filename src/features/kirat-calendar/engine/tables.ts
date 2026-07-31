/**
 * Kirat Panchanga name/lookup tables, ported verbatim from the reference
 * "Kirat Calendar.html" (Yenlon — Kirat Panchanga Calculator) app.
 */

export interface NamedEntry {
	n: number;
	name: string;
}

/** Lamikkhok (Tithi) — 30 lunar days; 15 names repeat across the two fortnights. */
export const LAMIKKHOK: NamedEntry[] = [
	{ n: 1, name: "Lagungba" },
	{ n: 2, name: "Laringba" },
	{ n: 3, name: "Lagekpa" },
	{ n: 4, name: "Lawekpa" },
	{ n: 5, name: "Lagapa" },
	{ n: 6, name: "Lasugakpa" },
	{ n: 7, name: "Ladipa" },
	{ n: 8, name: "Lagamba" },
	{ n: 9, name: "Laamba" },
	{ n: 10, name: "Laghengba" },
	{ n: 11, name: "Lawemba" },
	{ n: 12, name: "Ladakpa" },
	{ n: 13, name: "Laoppa" },
	{ n: 14, name: "Lasangyepa" },
	{ n: 15, name: "Labhumba" },
	{ n: 16, name: "Lagungba" },
	{ n: 17, name: "Laringba" },
	{ n: 18, name: "Lagekpa" },
	{ n: 19, name: "Lawekpa" },
	{ n: 20, name: "Lagapa" },
	{ n: 21, name: "Lasugakpa" },
	{ n: 22, name: "Ladipa" },
	{ n: 23, name: "Lagamba" },
	{ n: 24, name: "Laamba" },
	{ n: 25, name: "Laghengba" },
	{ n: 26, name: "Lawemba" },
	{ n: 27, name: "Ladakpa" },
	{ n: 28, name: "Laoppa" },
	{ n: 29, name: "Lasangyepa" },
	{ n: 30, name: "Lasiba" },
];

/** Mangyuk (Nakshatra) — 27 lunar mansions. */
export const MANGYUK: NamedEntry[] = [
	{ n: 1, name: "Isari" },
	{ n: 2, name: "Sami" },
	{ n: 3, name: "Pomi" },
	{ n: 4, name: "Mosik" },
	{ n: 5, name: "Lishri" },
	{ n: 6, name: "Kungwa" },
	{ n: 7, name: "Samsri" },
	{ n: 8, name: "Tomi" },
	{ n: 9, name: "Langwa" },
	{ n: 10, name: "Hami" },
	{ n: 11, name: "Timi" },
	{ n: 12, name: "Hiksri" },
	{ n: 13, name: "Kesri" },
	{ n: 14, name: "Muksri" },
	{ n: 15, name: "Summi" },
	{ n: 16, name: "Maksri" },
	{ n: 17, name: "Yaik" },
	{ n: 18, name: "Khamik" },
	{ n: 19, name: "Lingwa" },
	{ n: 20, name: "Pewa" },
	{ n: 21, name: "Nuik" },
	{ n: 22, name: "Pungik" },
	{ n: 23, name: "Changik" },
	{ n: 24, name: "Phungwa" },
	{ n: 25, name: "Chami" },
	{ n: 26, name: "Lukwa" },
	{ n: 27, name: "Thangwa" },
];

/** Samyuk (Yoga) — 27 luni-solar yogas. */
export const SAMYUK: NamedEntry[] = [
	{ n: 1, name: "Ongkhaba" },
	{ n: 2, name: "Tenggiba" },
	{ n: 3, name: "Khamangba" },
	{ n: 4, name: "Simangba" },
	{ n: 5, name: "Makchiba" },
	{ n: 6, name: "Kuhalaba" },
	{ n: 7, name: "Sabungba" },
	{ n: 8, name: "Kuhalaba" },
	{ n: 9, name: "Tangwaba" },
	{ n: 10, name: "Kadalaba" },
	{ n: 11, name: "Khomangba" },
	{ n: 12, name: "Nowaba" },
	{ n: 13, name: "Khayukpa" },
	{ n: 14, name: "Yangjaba" },
	{ n: 15, name: "Seriba" },
	{ n: 16, name: "Menlaba" },
	{ n: 17, name: "Phendaba" },
	{ n: 18, name: "Maiba" },
	{ n: 19, name: "Tangdengba" },
	{ n: 20, name: "Phenjoba" },
	{ n: 21, name: "Thumlumbeba" },
	{ n: 22, name: "Tekpalba" },
	{ n: 23, name: "Chumsumba" },
	{ n: 24, name: "Takyumba" },
	{ n: 25, name: "Tonlungba" },
	{ n: 26, name: "Thakkeppa" },
	{ n: 27, name: "Tanggeba" },
];

/**
 * Khok (Karana) — 11 named half-tithis. Position 1 = fixed karana at month
 * start; 2-8 = the 7 movable karanas (repeat 8x); 9-11 = the 3 fixed
 * karanas at month end (mirrors the classical 11-karana scheme).
 */
export const KHOK: NamedEntry[] = [
	{ n: 1, name: "Lahangsing" },
	{ n: 2, name: "Lawensing" },
	{ n: 3, name: "Lagungsing" },
	{ n: 4, name: "Laimbhesing" },
	{ n: 5, name: "Laiksing" },
	{ n: 6, name: "Layumsing" },
	{ n: 7, name: "Lahasosing" },
	{ n: 8, name: "Labhongsing" },
	{ n: 9, name: "Ladhaksing" },
	{ n: 10, name: "Laakwasing" },
	{ n: 11, name: "Lasamsing" },
];

export interface KaranaResult extends NamedEntry {
	karanaNumber: number;
	khokIndex: number;
}

export function mapKarana(karanaNumber: number): KaranaResult {
	let khokIndex: number;
	if (karanaNumber === 1) khokIndex = 0;
	else if (karanaNumber === 58) khokIndex = 8;
	else if (karanaNumber === 59) khokIndex = 9;
	else if (karanaNumber === 60) khokIndex = 10;
	else khokIndex = 1 + ((karanaNumber - 2) % 7);
	const entry = KHOK[khokIndex] as NamedEntry;
	return { ...entry, karanaNumber, khokIndex };
}

/**
 * Khesemuk (Tarabala) — inclusive cyclic count (1-27) from a Birth Mangyuk
 * to the Current Mangyuk, reduced mod 9 (0 → 9), maps to a named Khese.
 */
export const KHESE_MAP: Record<number, { name: string; result: string }> = {
	1: { name: "Sawan", result: "Not Good" },
	2: { name: "Kundhe", result: "Best" },
	3: { name: "Tukkhe", result: "Bad" },
	4: { name: "Sukkhe", result: "Good" },
	5: { name: "Podhak", result: "Not Good" },
	6: { name: "Ipsingwaba", result: "Best" },
	7: { name: "Keseppa", result: "Very Bad" },
	8: { name: "Chum", result: "Good" },
	9: { name: "Panuchhum", result: "Good" },
};

/** Inclusive cyclic count from rowMangyukIdx (1-27) to currentMangyukIdx (1-27). */
export function khesemukInclusiveCount(rowMangyukIdx: number, currentMangyukIdx: number): number {
	return (((currentMangyukIdx - rowMangyukIdx + 27) % 27) + 1);
}

export function khesemukIndexFromCount(count: number): number {
	let idx = count % 9;
	if (idx === 0) idx = 9;
	return idx;
}

/**
 * Singlabamuk — inclusive count (1-12) from a Birth Titlum to the Current
 * Titlum maps to a result.
 */
export const SINGLABAMUK_RESULT_MAP: Record<number, string> = {
	1: "Auspicious",
	2: "Sewa Needed",
	3: "Auspicious",
	4: "Inauspicious",
	5: "Sewa Needed",
	6: "Auspicious",
	7: "Auspicious",
	8: "Inauspicious",
	9: "Sewa Needed",
	10: "Auspicious",
	11: "Auspicious",
	12: "Inauspicious",
};

/** Inclusive cyclic count from rowTitlumIdx (1-12) to currentTitlumIdx (1-12). */
export function singlabamukCount(rowTitlumIdx: number, currentTitlumIdx: number): number {
	return (((currentTitlumIdx - rowTitlumIdx + 12) % 12) + 1);
}

/**
 * Maps a sidereal longitude to its Mangyuk (13°20′ span) and Pada (quarter
 * within it, 3°20′, 1-4) at that instant.
 */
export function siderealToMangyukPada(lonDeg: number): {
	mangyukName: string;
	mangyukSerial: number;
	pada: number;
} {
	const span = 360 / 27;
	const lon = normalize360(lonDeg);
	const mangyukIdx = Math.floor(lon / span);
	const withinMangyuk = lon - mangyukIdx * span;
	const pada = Math.floor(withinMangyuk / (10 / 3)) + 1;
	const entry = pick(MANGYUK, mangyukIdx);
	return { mangyukName: entry.name, mangyukSerial: entry.n, pada };
}

/** Kirat Titlum (zodiac sign) names — same 12 signs/order as ZODIAC below. */
export const KIRAT_TITLUM_NAMES = [
	"Anam",
	"Wakla",
	"Kanam",
	"Hakla",
	"Manam",
	"Pakla",
	"Ranam",
	"Nakla",
	"Phanam",
	"Khakla",
	"Sanam",
	"Chakla",
];

export const ZODIAC = [
	"Aries",
	"Taurus",
	"Gemini",
	"Cancer",
	"Leo",
	"Virgo",
	"Libra",
	"Scorpio",
	"Sagittarius",
	"Capricorn",
	"Aquarius",
	"Pisces",
];

export const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

/** Labhrang (lunar fortnight) names. */
export const LABHRANG = {
	waxing: "Ladhangba",
	waning: "Lanuppa",
};

/** Kirat weekday names, keyed by JS Date.getDay() (0 = Sunday … 6 = Saturday). */
export const KIRAT_DAY_NAMES = [
	"Teneba",
	"Phoraba",
	"Mikhangba",
	"Khaksuba",
	"Kuruppa",
	"Phasuppa",
	"Senchhrengaba",
];

export const ENGLISH_DAY_NAMES = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

/**
 * Senlendat — Kirat planetary-hour cycle. A Kirat day has 12 Day + 12 Night
 * Senlendats, cycling this fixed 7-name sequence; the run for civil weekday
 * `w` starts at cycle index (w*3) % 7.
 */
export const SENLENDAT_CYCLE = ["Thung", "Tung", "Saya", "Singla", "Pung", "Payang", "Khawa"];

export const SENLENDAT_RESULTS: Record<string, string> = {
	Singla: "All works Auspicious",
	Pung: "Collection of Money",
	Payang: "Marriage",
	Khawa: "War",
	Thung: "Government work",
	Tung: "Travel",
	Saya: "Studies",
};

/**
 * Yenyem — Kirat eightfold time division. 8 Day + 8 Night slots cycling a
 * fixed 7-name sequence; Day steps +1 per slot, Night steps +5 (≡ -2) per
 * slot. Day start index = (weekday*3)%7, Night start = day start + 5.
 */
export const YENYEM_CYCLE = ["Mudo", "Membupek", "Labo", "Mangghu", "Siya", "Pano", "Tung"];

export const YENYEM_INFO: Record<string, { meaning: string; result: string }> = {
	Siya: { meaning: "Death", result: "Bad" },
	Pano: { meaning: "Auspicious", result: "Good" },
	Tung: { meaning: "Illness", result: "Bad" },
	Mudo: { meaning: "Anxiety", result: "Bad" },
	Membupek: { meaning: "Moving", result: "Good" },
	Labo: { meaning: "Profit", result: "Good" },
	Mangghu: { meaning: "Nectar", result: "Good" },
};

/**
 * Inauspicious Timing part tables — each period is a 1/8th slice of Day
 * Duration starting at Sunrise + Day Duration × part; indexed Sun=0…Sat=6.
 */
export const YEM_PHAKMURA_PARTS = [0.875, 0.125, 0.75, 0.5, 0.625, 0.375, 0.25];
export const GULAKAI_KALA_PARTS = [0.75, 0.625, 0.5, 0.375, 0.25, 0.125, 0.0];
export const YAMAGANDA_KALA_PARTS = [0.5, 0.375, 0.25, 0.125, 0.0, 0.75, 0.625];

/**
 * Midhung Yangdhok — remainder of (Weekday Number + Lamikkhok Number + 1)
 * mod 4 maps to a residence. Weekday Number: Sunday=1 … Saturday=7.
 */
const MIDHUNG_RESIDENCE_MAP: Record<number, string> = {
	0: "Khambek",
	1: "Tangsang",
	2: "Iksa",
	3: "Khambek",
};

/** Hangsam Yangdhok — (2 × Lamikkhok Number + 5) mod 7 maps to a residence. */
const HANGSAM_RESIDENCE_MAP: Record<number, string> = {
	0: "Sijumbho",
	1: "Kailaso",
	2: "Sobu",
	3: "Tamsingla",
	4: "Chumbho",
	5: "Sabhangja",
	6: "Pangwa",
};

/**
 * Short result tags shown alongside a residence, matching the reference
 * panchanga dataset's phrasing (e.g. "Iksa upto 05:58 (Destory Wealth)" —
 * spelling kept as-is) and condensed from the reference app's popup texts.
 */
export const RESIDENCE_RESULT: Record<string, string> = {
	Khambek: "Auspicious",
	Tangsang: "Life Fatal",
	Iksa: "Destory Wealth",
	Sijumbho: "Death",
	Kailaso: "Happiness",
	Sobu: "Auspicious",
	Tamsingla: "Success",
	Chumbho: "Grief",
	Sabhangja: "Suffering",
	Pangwa: "Difficulties",
};

export function midhungResidenceName(weekdayNumber: number, lamikkhokNumber: number): string {
	const idx = ((((weekdayNumber + lamikkhokNumber + 1) % 4) + 4) % 4);
	return MIDHUNG_RESIDENCE_MAP[idx] as string;
}

export function hangsamResidenceName(lamikkhokNumber: number): string {
	const idx = ((((2 * lamikkhokNumber + 5) % 7) + 7) % 7);
	return HANGSAM_RESIDENCE_MAP[idx] as string;
}

/**
 * Chrang Yangdhok — the Lamikkhok (1-30) reduced to a "Chrang Number"
 * (1-15, or 30 as a special case), then mapped to a direction.
 */
function chrangNumber(lamikkhokNumber: number): number {
	if (lamikkhokNumber === 30) return 30;
	if (lamikkhokNumber >= 16 && lamikkhokNumber <= 29) return lamikkhokNumber - 15;
	return lamikkhokNumber;
}

const CHRANG_DIRECTION_MAP: Record<number, string> = {
	1: "East",
	9: "East",
	2: "North",
	10: "North",
	3: "Southeast",
	11: "Southeast",
	4: "Southwest",
	12: "Southwest",
	5: "South",
	13: "South",
	6: "West",
	14: "West",
	7: "Northwest",
	15: "Northwest",
	8: "Northeast",
	30: "Northeast",
};

export function chrangDirection(lamikkhokNumber: number): string {
	return CHRANG_DIRECTION_MAP[chrangNumber(lamikkhokNumber)] as string;
}

/** Singlaba Yangdhok — the sidereal Moon Sign (Titlum, 1-12) mapped to a direction. */
const SINGLABA_DIRECTION_MAP: Record<number, string> = {
	1: "East",
	5: "East",
	9: "East",
	2: "South",
	6: "South",
	10: "South",
	3: "West",
	7: "West",
	11: "West",
	4: "North",
	8: "North",
	12: "North",
};

export function singlabaDirection(titlumIdx: number): string {
	return SINGLABA_DIRECTION_MAP[titlumIdx] as string;
}

export function normalize360(deg: number): number {
	let d = deg % 360;
	if (d < 0) d += 360;
	return d;
}

/** Checked table lookup — every caller derives its index by construction (mod/clamp). */
export function pick<T>(arr: readonly T[], idx: number): T {
	const v = arr[idx];
	if (v === undefined) throw new RangeError(`table index ${idx} out of range`);
	return v;
}
