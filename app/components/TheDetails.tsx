"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeIn from "./FadeIn";
import { SCHEDULE, VENUE, DRESS_CODE } from "../lib/config";

const SWATCHES = [
  { name: "Deep Brown", hex: "#4A3429", label: "Primary text & accents" },
  { name: "Warm Beige", hex: "#D9C9B9", label: "Secondary tones" },
  { name: "Gold Accent", hex: "#A9824F", label: "Eyebrows & highlights" },
];

export default function TheDetails() {
  return (
    <section id="schedule" className="py-20 sm:py-28 px-4 sm:px-6 bg-cream-light border-t border-brown-deep/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ── Left Column: Metadata & Details ── */}
          <div className="lg:col-span-7 flex flex-col gap-12 order-2 lg:order-1">
            {/* 1. Itinerary */}
            <FadeIn>
              <div className="flex flex-col">
                <span className="font-body text-[0.68rem] tracking-[0.26em] uppercase text-gold-accent font-semibold mb-4">
                  Itinerary
                </span>

                <div className="space-y-4 font-body">
                  {SCHEDULE.map((item) => (
                    <div
                      key={item.time}
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm sm:text-[0.9375rem] text-ink/80 group"
                    >
                      <span className="font-semibold sm:font-medium text-brown-deep tracking-wide flex-shrink-0 min-w-[90px]">
                        {item.time}
                      </span>
                      {/* Dot leaders */}
                      <span
                        className="hidden sm:inline-block flex-grow border-b border-dotted border-brown-deep/30 mx-3 mb-1"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-ink/90 sm:text-right">
                        {item.title}
                        {item.description && (
                          <span className="block sm:inline text-xs text-ink/50 sm:ml-2 font-normal">
                            ({item.description})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* 2. Venue & Ceremony (Anchor for #venue) */}
            <FadeIn delay={100}>
              <div id="venue" className="pt-8 border-t border-brown-deep/10">
                <span className="font-body text-[0.68rem] tracking-[0.26em] uppercase text-gold-accent font-semibold mb-3 block">
                  Ceremony &amp; Venue
                </span>

                <h3 className="font-display text-2xl text-brown-deep mb-2 font-medium">
                  {VENUE.name}
                </h3>
                <p className="font-body text-xs sm:text-sm text-ink/70 leading-relaxed max-w-md">
                  {VENUE.address}
                </p>

                <a
                  href={VENUE.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 font-body text-xs tracking-wider uppercase text-gold-accent hover:text-brown-deep transition-colors duration-200 border-b border-gold-accent/40 hover:border-brown-deep pb-0.5"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            </FadeIn>

            {/* 3. Attire & Palette (Anchor for #dress-code) */}
            <FadeIn delay={200}>
              <div id="dress-code" className="pt-8 border-t border-brown-deep/10">
                <span className="font-body text-[0.68rem] tracking-[0.26em] uppercase text-gold-accent font-semibold mb-3 block">
                  Attire
                </span>

                <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed mb-4">
                  Cocktail attire &amp; smart elegant native dress warmly welcomed.
                </p>

                {/* Color Palette Swatches */}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {SWATCHES.map((color) => (
                    <motion.div
                      key={color.name}
                      whileHover={{ scale: 1.08, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="flex items-center gap-2 cursor-default"
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-brown-deep/20 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      <span className="font-body text-xs text-ink/70">
                        {color.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column: Polaroid with Washi Tape & Handwritten Title ── */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end order-1 lg:order-2">
            <FadeIn delay={100} className="relative w-full max-w-sm">
              {/* Handwritten Tilted Title */}
              <div className="mb-4 text-center lg:text-right select-none">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-brown-deep rotate-[-2deg] inline-block">
                  The Details
                </h2>
              </div>

              {/* Polaroid Frame */}
              <div className="relative">
                {/* Frosted Washi Tape */}
                <div className="washi-tape" aria-hidden="true" />

                <motion.div
                  whileHover={{ y: -5, rotate: -0.5 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="polaroid-card bg-white p-3 sm:p-4 pb-6 sm:pb-8 shadow-[0_10px_35px_rgba(43,29,20,0.08),0_2px_6px_rgba(43,29,20,0.03)] rounded-xs cursor-default"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-brown-deep/5">
                    <Image
                      src="/3.jpg"
                      alt="Jesulayomi and Justin"
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="font-script text-2xl text-brown-deep/90 -rotate-1">
                      Our special celebration
                    </p>
                    <p className="font-body text-[0.65rem] tracking-[0.2em] text-ink/40 uppercase mt-0.5">
                      November 7, 2026
                    </p>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
