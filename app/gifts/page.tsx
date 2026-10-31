"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Monogram from "../components/Monogram";
import FadeIn from "../components/FadeIn";
import {
  GIFTS,
  GIFT_CATEGORIES,
  ACCOUNTS,
  type GiftCategory,
  type GiftItemConfig,
} from "../lib/config";

interface ContributionItem {
  id: number;
  contributor_name: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface GiftContributionsData {
  total: number;
  items: ContributionItem[];
}

interface GiftClaim {
  gift_id: string;
  claimed_by: string;
  note?: string | null;
}

export default function GiftsRegistryPage() {
  const [activeCategory, setActiveCategory] = useState<GiftCategory>("All Items");
  const [contributionsMap, setContributionsMap] = useState<
    Record<string, GiftContributionsData>
  >({});
  const [claimsMap, setClaimsMap] = useState<Record<string, GiftClaim>>({});
  const [selectedGift, setSelectedGift] = useState<GiftItemConfig | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>("");
  const [contributorName, setContributorName] = useState<string>("");
  const [contributorNote, setContributorNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedAccountIndex, setCopiedAccountIndex] = useState<number | null>(null);
  const [showNotesForGiftId, setShowNotesForGiftId] = useState<string | null>(null);

  // Fetch gift claims and contributions
  useEffect(() => {
    async function fetchGiftsData() {
      try {
        const res = await fetch("/api/gifts");
        if (res.ok) {
          const data = await res.json();
          if (data.contributions) {
            setContributionsMap(data.contributions);
          }
          if (Array.isArray(data.claims)) {
            const map: Record<string, GiftClaim> = {};
            for (const c of data.claims) {
              map[c.gift_id] = c;
            }
            setClaimsMap(map);
          }
        }
      } catch (err) {
        console.error("Failed to load gifts data:", err);
      }
    }
    fetchGiftsData();
  }, []);

  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number);
    setCopiedAccountIndex(index);
    setTimeout(() => setCopiedAccountIndex(null), 2500);
  };

  const filteredGifts = useMemo(() => {
    if (activeCategory === "All Items") return GIFTS;
    return GIFTS.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  const handleOpenContributeModal = (gift: GiftItemConfig) => {
    setSelectedGift(gift);
    setErrorMessage("");
    setSubmitSuccess(false);

    // Default contribution suggestion: either remaining balance or min preset
    const data = contributionsMap[gift.id];
    const totalRaised = data ? data.total : (claimsMap[gift.id] ? gift.targetAmount : 0);
    const remaining = Math.max(0, gift.targetAmount - totalRaised);

    if (remaining > 0 && remaining <= 50000) {
      setContributionAmount(remaining.toString());
    } else if (remaining > 0) {
      setContributionAmount(Math.min(25000, remaining).toString());
    } else {
      setContributionAmount("10000");
    }
  };

  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift || !contributorName.trim()) return;

    const numAmount = Number(contributionAmount.replace(/[^0-9]/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/gifts/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: selectedGift.id,
          contributorName: contributorName.trim(),
          amount: numAmount,
          note: contributorNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to record contribution.");
        setIsSubmitting(false);
        return;
      }

      // Optimistically update contributions map
      setContributionsMap((prev) => {
        const existing = prev[selectedGift.id] || { total: 0, items: [] };
        return {
          ...prev,
          [selectedGift.id]: {
            total: existing.total + numAmount,
            items: [
              {
                id: Date.now(),
                contributor_name: contributorName.trim(),
                amount: numAmount,
                note: contributorNote.trim() || null,
                created_at: new Date().toISOString(),
              },
              ...existing.items,
            ],
          },
        };
      });

      if (data.isFullyFunded) {
        setClaimsMap((prev) => ({
          ...prev,
          [selectedGift.id]: {
            gift_id: selectedGift.id,
            claimed_by: contributorName.trim(),
            note: contributorNote.trim() || null,
          },
        }));
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedGift(null);
        setSubmitSuccess(false);
        setContributorName("");
        setContributorNote("");
        setContributionAmount("");
      }, 2000);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-8 border-b border-brown-deep/10 mb-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-body text-xs sm:text-sm tracking-[0.2em] uppercase text-brown-deep hover:text-gold-accent transition-colors"
          >
            <span className="text-gold-accent transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <Monogram size="sm" linkTo="/" />
            <span className="font-display italic text-lg sm:text-xl text-brown-deep hidden sm:inline">
              Jesulayomi &amp; Justin
            </span>
          </div>

          <Link
            href="/messages"
            className="font-body text-xs tracking-[0.18em] uppercase font-semibold text-brown-deep border border-brown-deep/30 hover:border-gold-accent hover:text-gold-accent px-3.5 py-1.5 rounded-full transition-colors"
          >
            Message Wall
          </Link>
        </div>

        {/* Page Hero Title */}
        <FadeIn className="text-center mb-10 select-none">
          <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-2.5">
            [WEDDING REGISTRY &middot; REAL-TIME WISHLIST]
          </span>
          <h1 className="font-script text-4xl sm:text-6xl text-brown-deep rotate-[-1.5deg] leading-tight mb-3">
            Bless Our New Beginning
          </h1>
          <p className="font-body text-ink/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Your love and prayers are the greatest blessing to our union. If you would like to contribute towards our new home, honeymoon, or life experiences, explore our registry below. You can contribute any amount towards any item!
          </p>
          <p className="font-body text-xs text-ink/50 italic text-center max-w-md mx-auto mt-3">
            Kindly note: we are not yet expecting, so please no baby gifts — your love and presence are more than enough!
          </p>
        </FadeIn>

        {/* Category Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10 select-none">
          {GIFT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === "All Items"
                ? GIFTS.length
                : cat === "Cash Gifts"
                ? ACCOUNTS.length
                : GIFTS.filter((g) => g.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`
                  font-body text-xs px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5
                  ${
                    isActive
                      ? "bg-brown-deep text-cream-light border-brown-deep shadow-xs font-medium"
                      : "bg-white text-ink/75 border-brown-deep/15 hover:border-gold-accent hover:text-brown-deep"
                  }
                `}
              >
                <span>{cat}</span>
                <span
                  className={`text-[0.65rem] ${
                    isActive ? "text-cream-light/70" : "text-ink/40"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Cash Gifts Section (Shown when Cash Gifts selected or at the bottom) ── */}
        {(activeCategory === "Cash Gifts" || activeCategory === "All Items") && (
          <div className="mb-14 bg-white border border-brown-deep/12 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="text-center max-w-lg mx-auto mb-8">
              <span className="font-body text-[0.68rem] tracking-[0.22em] uppercase text-gold-accent font-semibold block mb-1">
                [DIRECT BANK TRANSFER]
              </span>
              <h2 className="font-display italic text-2xl sm:text-3xl text-brown-deep mb-2">
                Cash Blessings &amp; Gifts
              </h2>
              <p className="font-body text-ink/70 text-xs sm:text-sm">
                For guests who prefer sending a direct cash blessing to the bride or groom, kindly use the verified accounts below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {ACCOUNTS.map((account, index) => (
                <div
                  key={account.number}
                  className="bg-cream-light/60 border border-brown-deep/15 rounded-xl p-5 shadow-2xs hover:border-gold-accent/40 transition-colors"
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

                    <button
                      type="button"
                      onClick={() => handleCopy(account.number, index)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs uppercase tracking-[0.16em] transition-colors cursor-pointer"
                    >
                      {copiedAccountIndex === index ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Wishlist Gift Cards Grid ── */}
        {activeCategory !== "Cash Gifts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGifts.map((gift) => {
              const contributionData = contributionsMap[gift.id];
              const isClaimed = Boolean(claimsMap[gift.id]);
              const totalRaised = contributionData
                ? contributionData.total
                : isClaimed
                ? gift.targetAmount
                : 0;

              const percent = Math.min(
                100,
                Math.round((totalRaised / gift.targetAmount) * 100)
              );
              const isFullyFunded = isClaimed || totalRaised >= gift.targetAmount;
              const remainingAmount = Math.max(0, gift.targetAmount - totalRaised);
              const contributorCount = contributionData?.items?.length || (isClaimed ? 1 : 0);

              return (
                <motion.div
                  key={gift.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="bg-white border border-brown-deep/12 rounded-2xl overflow-hidden shadow-sm flex flex-col group"
                >
                  {/* Product Image Box */}
                  <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden flex items-center justify-center">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Pill Tag */}
                    <span className="absolute top-3 left-3 bg-cream-light/95 backdrop-blur-xs text-brown-deep border border-brown-deep/15 text-[0.62rem] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full shadow-2xs">
                      {gift.category}
                    </span>

                    {/* Sale / Crowdfund / Funded Badge */}
                    {isFullyFunded ? (
                      <span className="absolute top-3 right-3 bg-emerald-700 text-white text-[0.65rem] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span>✓</span>
                        <span>Fully Funded</span>
                      </span>
                    ) : gift.badge ? (
                      <span className="absolute top-3 right-3 bg-brown-deep text-cream-light text-[0.62rem] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full shadow-xs">
                        {gift.badge}
                      </span>
                    ) : null}
                  </div>

                  {/* Gift Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Retailer link */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-display font-medium text-lg text-brown-deep leading-snug">
                          {gift.title}
                        </h3>
                        {gift.url && gift.url !== "#" && !gift.url.startsWith("/gifts") && (
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-[0.65rem] tracking-wider uppercase text-gold-accent hover:text-brown-deep transition-colors whitespace-nowrap pt-1 flex items-center gap-0.5"
                            title="View product online"
                          >
                            <span>View</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>

                      <p className="font-body text-xs text-ink/70 leading-relaxed mb-4">
                        {gift.description}
                      </p>
                    </div>

                    {/* Pricing & Progress Bar */}
                    <div className="pt-3 border-t border-brown-deep/8">
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="font-display font-semibold text-xl text-brown-deep tabular-nums">
                          {gift.price}
                        </span>
                        <span className="font-body text-xs text-ink/60 tabular-nums">
                          {isFullyFunded
                            ? "100% funded"
                            : `₦${totalRaised.toLocaleString()} raised (${percent}%)`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-brown-deep/10 overflow-hidden mb-3">
                        <div
                          className={`h-full transition-all duration-700 ${
                            isFullyFunded ? "bg-emerald-600" : "bg-gold-accent"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Remaining / Contributor note preview */}
                      <div className="flex items-center justify-between text-[0.68rem] font-body text-ink/50 mb-4">
                        <span>
                          {isFullyFunded
                            ? "Goal achieved!"
                            : `₦${remainingAmount.toLocaleString()} needed`}
                        </span>
                        {contributorCount > 0 && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowNotesForGiftId((curr) =>
                                curr === gift.id ? null : gift.id
                              )
                            }
                            className="text-gold-accent hover:text-brown-deep underline cursor-pointer"
                          >
                            {contributorCount}{" "}
                            {contributorCount === 1 ? "contribution" : "contributions"}
                          </button>
                        )}
                      </div>

                      {/* Contributor Notes Accordion */}
                      {showNotesForGiftId === gift.id && contributionData?.items && (
                        <div className="mb-4 p-3 bg-cream-light/80 rounded-lg text-xs space-y-2 border border-brown-deep/10 max-h-36 overflow-y-auto">
                          <p className="font-body text-[0.62rem] uppercase tracking-wider text-brown-deep font-semibold">
                            Blessings for this gift:
                          </p>
                          {contributionData.items.map((item, idx) => (
                            <div key={idx} className="pb-1 border-b border-brown-deep/5 last:border-0">
                              <p className="font-medium text-brown-deep">
                                {item.contributor_name}{" "}
                                <span className="text-gold-accent font-normal tabular-nums">
                                  (₦{item.amount.toLocaleString()})
                                </span>
                              </p>
                              {item.note && (
                                <p className="italic text-ink/75 text-[0.7rem]">&ldquo;{item.note}&rdquo;</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      {!isFullyFunded ? (
                        <button
                          type="button"
                          onClick={() => handleOpenContributeModal(gift)}
                          className="w-full py-2.5 px-4 rounded-xl bg-brown-deep hover:bg-brown-deep/90 text-cream-light font-body text-xs tracking-[0.16em] uppercase font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                        >
                          <span>Contribute Towards Gift</span>
                          <span>&rarr;</span>
                        </button>
                      ) : (
                        <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-600/30 text-emerald-800 text-center font-body text-xs tracking-[0.14em] uppercase font-semibold">
                          ✓ Completed &amp; Funded
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contribution Modal ── */}
      <AnimatePresence>
        {selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedGift(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 14 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-brown-deep/15 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8"
            >
              <div className="washi-tape" aria-hidden="true" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedGift(null)}
                aria-label="Close contribution modal"
                className="absolute top-4 right-4 text-ink/40 hover:text-brown-deep p-1 text-xl leading-none"
              >
                &times;
              </button>

              <div className="text-center mb-6">
                <span className="font-body text-[0.65rem] tracking-[0.25em] uppercase text-gold-accent font-semibold block mb-1">
                  [GIFT REGISTRY CONTRIBUTION]
                </span>
                <h3 className="font-display italic text-2xl text-brown-deep mb-1">
                  {selectedGift.title}
                </h3>
                <p className="font-display text-xl text-gold-accent font-semibold tabular-nums">
                  Item Goal: {selectedGift.price}
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border border-emerald-600/20">
                    ✓
                  </div>
                  <h4 className="font-display italic text-2xl text-brown-deep mb-1">
                    Thank You So Much!
                  </h4>
                  <p className="font-body text-xs text-ink/70">
                    Your generous blessing towards this gift has been recorded for Jesulayomi &amp; Justin.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContributeSubmit} className="space-y-4">
                  {/* Contribution Amount */}
                  <div>
                    <label className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5">
                      How much would you like to give? (₦)
                    </label>

                    {/* Quick Preset Buttons */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {[10000, 25000, 50000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setContributionAmount(amt.toString())}
                          className={`py-1.5 px-2 text-xs font-body rounded-lg border transition-colors cursor-pointer ${
                            contributionAmount === amt.toString()
                              ? "bg-brown-deep text-cream-light border-brown-deep font-semibold"
                              : "bg-cream-light/60 border-brown-deep/15 text-brown-deep hover:border-gold-accent"
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="1000"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Enter amount (e.g. 20000)"
                        className="rsvp-input pl-8"
                      />
                    </div>
                  </div>

                  {/* Guest Name */}
                  <div>
                    <label
                      htmlFor="contributor-name"
                      className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                    >
                      Your Name / Family
                    </label>
                    <input
                      id="contributor-name"
                      type="text"
                      required
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      placeholder="e.g. Uncle Segun, The Adebayo Family"
                      className="rsvp-input"
                    />
                  </div>

                  {/* Personal Note / Blessing */}
                  <div>
                    <label
                      htmlFor="contributor-note"
                      className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                    >
                      Blessing / Love Note (Optional)
                    </label>
                    <textarea
                      id="contributor-note"
                      rows={2}
                      value={contributorNote}
                      onChange={(e) => setContributorNote(e.target.value)}
                      placeholder="May God bless your home with abundance..."
                      className="rsvp-input resize-none"
                    />
                  </div>

                  {/* Transfer Bank Information Box */}
                  <div className="bg-cream-light/80 border border-brown-deep/15 rounded-xl p-3.5 text-xs text-ink/75">
                    <p className="font-body text-[0.65rem] tracking-[0.16em] uppercase text-brown-deep font-semibold mb-1">
                      Direct Transfer Instruction:
                    </p>
                    <p className="mb-2 leading-relaxed">
                      Please transfer your pledged amount directly to the couple:
                    </p>
                    <div className="flex flex-col gap-1.5 font-mono text-[0.7rem] bg-white p-2 rounded border border-brown-deep/10">
                      <div className="flex justify-between items-center">
                        <span>Groom (PocketApp): <strong>7022805459</strong></span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText("7022805459")}
                          className="text-[0.62rem] text-gold-accent hover:underline uppercase"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Bride (PocketApp): <strong>7381892897</strong></span>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText("7381892897")}
                          className="text-[0.62rem] text-gold-accent hover:underline uppercase"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="font-body text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      {errorMessage}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setSelectedGift(null)}
                      className="px-4 py-2.5 rounded-lg font-body text-xs tracking-wider uppercase text-ink/60 hover:text-brown-deep transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !contributorName.trim() || !contributionAmount}
                      className="px-6 py-2.5 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.18em] uppercase font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Saving..." : "Confirm Contribution"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
