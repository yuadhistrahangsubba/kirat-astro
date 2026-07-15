export interface Astrologer {
  id: string;
  name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  languages: string;
  specialties: string[];
  photo: string;
}

// Placeholder directory — swap in real astrologers' details and photos when ready.
// The grid below scales to however many entries are in this array.
export const ASTROLOGERS: Astrologer[] = [
  {
    id: "astrologer-1",
    name: "Astrologer Name 1",
    title: "Vedic Astrologer & Nakshatra Reader",
    bio: "Guiding readings through Kundli, Dasha timing, and Nakshatra analysis rooted in classical Vedic tradition — with plain, honest explanations, not vague mysticism.",
    phone: "+975 00 000 000",
    email: "astrologer1@kirat-astro.com",
    languages: "Dzongkha, Nepali & English",
    specialties: ["Kundli & Dasha", "Marriage Matching", "Career Timing", "Remedies"],
    photo: "https://images.unsplash.com/photo-1694886322150-eb00368cee6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "astrologer-2",
    name: "Astrologer Name 2",
    title: "Kundli & Dasha Specialist",
    bio: "Focused on birth chart accuracy and life-timing questions — when to expect change, and how to prepare for it, drawn from your own planetary periods.",
    phone: "+975 00 000 001",
    email: "astrologer2@kirat-astro.com",
    languages: "Dzongkha & English",
    specialties: ["Birth Chart Review", "Dasha Timing", "Health & Wellbeing"],
    photo: "https://images.unsplash.com/photo-1769598250196-2c67d4ea7f74?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "astrologer-3",
    name: "Astrologer Name 3",
    title: "Marriage & Career Astrologer",
    bio: "Specializes in compatibility readings and career-timing questions, blending traditional matching techniques with clear, modern guidance.",
    phone: "+975 00 000 002",
    email: "astrologer3@kirat-astro.com",
    languages: "Nepali & English",
    specialties: ["Marriage Matching", "Career Timing", "Finance"],
    photo: "https://images.unsplash.com/photo-1768655012921-161d5fb4b0de?auto=format&fit=crop&w=900&q=80",
  },
];
