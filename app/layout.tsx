import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://j2everyday.vercel.app"
  ),
  title: "j2everyday — Jesulayomi & Justin",
  description:
    "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "j2everyday — Jesulayomi & Justin",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
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
    title: "j2everyday — Jesulayomi & Justin",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
    images: ["/og-image.png"],
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
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
