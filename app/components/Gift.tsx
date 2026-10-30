"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import FadeIn from "./FadeIn";
import { ACCOUNT, GIFTS } from "../lib/config";

export default function Gift() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ACCOUNT.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="gift" className="py-20 sm:py-28 px-4 sm:px-6 bg-cream-light border-t border-brown-deep/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left Column: Polaroid Photo with Washi Tape ── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <FadeIn className="relative w-full max-w-sm">
              {/* Frosted Washi Tape */}
              <div className="washi-tape" aria-hidden="true" />

              <motion.div
                whileHover={{ y: -5, rotate: 0.5 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="polaroid-card bg-white p-3 sm:p-4 pb-6 sm:pb-8 shadow-[0_10px_35px_rgba(43,29,20,0.08),0_2px_6px_rgba(43,29,20,0.03)] rounded-xs cursor-default"
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-brown-deep/5">
                  <Image
                    src="/10.jpg"
                    alt="Jesulayomi & Justin silhouette embrace"
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover object-center"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="font-script text-2xl text-brown-deep/90 -rotate-1">
                    Two hearts, one love
                  </p>
                  <p className="font-body text-[0.65rem] tracking-[0.2em] text-ink/40 uppercase mt-0.5">
                    #j2everyday
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          </div>

          {/* ── Right Column: Tilted Handwritten Heading & Note ── */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <FadeIn delay={150} className="w-full">
              {/* Handwritten Tilted Title */}
              <div className="mb-6 select-none">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-brown-deep rotate-[-1.5deg] inline-block">
                  Gifts from the &hearts;
                </h2>
              </div>

              <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed mb-6 max-w-lg">
                We are so grateful to have you as a part of our lives, and your presence at our wedding is the greatest gift of all. If you would like to celebrate this joyous occasion with a gift, here are a few things we&apos;d love — or you can give via the account below.
              </p>

              {/* Gift Wishlist */}
              <ul className="mb-8 w-full max-w-md divide-y divide-brown-deep/8">
                {GIFTS.map((gift) => (
                  <li key={gift.title}>
                    <a
                      href={gift.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-4 py-3 group"
                    >
                      <span className="font-body text-sm text-ink/80 leading-snug group-hover:text-brown-deep transition-colors duration-150">
                        {gift.title}
                      </span>
                      <span className="font-body text-[0.6rem] tracking-[0.15em] uppercase text-gold-accent/60 group-hover:text-gold-accent whitespace-nowrap transition-colors duration-150 flex-shrink-0">
                        View →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Account Card with 1-click Copy */}

              <div className="w-full max-w-md bg-white border border-brown-deep/15 rounded-xl p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-brown-deep/8">
                  <div>
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent font-semibold block mb-0.5">
                      Bank Name
                    </span>
                    <p className="font-body font-medium text-brown-deep text-base">
                      {ACCOUNT.bank}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent font-semibold block mb-0.5">
                      Account Name
                    </span>
                    <p className="font-body font-medium text-brown-deep text-sm sm:text-base">
                      {ACCOUNT.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent font-semibold block mb-0.5">
                      Account Number
                    </span>
                    <p className="font-display text-2xl sm:text-3xl text-brown-deep font-semibold tracking-wider tabular-nums">
                      {ACCOUNT.number}
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleCopy}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs uppercase tracking-[0.16em] transition-colors duration-200 shadow-sm focus-visible:outline-2 focus-visible:outline-gold-accent"
                    aria-label="Copy account number"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span
                          key="copied"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="inline-flex items-center gap-1.5"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Copied!</span>
                        </motion.span>
                      ) : (
                        <motion.span
                          key="copy"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="inline-flex items-center gap-1.5"
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
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copy</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
