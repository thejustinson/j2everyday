"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import FadeIn from "./FadeIn";
import { ACCOUNTS, GIFTS, type GiftItemConfig } from "../lib/config";

interface GiftClaim {
  claimed_by: string;
  note?: string;
}

export default function Gift() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [claims, setClaims] = useState<Record<string, GiftClaim>>({});
  const [contributions, setContributions] = useState<Record<string, { total: number }>>({});
  const [claimingGift, setClaimingGift] = useState<GiftItemConfig | null>(null);
  const [claimerName, setClaimerName] = useState("");
  const [claimerNote, setClaimerNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimError, setClaimError] = useState("");

  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Fetch current claims from database
  useEffect(() => {
    async function loadClaims() {
      try {
        const res = await fetch("/api/gifts");
        if (res.ok) {
          const data = await res.json();
          if (data.contributions) {
            setContributions(data.contributions);
          }
          if (Array.isArray(data.claims)) {
            const map: Record<string, GiftClaim> = {};
            for (const c of data.claims) {
              map[c.gift_id] = {
                claimed_by: c.claimed_by,
                note: c.note || undefined,
              };
            }
            setClaims(map);
          }
        }
      } catch (err) {
        console.warn("Could not fetch gift data:", err);
      }
    }
    loadClaims();
  }, []);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingGift || !claimerName.trim()) return;

    setIsSubmitting(true);
    setClaimError("");

    try {
      const res = await fetch("/api/gifts/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: claimingGift.id,
          guestName: claimerName.trim(),
          note: claimerNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setClaimError(data.error || "Failed to record gift claim.");
        if (data.alreadyClaimed && data.claimedBy) {
          setClaims((prev) => ({
            ...prev,
            [claimingGift.id]: { claimed_by: data.claimedBy },
          }));
        }
        setIsSubmitting(false);
        return;
      }

      // Successfully claimed
      setClaims((prev) => ({
        ...prev,
        [claimingGift.id]: {
          claimed_by: claimerName.trim(),
          note: claimerNote.trim() || undefined,
        },
      }));

      // Close modal and reset form
      setClaimingGift(null);
      setClaimerName("");
      setClaimerNote("");
    } catch {
      setClaimError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="gift" className="py-20 sm:py-28 px-4 sm:px-6 bg-cream-light border-t border-brown-deep/10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ── Left Column: Polaroid Photo with Washi Tape ── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start lg:sticky lg:top-28">
            <FadeIn className="relative w-full max-w-sm">
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

          {/* ── Right Column: Wishlist & Bank Accounts ── */}
          <div className="lg:col-span-7 flex flex-col items-start w-full">
            <FadeIn delay={150} className="w-full">
              {/* Handwritten Tilted Title */}
              <div className="mb-6 select-none">
                <h2 className="font-script text-4xl sm:text-5xl md:text-6xl text-brown-deep rotate-[-1.5deg] inline-block">
                  Gifts from the &hearts;
                </h2>
              </div>

              <p className="font-body text-sm sm:text-base text-ink/80 leading-relaxed mb-6 max-w-lg">
                Your presence at our wedding is the greatest gift of all. If you would like to bless us with a wedding gift, here are items we would truly love for our new home — you can claim one so others know it is covered, or give via the bank accounts below.
              </p>

              {/* Gift Wishlist */}
              <ul className="mb-6 w-full max-w-md divide-y divide-brown-deep/8">
                {GIFTS.slice(0, 6).map((gift) => {
                  const claim = claims[gift.id];
                  const contrib = contributions[gift.id];
                  const totalRaised = contrib ? contrib.total : (claim ? gift.targetAmount : 0);
                  const isClaimed = Boolean(claim) || (gift.targetAmount > 0 && totalRaised >= gift.targetAmount);
                  const isPartiallyFunded = !isClaimed && totalRaised > 0;

                  return (
                    <li
                      key={gift.id}
                      className="py-3 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span
                            className={`font-body text-sm leading-snug transition-colors duration-150 ${
                              isClaimed
                                ? "text-ink/40 line-through"
                                : "text-ink/80 group-hover:text-brown-deep"
                            }`}
                          >
                            {gift.title}
                          </span>
                          <span className="font-display font-semibold text-xs sm:text-sm text-gold-accent tabular-nums whitespace-nowrap">
                            {gift.price}
                          </span>
                        </div>
                        {isClaimed && (
                          <span className="font-body text-[0.62rem] text-emerald-800 tracking-wider uppercase font-medium mt-0.5">
                            ✓ {claim ? `Claimed by ${claim.claimed_by}` : "Fully Funded"}
                          </span>
                        )}
                        {isPartiallyFunded && (
                          <span className="font-body text-[0.62rem] text-gold-accent tracking-wider uppercase font-medium mt-0.5">
                            ₦{totalRaised.toLocaleString()} contributed
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        {gift.url && gift.url !== "#" && !gift.url.startsWith("/gifts") ? (
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-[0.6rem] tracking-[0.15em] uppercase text-gold-accent/70 hover:text-brown-deep whitespace-nowrap transition-colors duration-150"
                          >
                            View →
                          </a>
                        ) : null}

                        {!isClaimed ? (
                          <Link
                            href="/gifts"
                            className="font-body text-[0.6rem] tracking-[0.12em] uppercase text-brown-deep hover:text-gold-accent border border-brown-deep/20 hover:border-gold-accent px-2.5 py-0.5 rounded-full transition-colors cursor-pointer whitespace-nowrap active:scale-95"
                          >
                            Contribute
                          </Link>
                        ) : (
                          <span className="font-body text-[0.58rem] tracking-[0.12em] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-600/20 font-medium whitespace-nowrap select-none">
                            Claimed
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Full Registry and Message Wall CTA links */}
              <div className="mb-8 w-full max-w-md flex flex-col sm:flex-row items-center gap-2.5">
                <Link
                  href="/gifts"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-brown-deep hover:bg-brown-deep/90 text-cream-light font-body text-xs tracking-[0.16em] uppercase font-semibold transition-all shadow-xs"
                >
                  View Full Registry ({GIFTS.length} Items) &rarr;
                </Link>
                <Link
                  href="/messages"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-white hover:bg-cream-light text-brown-deep border border-brown-deep/20 font-body text-xs tracking-[0.14em] uppercase font-semibold transition-all shadow-2xs"
                >
                  Message Wall &rarr;
                </Link>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-md">
                {ACCOUNTS.map((account, index) => (
                  <div
                    key={account.number}
                    className="bg-white border border-brown-deep/15 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-brown-deep/8 mb-3">
                      <div>
                        <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent font-semibold block mb-0.5">
                          {account.label}
                        </span>
                        <p className="font-body font-medium text-brown-deep text-sm">
                          {account.name}
                        </p>
                      </div>
                      <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-ink/40">
                        {account.bank}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-display text-2xl text-brown-deep font-semibold tracking-wider tabular-nums">
                        {account.number}
                      </p>

                      <motion.button
                        type="button"
                        onClick={() => handleCopy(account.number, index)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs uppercase tracking-[0.16em] transition-colors duration-200 shadow-sm focus-visible:outline-2 focus-visible:outline-gold-accent cursor-pointer"
                        aria-label={`Copy ${account.label} account number`}
                      >
                        <AnimatePresence mode="wait">
                          {copiedIndex === index ? (
                            <motion.span
                              key="copied"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="inline-flex items-center gap-1.5"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ── Claim Gift Modal ── */}
      <AnimatePresence>
        {claimingGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setClaimingGift(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-brown-deep/15 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="washi-tape" aria-hidden="true" />

              <div className="text-center mb-6">
                <span className="font-body text-[0.65rem] tracking-[0.25em] uppercase text-gold-accent font-semibold block mb-1">
                  [GIFT REGISTRY CLAIM]
                </span>
                <h3 className="font-display italic text-2xl text-brown-deep mb-1">
                  {claimingGift.title}
                </h3>
                <p className="font-display text-xl text-gold-accent font-semibold tabular-nums">
                  {claimingGift.price}
                </p>
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="claim-name"
                    className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                  >
                    Your Name / Family
                  </label>
                  <input
                    id="claim-name"
                    type="text"
                    required
                    value={claimerName}
                    onChange={(e) => setClaimerName(e.target.value)}
                    placeholder="e.g. Uncle Femi, Sarah & David"
                    className="rsvp-input"
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor="claim-note"
                    className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                  >
                    Blessing / Love Note (Optional)
                  </label>
                  <textarea
                    id="claim-note"
                    rows={2}
                    value={claimerNote}
                    onChange={(e) => setClaimerNote(e.target.value)}
                    placeholder="A sweet note for the newlyweds..."
                    className="rsvp-input resize-none"
                  />
                </div>

                {claimError && (
                  <p className="font-body text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {claimError}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setClaimingGift(null)}
                    className="px-4 py-2.5 rounded-lg font-body text-xs tracking-wider uppercase text-ink/60 hover:text-brown-deep transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !claimerName.trim()}
                    className="px-6 py-2.5 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.18em] uppercase font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "Saving..." : "Confirm Gift"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
