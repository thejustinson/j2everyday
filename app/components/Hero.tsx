"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { WEDDING_DATE, VENUE } from "../lib/config";
import FadeIn from "./FadeIn";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* ── Top Header Metadata Bar ── */}
      <FadeIn className="mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-brown-deep/10">
          {/* Top Left: Handwritten signature */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-3 select-none">
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src="/j2e-logo.png"
                  alt="Jesulayomi & Justin"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-script text-2xl sm:text-3xl text-brown-deep leading-none -rotate-1">
                  Love, J &amp; J
                </span>
                <span className="font-body text-[0.6rem] uppercase tracking-[0.25em] text-ink/40 mt-1">
                  #j2everyday
                </span>
              </div>
            </Link>
          </div>

          {/* Top Right: 3 Metadata Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-left md:text-right">
            {/* Column 1: Date & Time */}
            <div>
              <p className="font-body text-[0.62rem] sm:text-[0.68rem] tracking-[0.24em] uppercase text-gold-accent font-semibold mb-1">
                Date &amp; Time
              </p>
              <p className="font-body text-xs sm:text-[0.8125rem] text-ink/80 leading-snug">
                Saturday
                <br />
                November 7, 2026
                <br />
                <span className="text-ink/60">Ceremony begins 11am</span>
              </p>
            </div>

            {/* Column 2: Ceremony */}
            <div>
              <p className="font-body text-[0.62rem] sm:text-[0.68rem] tracking-[0.24em] uppercase text-gold-accent font-semibold mb-1">
                Ceremony
              </p>
              <p className="font-body text-xs sm:text-[0.8125rem] text-ink/80 leading-snug">
                {VENUE.name}
                <br />
                <span className="text-ink/60">Osayogie Rd, Benin City</span>
                <br />
                <span className="text-ink/50">Edo State, Nigeria</span>
              </p>
            </div>

            {/* Column 3: Reception */}
            <div>
              <p className="font-body text-[0.62rem] sm:text-[0.68rem] tracking-[0.24em] uppercase text-gold-accent font-semibold mb-1">
                Reception
              </p>
              <p className="font-body text-xs sm:text-[0.8125rem] text-ink/80 leading-snug">
                Intimate Celebration
                <br />
                <span className="text-ink/60">Access by Invitation</span>
                <br />
                <span className="text-ink/50">Follows Ceremony</span>
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Main Hero Polaroid Card ── */}
      <FadeIn delay={150}>
        <div className="relative max-w-4xl mx-auto">
          {/* Frosted washi tape on top of the card */}
          <div className="washi-tape" aria-hidden="true" />

          {/* Polaroid Container */}
          <motion.div
            whileHover={{ y: -5, rotate: -0.2 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="polaroid-card rounded-xs bg-white p-3 sm:p-5 pb-6 sm:pb-8 shadow-[0_12px_40px_rgba(43,29,20,0.08),0_2px_8px_rgba(43,29,20,0.04)] cursor-default"
          >
            {/* The Photo */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-brown-deep/5">
              <Image
                src="/1.jpg"
                alt="Jesulayomi and Justin"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 950px"
                className="object-cover object-[center_28%]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-brown-deep/20 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Polaroid Bottom Caption Area */}
            <div className="mt-5 sm:mt-7 pt-4 px-2 sm:px-3 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-brown-deep/5">
              {/* Left: Romantic note */}
              <p className="font-body text-xs sm:text-sm text-ink/75 max-w-md leading-relaxed tracking-wide">
                We&apos;re tying the knot! Please join us on our special day to celebrate our love, and many more.
              </p>

              {/* Right: Handwritten signature */}
              <div className="text-right self-end select-none">
                <span className="block font-script text-2xl sm:text-3xl text-brown-deep -rotate-2">
                  Love,
                </span>
                <span className="block font-script text-3xl sm:text-4xl text-brown-deep font-semibold -rotate-1 mt-0.5">
                  Jesulayomi &amp; Justin
                </span>
              </div>
            </div>
          </motion.div>

          {/* Countdown timer ticker below the polaroid card */}
          {timeLeft !== null && (
            <div
              className="mt-6 flex items-center justify-center gap-4 sm:gap-8 font-body text-[0.68rem] sm:text-xs tracking-[0.2em] uppercase text-ink/60"
              aria-label="Countdown to the wedding"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg sm:text-xl text-brown-deep tabular-nums font-semibold">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-gold-accent text-[0.6rem]">DAYS</span>
              </div>
              <span className="text-gold-accent/40 select-none">·</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg sm:text-xl text-brown-deep tabular-nums font-semibold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-gold-accent text-[0.6rem]">HRS</span>
              </div>
              <span className="text-gold-accent/40 select-none">·</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg sm:text-xl text-brown-deep tabular-nums font-semibold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-gold-accent text-[0.6rem]">MIN</span>
              </div>
              <span className="text-gold-accent/40 select-none">·</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg sm:text-xl text-brown-deep tabular-nums font-semibold">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-gold-accent text-[0.6rem]">SEC</span>
              </div>
            </div>
          )}
          {/* Wedding Program Download */}
          <div className="mt-8 flex justify-center">
            <FadeIn delay={300}>
              <a
                href="/wedding-program"
                download
                className="inline-flex items-center gap-2.5 px-5 py-2.5 border border-brown-deep/30 hover:border-gold-accent text-brown-deep hover:text-gold-accent rounded-full font-body text-xs tracking-[0.2em] uppercase transition-colors duration-200 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="group-hover:translate-y-0.5 transition-transform duration-150"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Wedding Program
              </a>
            </FadeIn>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
