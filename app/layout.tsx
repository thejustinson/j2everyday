import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Caveat } from "next/font/google";
import "./globals.css";

// Display font — Cormorant Garamond (headings, monogram)
const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body font — Jost (all text, eyebrows, UI)
const jost = Jost({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

// Handwriting script font — Caveat (editorial handwritten titles, signatures)
const caveat = Caveat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#F8F3EC",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://j2everyday.vercel.app"
  ),
  title: "j2everyday — Jesulayomi & Justin",
  description:
    "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "j2everyday — Jesulayomi & Justin",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
    url: "https://j2everyday.vercel.app",
    siteName: "j2everyday",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jesulayomi & Justin — November 7, 2026 #j2everyday",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@thejustinson",
    creator: "@thejustinson",
    title: "j2everyday — Jesulayomi & Justin",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
    images: ["/og-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Jesulayomi & Justin's Wedding Celebration",
  description:
    "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
  startDate: "2026-11-07T11:00:00+01:00",
  endDate: "2026-11-07T18:00:00+01:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Victory International Church",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Osayogie Road, Opposite Mouka Foam Building Idowina",
      addressLocality: "Benin City",
      addressRegion: "Edo State",
      addressCountry: "NG",
    },
  },
  image: ["https://j2everyday.vercel.app/og-image.png"],
  organizer: {
    "@type": "Person",
    name: "Jesulayomi & Justin",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jost.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
