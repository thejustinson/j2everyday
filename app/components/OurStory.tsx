"use client";

import Image from "next/image";
import { motion } from "motion/react";
import FadeIn from "./FadeIn";
import { TIMELINE } from "../lib/config";

const CHAPTER_PHOTOS = [
  {
    src: "/9.jpg",
    alt: "Jesulayomi and Justin smiling together in casual matching outfits",
  },
  {
    src: "/4.jpg",
    alt: "Close-up portrait highlighting the engagement ring",
  },
  {
    src: "/2.jpg",
    alt: "Jesulayomi and Justin in ceremonial celebration attire",
  },
];

export default function OurStory() {
  return (
    <section id="our-story" className="bg-brown-deep py-20 sm:py-28 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-16 md:mb-20">
          <span className="font-body text-[0.68rem] tracking-[0.26em] uppercase text-gold-accent font-semibold block mb-3">
            Our Journey
          </span>
          <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-cream-light leading-tight rotate-[-1deg]">
            How it all began
          </h2>
          <p className="font-body text-beige-warm/75 text-sm sm:text-base max-w-sm mx-auto leading-relaxed mt-3">
            Two paths, one love story &mdash; here&apos;s how our chapter unfolded.
          </p>
        </FadeIn>

        {/* Timeline — 3-col on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {TIMELINE.map((item, idx) => {
            const photo = CHAPTER_PHOTOS[idx] || CHAPTER_PHOTOS[0];

            return (
              <FadeIn
                key={item.number}
                delay={idx * 120}
                className="flex flex-col items-center md:items-start text-center md:text-left group"
              >
                {/* Polaroid card with washi tape */}
                <div className="relative w-full">
                  <div className="washi-tape opacity-90" aria-hidden="true" />

                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="polaroid-card bg-white p-3 pb-5 rounded-xs shadow-md mb-6 cursor-default"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-brown-deep/5">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Polaroid handwritten caption */}
                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className="font-script text-xl text-brown-deep font-semibold">
                        Chapter 0{item.number}
                      </span>
                      <span className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-ink/40">
                        #j2everyday
                      </span>
                    </div>
                  </motion.div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl text-cream-light mb-2">
                  {item.heading}
                </h3>
                <p className="font-body text-beige-warm/70 text-sm leading-relaxed">
                  {item.description}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
