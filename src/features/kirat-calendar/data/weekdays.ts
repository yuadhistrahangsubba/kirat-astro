/**
 * Weekday labels in Limbu (Kirat Sirijanga) and English, Sunday first.
 * Shared by the month and year views, which previously kept separate
 * copies that disagreed on Monday and Thursday.
 *
 * - Monday: a single vowel sign A. The reference app's ᤑᤥᤖᤠᤠ repeated the
 *   sign, which Limbu orthography never does (length is marked with ᤺).
 * - Thursday keeps the final -p: each short name is its full day name
 *   minus the suffix (ᤁᤢᤖᤢᤵᤐᤠ → ᤁᤢᤖᤢᤵ, like ᤑᤛᤢᤵᤐᤠ → ᤑᤛᤢᤵ).
 */
export const WEEKDAYS = [
  { kirat: "ᤋᤧᤏᤧ", en: "Sun" },
  { kirat: "ᤑᤥᤖᤠ", en: "Mon" },
  { kirat: "ᤔᤡᤰ", en: "Tue" },
  { kirat: "ᤂᤧᤰ", en: "Wed" },
  { kirat: "ᤁᤢᤖᤢᤵ", en: "Thu" },
  { kirat: "ᤑᤛᤢᤵ", en: "Fri" },
  { kirat: "ᤛᤧᤴ", en: "Sat" },
] as const;
