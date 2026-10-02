// ─────────────────────────────────────────────────────────────
//  j2everyday — Configuration
//  Edit this file to update all site-wide content.
//  Placeholders are marked with [ ] — replace before launch.
// ─────────────────────────────────────────────────────────────

// ── Wedding Date & Time ────────────────────────────────────────
// 11:00 AM West Africa Time (UTC+1)
export const WEDDING_DATE = new Date("2026-11-07T00:00:00+01:00");

// ── RSVP Email ────────────────────────────────────────────────
// TODO: Replace with the real email address before launch.
export const RSVP_EMAIL = "[ your@email.com ]";

// ── Venue ──────────────────────────────────────────────────────
export const VENUE = {
  name: "Victory International Church",
  address: "Osayogie Road, Opposite Mouka Foam Building Idowina, Benin, Edo State,",
  // TODO: Replace '#' with a real Google Maps or Apple Maps link.
  directionsUrl: "https://maps.app.goo.gl/HbVosiziaPjFgsUDA",
};

// ── Bank Account Details ───────────────────────────────────────
export const ACCOUNT = {
  name: "J2E.Clique",
  number: "8697099640",
  bank: "PocketApp",
};

// ── Our Story Timeline ─────────────────────────────────────────
export const TIMELINE = [
  {
    number: 1,
    heading: "We met",
    description:
      "[ A short description of how Jesulayomi and Justin first crossed paths. ]",
  },
  {
    number: 2,
    heading: "The proposal",
    description:
      "[ A short description of the proposal — how, when, and where he asked. ]",
  },
  {
    number: 3,
    heading: "The introduction",
    description:
      "[ A short description of the traditional introduction ceremony that made it official. ]",
  },
];

// ── Schedule / Itinerary ───────────────────────────────────────
export const SCHEDULE = [
  {
    time: "10:30 AM",
    title: "Guest arrival",
    description: "Please be seated at the church ahead of the ceremony.",
  },
  {
    time: "11:00 AM",
    title: "Wedding ceremony",
    description: "Join us as we exchange our vows.",
  },
  {
    time: "Afterwards",
    title: "Reception",
    description:
      "An intimate reception follows — details are on your invitation / access card.",
  },
];

// ── Dress Code ─────────────────────────────────────────────────
export const DRESS_CODE = {
  ladies:
    "[ Dress to impress in your finest. Brown, beige, and gold tones are warmly encouraged — feel free to add your own flair within the palette. ]",
  gentlemen:
    "[ Smart and elegant — suits, agbadas, or native attire welcome. Draw from the brown, beige, and gold palette and come looking your best. ]",
};

// ── Shared Photo Album ─────────────────────────────────────────
// Optional Google Drive, Google Photos, or Dropbox shared folder link
export const SHARED_ALBUM_URL = "#";

