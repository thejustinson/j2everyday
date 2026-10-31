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

        {/* ── Wishlist Gift List ── */}
        {activeCategory !== "Cash Gifts" && (
          <div className="divide-y divide-brown-deep/8">
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
                <div key={gift.id} className="py-6 flex gap-5 sm:gap-7 items-start">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {isFullyFunded && (
                      <div className="absolute inset-0 bg-emerald-700/80 flex items-center justify-center">
                        <span className="text-white text-base font-semibold">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-medium text-base sm:text-lg text-brown-deep leading-snug">
                          {gift.title}
                        </h3>
                        {gift.badge && !isFullyFunded && (
                          <span className="font-body text-[0.6rem] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-brown-deep/8 text-brown-deep border border-brown-deep/12">
                            {gift.badge}
                          </span>
                        )}
                        {isFullyFunded && (
                          <span className="font-body text-[0.6rem] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-600/25">
                            Fully Funded
                          </span>
                        )}
                      </div>
                      <span className="font-display font-semibold text-base sm:text-lg text-brown-deep tabular-nums flex-shrink-0">
                        {gift.price}
                      </span>
                    </div>

                    {/* Category + View link */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-body text-[0.62rem] tracking-wider uppercase text-ink/40">
                        {gift.category}
                      </span>
                      {gift.url && gift.url !== "#" && !gift.url.startsWith("/gifts") && (
                        <a
                          href={gift.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-[0.62rem] tracking-wider uppercase text-gold-accent hover:text-brown-deep transition-colors flex items-center gap-0.5"
                        >
                          View ↗
                        </a>
                      )}
                    </div>

                    <p className="font-body text-xs text-ink/60 leading-relaxed mb-3">
                      {gift.description}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-brown-deep/10 overflow-hidden mb-1.5">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isFullyFunded ? "bg-emerald-600" : "bg-gold-accent"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-[0.68rem] font-body text-ink/45 mb-3">
                      <span>
                        {isFullyFunded
                          ? "Goal achieved!"
                          : `₦${totalRaised.toLocaleString()} raised · ₦${remainingAmount.toLocaleString()} to go`}
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
                      <div className="mb-3 p-3 bg-cream-light/80 rounded-lg text-xs space-y-2 border border-brown-deep/10 max-h-36 overflow-y-auto">
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

                    {/* Action */}
                    {!isFullyFunded ? (
                      <button
                        type="button"
                        onClick={() => handleOpenContributeModal(gift)}
                        className="font-body text-xs tracking-[0.16em] uppercase font-semibold text-brown-deep border border-brown-deep/25 hover:border-gold-accent hover:text-gold-accent px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                      >
                        Contribute &rarr;
                      </button>
                    ) : (
                      <span className="font-body text-xs tracking-[0.14em] uppercase font-semibold text-emerald-700">
                        ✓ Fully Funded
                      </span>
                    )}
                  </div>
                </div>
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
                    {(() => {
                      const contribData = contributionsMap[selectedGift.id];
                      const totalSoFar = contribData ? contribData.total : 0;
                      const remaining = Math.max(0, selectedGift.targetAmount - totalSoFar);
                      return (
                        <div className="grid grid-cols-4 gap-2 mb-2">
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
                          {remaining > 0 && (
                            <button
                              type="button"
                              onClick={() => setContributionAmount(remaining.toString())}
                              className={`py-1.5 px-2 text-xs font-body rounded-lg border transition-colors cursor-pointer ${
                                contributionAmount === remaining.toString()
                                  ? "bg-gold-accent text-white border-gold-accent font-semibold"
                                  : "bg-gold-accent/10 border-gold-accent/40 text-brown-deep hover:border-gold-accent"
                              }`}
                            >
                              Pay Full
                            </button>
                          )}
                        </div>
                      );
                    })()}

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
