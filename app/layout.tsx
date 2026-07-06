import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// Display font — Cormorant Garamond (italic headings, monogram)
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

export const metadata: Metadata = {
  title: "j2everyday — Jesulayomi & Justin",
  description:
    "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
  openGraph: {
    title: "j2everyday — Jesulayomi & Justin",
    description:
      "Join Jesulayomi & Justin as they celebrate their wedding on November 7, 2026.",
    type: "website",
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
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
