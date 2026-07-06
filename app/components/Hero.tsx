"use client";

import { useEffect, useState } from "react";
import { WEDDING_DATE } from "../lib/config";
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

/** Camera placeholder SVG — swap for a real next/image later */
function PlaceholderImage() {
  return (
    <div
      className="w-full"
      style={{
        aspectRatio: "21 / 9",
        maxHeight: "520px",
        background:
          "repeating-linear-gradient(45deg, #d9c9b9 0px, #d9c9b9 22px, #f8f3ec 22px, #f8f3ec 44px)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-label="Hero photo placeholder — our photo is coming soon"
      role="img"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        {/* Camera icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#a9824f"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "#a9824f",
            letterSpacing: "0.1em",
          }}
        >
          Our photo is coming soon
        </p>
      </div>
    </div>
  );
}

const UNITS = ["Days", "Hours", "Minutes", "Seconds"] as const;

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // Only start the countdown on the client to avoid SSR mismatch
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const values = timeLeft
    ? [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    : [0, 0, 0, 0];

  return (
    <section id="home" className="pt-16 flex flex-col">
      {/* ── Text + countdown ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-6 py-14 sm:py-20 md:py-28">
        <FadeIn>
          <span className="eyebrow mb-5">Please join us to celebrate</span>

          <h1 className="font-display text-[2.25rem] xs:text-5xl sm:text-6xl md:text-7xl text-brown-deep leading-[1.1] mb-5 mt-3">
            Jesulayomi{" "}
            <em className="not-italic italic text-gold-accent">&amp;</em>{" "}
            Justin
          </h1>

          <p className="font-body text-ink/60 text-xs sm:text-sm md:text-base tracking-wide mb-10 sm:mb-14 max-w-[280px] sm:max-w-none mx-auto">
            November 7, 2026 &mdash; Church Ceremony<br className="sm:hidden" />
            <span className="hidden sm:inline"> &middot; </span>
            <span className="block sm:inline">Time to be shared on your invitation</span>
          </p>

          {/* Countdown — only rendered client-side */}
          {timeLeft !== null && (
            <div
              className="flex items-start justify-center"
              aria-label="Countdown to the wedding"
              aria-live="off"
            >
              {UNITS.map((label, i) => (
                <div key={label} className="flex items-start">
                  {/* Number + label */}
                  <div className="flex flex-col items-center px-2 sm:px-5 md:px-8">
                    <span
                      className="font-display text-3xl sm:text-4xl md:text-6xl text-brown-deep leading-none"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {String(values[i]).padStart(2, "0")}
                    </span>
                    <span
                      className="eyebrow mt-2"
                      style={{ color: "#a9824f", fontSize: "0.6rem", letterSpacing: "0.2em" }}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Colon divider */}
                  {i < UNITS.length - 1 && (
                    <span
                      className="font-display text-2xl sm:text-3xl text-gold-accent/40 pb-4 select-none"
                      aria-hidden="true"
                    >
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </FadeIn>
      </div>

      {/* ── Placeholder hero image ── */}
      <PlaceholderImage />
    </section>
  );
}
