/**
 * Yele — the Kirat solar calendar, ported verbatim from the reference
 * Kirat Calendar app's "Yele Date Converter" module. A precomputed
 * per-Gregorian-year table maps each Gregorian month to the day its Kirat
 * month starts (`reset`) and the day-number the previous Kirat month had
 * reached on the 1st (`start`). Covers AD 2000-2100; independent of the
 * astronomical Panchanga engine.
 */

export const KIRAT_YELE_MONTHS = [
	"Kakphekwa",
	"Sapphekwa",
	"Cherengnam",
	"Therengnam",
	"Kapmeppa",
	"Thakmeppa",
	"Sisekpa",
	"Thesekpa",
	"Sisekro",
	"Thesekro",
	"Senchhrengla",
	"Sisekla",
];

interface YeleMonthRule {
	start: number;
	reset: number;
}

const KIRAT_YELE_DATA: Record<number, Record<number, YeleMonthRule>> = {
	2000: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2001: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 12 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2002: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2003: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2004: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2005: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 12 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2006: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2007: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2008: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2009: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 12 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2010: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2011: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2012: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2013: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 12 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2014: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2015: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2016: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2017: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2018: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2019: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2020: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2021: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2022: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2023: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2024: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 13 }, 5: { start: 19, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 16 }, 8: { start: 17, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2025: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2026: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2027: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2028: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2029: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2030: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2031: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2032: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 14 }, 6: { start: 19, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 17 }, 11: { start: 16, reset: 16 }, 12: { start: 16, reset: 16 } },
	2033: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2034: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2035: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2036: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2037: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2038: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2039: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2040: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 18, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2041: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2042: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2043: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2044: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 16 }, 12: { start: 16, reset: 16 } },
	2045: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2046: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2047: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2048: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2049: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2050: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2051: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2052: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2053: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2054: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2055: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2056: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2057: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2058: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2059: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2060: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2061: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2062: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2063: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2064: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2065: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2066: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2067: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2068: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2069: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2070: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2071: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2072: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2073: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2074: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2075: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2076: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2077: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2078: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2079: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2080: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2081: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2082: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2083: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2084: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2085: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2086: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2087: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2088: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2089: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2090: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2091: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2092: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2093: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2094: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2095: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2096: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 17, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2097: { 1: { start: 17, reset: 14 }, 2: { start: 19, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
	2098: { 1: { start: 17, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2099: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 13 }, 3: { start: 17, reset: 15 }, 4: { start: 18, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 16 }, 7: { start: 16, reset: 17 }, 8: { start: 16, reset: 18 }, 9: { start: 15, reset: 18 }, 10: { start: 14, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 17 } },
	2100: { 1: { start: 16, reset: 15 }, 2: { start: 18, reset: 14 }, 3: { start: 16, reset: 14 }, 4: { start: 19, reset: 14 }, 5: { start: 18, reset: 15 }, 6: { start: 18, reset: 15 }, 7: { start: 17, reset: 17 }, 8: { start: 16, reset: 17 }, 9: { start: 16, reset: 17 }, 10: { start: 15, reset: 18 }, 11: { start: 15, reset: 17 }, 12: { start: 15, reset: 16 } },
};

const YELE_OFFSET_CURRENT = 3061;
const YELE_OFFSET_PREVIOUS = 3060;
export const YELE_MIN_AD_YEAR = 2000;
export const YELE_MAX_AD_YEAR = 2100;
const YELE_DAY_MS = 86400000;

export interface KiratDate {
	kiratYear: number;
	kiratMonth: number;
	kiratDay: number;
	monthName: string;
}

/** Gregorian -> Kirat Yele. Returns null outside the supported AD range. */
export function gregorianToKirat(year: number, month: number, day: number): KiratDate | null {
	const yearData = KIRAT_YELE_DATA[year];
	if (!yearData) return null;
	const entry = yearData[month];
	if (!entry) return null;

	let kiratMonth: number;
	let kiratDay: number;
	if (day < entry.reset) {
		// Still finishing the previous Kirat month.
		kiratMonth = month === 1 ? 12 : month - 1;
		kiratDay = entry.start + (day - 1);
	} else {
		// The new Kirat month (matching this Gregorian month's slot) has begun.
		kiratMonth = month;
		kiratDay = day - entry.reset + 1;
	}

	const kiratYear = month === 1 && day < entry.reset ? year + YELE_OFFSET_PREVIOUS : year + YELE_OFFSET_CURRENT;

	return { kiratYear, kiratMonth, kiratDay, monthName: KIRAT_YELE_MONTHS[kiratMonth - 1] as string };
}

/** Kirat Yele -> Gregorian. Returns null outside the supported range or for an invalid day. */
export function kiratToGregorian(
	kiratYear: number,
	kiratMonth: number,
	kiratDay: number,
): { adDate: Date; monthStartDate: Date; maxDay: number } | null {
	const gregYear = kiratYear - YELE_OFFSET_CURRENT;
	const yearData = KIRAT_YELE_DATA[gregYear];
	if (!yearData) return null;
	const entry = yearData[kiratMonth];
	if (!entry) return null;

	const startDate = new Date(gregYear, kiratMonth - 1, entry.reset);

	const nextMonth = kiratMonth === 12 ? 1 : kiratMonth + 1;
	const nextYear = kiratMonth === 12 ? gregYear + 1 : gregYear;
	const nextYearData = KIRAT_YELE_DATA[nextYear];
	let maxDay = 32;
	if (nextYearData?.[nextMonth]) {
		const nextStartDate = new Date(nextYear, nextMonth - 1, nextYearData[nextMonth].reset);
		maxDay = Math.round((nextStartDate.getTime() - startDate.getTime()) / YELE_DAY_MS);
	}

	if (kiratDay < 1 || kiratDay > maxDay) return null;

	const adDate = new Date(startDate.getTime());
	adDate.setDate(adDate.getDate() + (kiratDay - 1));
	return { adDate, monthStartDate: startDate, maxDay };
}

/**
 * Kirat day-of-month for a Gregorian date — same contract as the legacy
 * getKiratDate in data/kirat-rules.ts ("" outside the supported range).
 */
export function getKiratDayNumber(year: number, month: number, day: number): number | "" {
	const k = gregorianToKirat(year, month, day);
	return k ? k.kiratDay : "";
}

/**
 * Month-header text in the reference app's calendar style: a Gregorian
 * month usually spans two Kirat months, shown as "MonthA - YearA : MonthB -
 * YearB" (or just one when the whole month falls within a single Kirat month).
 */
export function getKiratMonthHeaderText(year: number, month: number): string {
	const daysInMonth = new Date(year, month, 0).getDate();
	const firstK = gregorianToKirat(year, month, 1);
	const lastK = gregorianToKirat(year, month, daysInMonth);
	if (!firstK && !lastK) return "";
	const sameMonth = firstK && lastK && firstK.kiratMonth === lastK.kiratMonth && firstK.kiratYear === lastK.kiratYear;
	if (sameMonth) return `${firstK.monthName} - ${firstK.kiratYear}`;
	const parts: string[] = [];
	if (firstK) parts.push(`${firstK.monthName} - ${firstK.kiratYear}`);
	if (lastK) parts.push(`${lastK.monthName} - ${lastK.kiratYear}`);
	return parts.join(" : ");
}

/**
 * Month-header label for a Gregorian month, in the style the reference
 * panchanga dataset uses (e.g. "Kapmeppa - Thakmeppa, 5087", or with both
 * years spelled out when the Kirat year changes inside the month).
 */
export function getKiratMonthYearLabel(year: number, month: number): string {
	const daysInMonth = new Date(year, month, 0).getDate();
	const firstK = gregorianToKirat(year, month, 1);
	const lastK = gregorianToKirat(year, month, daysInMonth);
	if (!firstK || !lastK) return "";
	if (firstK.kiratMonth === lastK.kiratMonth && firstK.kiratYear === lastK.kiratYear) {
		return `${firstK.monthName}, ${firstK.kiratYear}`;
	}
	if (firstK.kiratYear === lastK.kiratYear) {
		return `${firstK.monthName} - ${lastK.monthName}, ${firstK.kiratYear}`;
	}
	return `${firstK.monthName}, ${firstK.kiratYear} - ${lastK.monthName}, ${lastK.kiratYear}`;
}
