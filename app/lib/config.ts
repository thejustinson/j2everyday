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
export const ACCOUNTS = [
  {
    label: "Groom",
    name: "Nwachukwu Chikaodinaka",
    number: "7022805459",
    bank: "PocketApp",
  },
  {
    label: "Bride",
    name: "Eunice Jesulayomi Ibironke",
    number: "7381892897",
    bank: "PocketApp",
  },
];

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

// ── Gift Categories ─────────────────────────────────────────────
export const GIFT_CATEGORIES = [
  "All Items",
  "Kitchen & Dining",
  "Home Appliances",
  "Furniture & Home Décor",
  "Travel & Honeymoon",
  "Cash Gifts",
] as const;

export type GiftCategory = (typeof GIFT_CATEGORIES)[number];

export interface GiftItemConfig {
  id: string;
  title: string;
  category: GiftCategory;
  price: string;
  targetAmount: number;
  description: string;
  url: string;
  image: string;
  badge?: string;
}

// ── Gift Wishlist ───────────────────────────────────────────────
export const GIFTS: GiftItemConfig[] = [
  // Kitchen & Dining
  {
    id: "silver-crest-airfryer",
    title: "SILVER CREST 6.5L Airfryer",
    category: "Kitchen & Dining",
    price: "₦42,000",
    targetAmount: 42000,
    description: "Digital extra-large capacity airfryer for healthy cooking.",
    url: "https://www.jumia.com.ng/silver-crest-6.5l-digital-extra-large-capacity-airfryer-79989391.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/19/398997/1.jpg?4424",
    badge: "On Sale",
  },
  {
    id: "aeon-gas-cooker",
    title: "Aeon 4 Burner 50 x 50 Gas Cooker",
    category: "Kitchen & Dining",
    price: "₦112,999",
    targetAmount: 112999,
    description: "AGC5040J black gas cooker with 1-year warranty.",
    url: "https://www.jumia.com.ng/aeon-4-burner-50-x-50-gas-cooker-agc5040j-black-1-year-warranty-401319089.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/98/0913104/1.jpg?1174",
    badge: "On Sale",
  },
  {
    id: "gas-cylinder",
    title: "12.5Kg Gas Cylinder + Regulator & Hose",
    category: "Kitchen & Dining",
    price: "₦60,999",
    targetAmount: 60999,
    description: "Universal 12.5kg gas cylinder with regulator and safety hose.",
    url: "https://www.jumia.com.ng/universal-12.5kg-gas-cylinder-with-regulator-and-hose-cepsa-mpg12012212.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/82/8747914/1.jpg?4547",
  },
  {
    id: "zyre-sandwich-maker",
    title: "Zyre Sandwich Maker",
    category: "Kitchen & Dining",
    price: "₦22,000",
    targetAmount: 22000,
    description: "Model EL-216 fast-toasting sandwich maker with 1-year warranty.",
    url: "https://jiji.ng/oredo/kitchen-appliances/zyre-sandwich-maker-model-el-216-one-year-warranty-wECqL1xfQMDidchvXV1CEVUD.html",
    image: "https://pictures-nigeria.jijistatic.net/180920443_MzAwLTM4OS0xZTQ1N2FkZDRh.jpg",
  },
  {
    id: "hisense-microwave",
    title: "Hisense Digital Microwave 20L",
    category: "Kitchen & Dining",
    price: "₦95,000",
    targetAmount: 95000,
    description: "20L compact digital microwave oven with multi-stage cooking.",
    url: "https://jiji.ng/oredo/kitchen-appliances/hisense-digital-microwave-20l-BwUkqzLNKaTspiLxw3MgLuRH.html",
    image: "https://pictures-nigeria.jijistatic.net/178309862_MzAwLTIyNS0zOTNlYmZkMzQ3.jpg",
  },
  {
    id: "brocook-cookware",
    title: "BROCOOK 10Pcs Granite Cookware Set",
    category: "Kitchen & Dining",
    price: "₦75,000",
    targetAmount: 75000,
    description: "Non-stick die-cast granite cookware set with glass lids.",
    url: "https://www.jumia.com.ng/brocook-10pcs-die-cast-non-stick-granite-cookware-set-with-glass-lids-418866135.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/53/1668814/1.jpg?1484",
  },
  {
    id: "silver-crest-blender",
    title: "Silver Crest 2L Blender & Chopper",
    category: "Kitchen & Dining",
    price: "₦25,900",
    targetAmount: 25900,
    description: "Food chopper blender, 15-speed, 2 mixing cups.",
    url: "https://www.jumia.com.ng/silver-crest-2l-food-chopper-blender-with-2-mixing-cups-3-modes-15-adjustable-speeds-durable-420317241.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/14/2713024/1.jpg?7847",
  },
  {
    id: "modern-black-stoneware-dinnerware-set",
    title: "16-Piece Modern Stoneware Dinnerware",
    category: "Kitchen & Dining",
    price: "₦47,950",
    targetAmount: 47950,
    description: "Service for 4 — modern black stoneware plate and bowl set.",
    url: "https://www.jumia.com.ng/modern-black-stoneware-16-piece-dinnerware-set-service-for-4product-.-good-quality-dinner-set-mpg12093384.html?utm_source=social&utm_medium=pdpshare",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/05/7133024/1.jpg?2846",
  },

  // Home Appliances
  {
    id: "hisense-refrigerator",
    title: "Hisense 204L Double Door Refrigerator",
    category: "Home Appliances",
    price: "₦375,000",
    targetAmount: 375000,
    description: "Double door refrigerator with built-in water dispenser.",
    url: "https://jiji.ng/oredo/kitchen-appliances/hisense-refrigerator-double-door-with-water-dispenser-204l-hRAbARrSFlNnVNWuPrRXY1Vm.html",
    image: "https://pictures-nigeria.jijistatic.net/178022283_MzAwLTQwMC1hMDk5NjJkODYzLTE.jpg",
  },
  {
    id: "hisense-washing-machine",
    title: "Hisense 5kg Twin Tub Washing Machine",
    category: "Home Appliances",
    price: "₦175,000",
    targetAmount: 175000,
    description: "Manual wash & spin system — durable and energy efficient.",
    url: "https://www.jumia.com.ng/hisense-5kg-twin-tub-manual-washing-machine-wash-spin-503wspa-420526930.html",
    image: "https://ng.jumia.is/unsafe/fit-in/680x680/filters:fill(white)/product/03/9625024/1.jpg?0805",
  },

  // Furniture & Home Décor
  {
    id: "hamida-sofa",
    title: "HAMIDA SOFA (Taeillo)",
    category: "Furniture & Home Décor",
    price: "₦202,729.44",
    targetAmount: 202729,
    description: "Contemporary comfort and clean lines designed for our living space.",
    url: "https://taeillo.com/collections/sofas/products/hamida-sofa?variant=44360382152926",
    image: "https://taeillo.com/cdn/shop/files/hamida-sofa-sofas-39871566086366-Photoroom.png?v=1726343923&width=1200",
  },
  {
    id: "uduak-lounger",
    title: "UDUAK LOUNGER (Taeillo)",
    category: "Furniture & Home Décor",
    price: "₦91,285.04",
    targetAmount: 91285,
    description: "Relaxed sculpted silhouette lounger in premium Afro-minimalist fabric.",
    url: "https://taeillo.com/collections/sofas/products/uduak-lounger?variant=44204849430750",
    image: "https://taeillo.com/cdn/shop/files/uduak-lounger-sofas-39881243132126-Photoroom.png?v=1726502610&width=1200",
  },
  {
    id: "femi-chair",
    title: "FEMI CHAIR (Taeillo)",
    category: "Furniture & Home Décor",
    price: "₦118,435.15",
    targetAmount: 118435,
    description: "Signature occasional accent chair with sculpted wooden framing.",
    url: "https://taeillo.com/products/femi?variant=41105815077024",
    image: "https://taeillo.com/cdn/shop/files/femi-occasional-chairs-39871554945246-Photoroom.png?v=1726439135&width=1200",
  },
  {
    id: "amakisi-table",
    title: "AMAKISI PRIME TABLE (Taeillo)",
    category: "Furniture & Home Décor",
    price: "₦44,398.31",
    targetAmount: 44398,
    description: "Minimalist coffee and side table crafted with clean geometric symmetry.",
    url: "https://taeillo.com/collections/tables/products/amakisi-prime-table",
    image: "https://taeillo.com/cdn/shop/files/amakisi-prime-table-tables-39870509908190-Photoroom.png?v=1726341137&width=1200",
  },

  // Travel & Honeymoon
  {
    id: "honeymoon-fund",
    title: "Honeymoon & Getaway Fund",
    category: "Travel & Honeymoon",
    price: "₦1,500,000",
    targetAmount: 1500000,
    description: "Help us create unforgettable first memories together as husband & wife.",
    url: "/gifts#cash",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    badge: "Crowdfund",
  },
];

// ── Shared Photo Album ─────────────────────────────────────────
// Optional Google Drive, Google Photos, or Dropbox shared folder link
export const SHARED_ALBUM_URL = "#";


