"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { GIFTS } from "../lib/config";

interface PhotoItem {
  id: number;
  url: string;
  file_key: string | null;
  uploader_name: string;
  note: string | null;
  chapter: string | null;
  is_approved: boolean;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
}

interface GiftClaimAdmin {
  id: number;
  gift_id: string;
  claimed_by: string;
  note: string | null;
  claimed_at: string;
}

interface GiftContributionAdmin {
  id: number;
  gift_id: string;
  contributor_name: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface WallMessageAdmin {
  id: number;
  sender_name: string;
  category: string;
  message: string;
  bible_reference: string | null;
  is_approved: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [giftClaims, setGiftClaims] = useState<GiftClaimAdmin[]>([]);
  const [giftContributions, setGiftContributions] = useState<GiftContributionAdmin[]>([]);
  const [messages, setMessages] = useState<WallMessageAdmin[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [mainTab, setMainTab] = useState<"photos" | "gifts" | "messages">("photos");
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved">("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async (pwd: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const [photosRes, giftsRes, messagesRes] = await Promise.all([
        fetch("/api/admin/photos", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/gifts", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/messages", { headers: { "x-admin-password": pwd } }),
      ]);

      if (!photosRes.ok) {
        if (photosRes.status === 401) {
          setErrorMsg("Incorrect passcode. Please try again.");
          setIsAuthenticated(false);
        } else {
          setErrorMsg("Failed to load dashboard data.");
        }
        setIsLoading(false);
        return;
      }

      const photosData = await photosRes.json();
      setPhotos(photosData.photos || []);
      setStats(photosData.stats || { total: 0, pending: 0, approved: 0 });

      if (giftsRes.ok) {
        const giftsData = await giftsRes.json();
        setGiftClaims(giftsData.claims || []);
        setGiftContributions(giftsData.contributions || []);
      }

      if (messagesRes.ok) {
        const msgData = await messagesRes.json();
        setMessages(msgData.messages || []);
      }

      setIsAuthenticated(true);
      sessionStorage.setItem("j2e_admin_pwd", pwd);
    } catch {
      setErrorMsg("Network error. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check saved session password on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("j2e_admin_pwd");
    if (saved) {
      setPassword(saved);
      fetchDashboardData(saved);
    }
  }, [fetchDashboardData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    fetchDashboardData(password.trim());
  };

  const togglePhotoApproval = async (id: number, currentStatus: boolean) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, is_approved: !currentStatus }),
      });

      if (res.ok) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_approved: !currentStatus } : p))
        );
        setStats((prev) => ({
          ...prev,
          pending: currentStatus ? prev.pending + 1 : prev.pending - 1,
          approved: currentStatus ? prev.approved - 1 : prev.approved + 1,
        }));
      }
    } catch {
      alert("Failed to update photo status.");
    } finally {
      setProcessingId(null);
    }
  };

  const deletePhoto = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this photo?")) return;

    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const target = photos.find((p) => p.id === id);
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        if (target) {
          setStats((prev) => ({
            total: prev.total - 1,
            pending: target.is_approved ? prev.pending : prev.pending - 1,
            approved: target.is_approved ? prev.approved - 1 : prev.approved,
          }));
        }
      }
    } catch {
      alert("Failed to delete photo.");
    } finally {
      setProcessingId(null);
    }
  };

  const releaseGiftClaim = async (giftId: string, giftTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to release the claim on "${giftTitle}"? Other guests will be able to claim it again.`
      )
    )
      return;

    try {
      const res = await fetch("/api/admin/gifts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ giftId }),
      });

      if (res.ok) {
        setGiftClaims((prev) => prev.filter((c) => c.gift_id !== giftId));
      }
    } catch {
      alert("Failed to release gift claim.");
    }
  };

  const deleteGiftContribution = async (contribId: number) => {
    if (!confirm("Are you sure you want to remove this contribution record?")) return;

    try {
      const res = await fetch("/api/admin/gifts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ contributionId: contribId }),
      });

      if (res.ok) {
        setGiftContributions((prev) => prev.filter((c) => c.id !== contribId));
      }
    } catch {
      alert("Failed to remove contribution.");
    }
  };

  const toggleMessageApproval = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id, is_approved: !currentStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, is_approved: !currentStatus } : m))
        );
      }
    } catch {
      alert("Failed to update message approval.");
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert("Failed to delete message.");
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === "pending") return !p.is_approved;
    if (activeFilter === "approved") return p.is_approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 border-b border-brown-deep/10 mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-body text-xs sm:text-sm tracking-[0.2em] uppercase text-brown-deep hover:text-gold-accent transition-colors"
          >
            <span className="text-gold-accent transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            <span>Back to Site</span>
          </Link>

          <span className="font-display italic text-lg sm:text-xl text-brown-deep">
            Jesulayomi &amp; Justin &middot; Admin
          </span>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem("j2e_admin_pwd");
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="font-body text-xs tracking-wider uppercase text-ink/50 hover:text-brown-deep cursor-pointer"
            >
              Log out
            </button>
          )}
        </div>

        {/* Login Gate */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-16 bg-white border border-brown-deep/15 rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="font-body text-[0.68rem] tracking-[0.25em] uppercase text-gold-accent font-semibold block mb-1">
                [COUPLE &middot; WEDDING ADMIN]
              </span>
              <h1 className="font-display italic text-3xl text-brown-deep">
                Welcome, Lovers
              </h1>
              <p className="font-body text-xs text-ink/70 mt-1">
                Enter your administrative passcode to review uploads, gift registry claims, and prayers.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode..."
                  className="rsvp-input text-center tracking-widest text-lg"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="font-body text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.2em] uppercase font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        ) : (
          /* Moderation Dashboard */
          <div>
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 mb-8 select-none">
              <button
                type="button"
                onClick={() => setMainTab("photos")}
                className={`px-5 py-2 rounded-full font-body text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                  mainTab === "photos"
                    ? "bg-brown-deep text-cream-light shadow-xs"
                    : "bg-white text-ink/70 border border-brown-deep/15 hover:border-brown-deep"
                }`}
              >
                Guest Photos ({stats.total})
              </button>
              <button
                type="button"
                onClick={() => setMainTab("gifts")}
                className={`px-5 py-2 rounded-full font-body text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mainTab === "gifts"
                    ? "bg-brown-deep text-cream-light shadow-xs"
                    : "bg-white text-ink/70 border border-brown-deep/15 hover:border-gold-accent"
                }`}
              >
                <span>Gift Registry</span>
                <span className="text-[0.65rem] bg-gold-accent/20 px-2 py-0.5 rounded-full text-brown-deep">
                  {giftClaims.length + giftContributions.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMainTab("messages")}
                className={`px-5 py-2 rounded-full font-body text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mainTab === "messages"
                    ? "bg-brown-deep text-cream-light shadow-xs"
                    : "bg-white text-ink/70 border border-brown-deep/15 hover:border-gold-accent"
                }`}
              >
                <span>Message Wall</span>
                <span className="text-[0.65rem] bg-gold-accent/20 px-2 py-0.5 rounded-full text-brown-deep">
                  {messages.length}
                </span>
              </button>
            </div>

            {/* TAB 1: GUEST PHOTOS */}
            {mainTab === "photos" && (
              <div>
                <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
                  <div className="bg-white border border-brown-deep/12 rounded-xl p-4 sm:p-5 text-center">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-ink/50 block mb-1">
                      Total Uploads
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-brown-deep">
                      {stats.total}
                    </span>
                  </div>

                  <div className="bg-white border border-gold-accent/40 rounded-xl p-4 sm:p-5 text-center bg-beige-warm/10">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent font-semibold block mb-1">
                      Pending Review
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-gold-accent">
                      {stats.pending}
                    </span>
                  </div>

                  <div className="bg-white border border-brown-deep/12 rounded-xl p-4 sm:p-5 text-center">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-ink/50 block mb-1">
                      Approved &amp; Live
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-emerald-800">
                      {stats.approved}
                    </span>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 mb-6">
                  {(["pending", "approved", "all"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`font-body text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                        activeFilter === filter
                          ? "bg-brown-deep text-cream-light border-brown-deep font-semibold"
                          : "bg-white text-ink/70 border-brown-deep/15 hover:border-gold-accent"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Photos Grid */}
                {filteredPhotos.length === 0 ? (
                  <div className="bg-white border border-brown-deep/12 rounded-xl p-12 text-center">
                    <p className="font-display italic text-xl text-brown-deep">
                      No {activeFilter} photos found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-white border border-brown-deep/12 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                          {photo.url.match(/\.(mp4|webm|mov)$/i) ? (
                            <video
                              src={photo.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <img
                              src={photo.url}
                              alt={`Upload by ${photo.uploader_name}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-display italic font-semibold text-brown-deep">
                                {photo.uploader_name}
                              </span>
                              <span className="text-[0.62rem] tracking-wider uppercase text-gold-accent font-medium">
                                {photo.chapter || "Moment"}
                              </span>
                            </div>
                            {photo.note && (
                              <p className="font-body text-xs text-ink/75 italic line-clamp-2">
                                &ldquo;{photo.note}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-brown-deep/8">
                            <button
                              type="button"
                              disabled={processingId === photo.id}
                              onClick={() => togglePhotoApproval(photo.id, photo.is_approved)}
                              className={`flex-1 py-1.5 rounded text-xs font-body tracking-wider uppercase font-semibold transition-colors cursor-pointer ${
                                photo.is_approved
                                  ? "bg-stone-100 text-ink/70 hover:bg-stone-200"
                                  : "bg-emerald-700 text-white hover:bg-emerald-800"
                              }`}
                            >
                              {photo.is_approved ? "Unapprove" : "Approve"}
                            </button>
                            <button
                              type="button"
                              disabled={processingId === photo.id}
                              onClick={() => deletePhoto(photo.id)}
                              className="px-3 py-1.5 rounded text-xs font-body tracking-wider uppercase text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GIFT REGISTRY & CONTRIBUTIONS */}
            {mainTab === "gifts" && (
              <div>
                <div className="bg-white border border-brown-deep/12 rounded-xl p-5 mb-6">
                  <h2 className="font-display italic text-2xl text-brown-deep mb-1">
                    Wedding Gift Wishlist &amp; Contributions
                  </h2>
                  <p className="font-body text-xs text-ink/65">
                    Real-time status of full claims and crowdfunding contributions made by guests.
                  </p>
                </div>

                {/* Recent Contributions Activity */}
                {giftContributions.length > 0 && (
                  <div className="mb-8 bg-white border border-gold-accent/30 rounded-xl p-5 shadow-2xs">
                    <h3 className="font-body text-xs tracking-[0.2em] uppercase font-semibold text-gold-accent mb-3">
                      [RECENT GUEST CONTRIBUTIONS ({giftContributions.length})]
                    </h3>
                    <div className="divide-y divide-brown-deep/8">
                      {giftContributions.map((contrib) => {
                        const gift = GIFTS.find((g) => g.id === contrib.gift_id);
                        return (
                          <div
                            key={contrib.id}
                            className="py-2.5 flex items-center justify-between text-xs gap-3"
                          >
                            <div>
                              <p className="font-medium text-brown-deep">
                                {contrib.contributor_name} gave{" "}
                                <span className="text-emerald-700 font-semibold tabular-nums">
                                  ₦{Number(contrib.amount).toLocaleString()}
                                </span>{" "}
                                towards <em>{gift ? gift.title : contrib.gift_id}</em>
                              </p>
                              {contrib.note && (
                                <p className="italic text-ink/70 mt-0.5">
                                  &ldquo;{contrib.note}&rdquo;
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteGiftContribution(contrib.id)}
                              className="text-[0.62rem] tracking-wider uppercase text-red-600 hover:text-red-800 border border-red-200 px-2 py-0.5 rounded cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GIFTS.map((gift) => {
                    const claim = giftClaims.find((c) => c.gift_id === gift.id);
                    const contribs = giftContributions.filter((c) => c.gift_id === gift.id);
                    const totalContributed = contribs.reduce(
                      (sum, c) => sum + Number(c.amount),
                      0
                    );
                    const isFullyFunded =
                      Boolean(claim) ||
                      (gift.targetAmount > 0 && totalContributed >= gift.targetAmount);

                    return (
                      <div
                        key={gift.id}
                        className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                          isFullyFunded
                            ? "border-emerald-600/40 bg-emerald-50/20"
                            : "border-brown-deep/15"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="font-body font-semibold text-brown-deep text-sm leading-snug">
                              {gift.title}
                            </h3>
                            <span className="font-display font-semibold text-base text-gold-accent tabular-nums whitespace-nowrap">
                              {gift.price}
                            </span>
                          </div>

                          <p className="font-body text-xs text-ink/60 mb-3 leading-snug">
                            {gift.description}
                          </p>

                          {/* Progress summary */}
                          <div className="mb-3 p-2.5 bg-cream-light/70 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between font-body text-[0.68rem] text-brown-deep font-semibold">
                              <span>
                                Raised: ₦{totalContributed.toLocaleString()} of {gift.price}
                              </span>
                              <span>
                                {Math.min(
                                  100,
                                  Math.round((totalContributed / gift.targetAmount) * 100)
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-brown-deep/10 overflow-hidden">
                              <div
                                className="h-full bg-emerald-600"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (totalContributed / gift.targetAmount) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Claim Status */}
                          {claim && (
                            <div className="p-3 bg-white border border-emerald-600/20 rounded-lg space-y-1 mb-4">
                              <span className="font-body text-[0.65rem] tracking-wider uppercase text-emerald-800 font-semibold block">
                                ✓ Claimed by {claim.claimed_by}
                              </span>
                              {claim.note && (
                                <p className="font-body text-xs text-ink/75 italic">
                                  &ldquo;{claim.note}&rdquo;
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer action */}
                        <div className="flex items-center justify-between pt-3 border-t border-brown-deep/8 gap-2">
                          {gift.url && gift.url !== "#" && !gift.url.startsWith("/gifts") ? (
                            <a
                              href={gift.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-body text-[0.68rem] tracking-wider uppercase text-gold-accent hover:text-brown-deep transition-colors"
                            >
                              View Retailer &rarr;
                            </a>
                          ) : (
                            <span className="font-body text-[0.65rem] tracking-wider uppercase text-ink/40">
                              {gift.category}
                            </span>
                          )}

                          {claim && (
                            <button
                              type="button"
                              onClick={() => releaseGiftClaim(gift.id, gift.title)}
                              className="font-body text-[0.65rem] tracking-wider uppercase text-red-600 hover:text-red-800 border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              Release Claim
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MESSAGE WALL */}
            {mainTab === "messages" && (
              <div>
                <div className="bg-white border border-brown-deep/12 rounded-xl p-5 mb-6">
                  <h2 className="font-display italic text-2xl text-brown-deep mb-1">
                    Message Wall Prayers &amp; Blessings
                  </h2>
                  <p className="font-body text-xs text-ink/65">
                    Manage scriptures, prayers, and words of wisdom posted by guests.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="bg-white border border-brown-deep/12 rounded-xl p-12 text-center">
                    <p className="font-display italic text-xl text-brown-deep">
                      No wall messages yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                          msg.is_approved ? "border-brown-deep/15" : "border-amber-300 bg-amber-50/20"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-brown-deep/8 mb-2">
                            <span className="text-[0.62rem] tracking-wider uppercase font-semibold text-gold-accent">
                              {msg.category}
                            </span>
                            <span className="text-[0.62rem] text-ink/40">
                              {new Date(msg.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          {msg.bible_reference && (
                            <p className="font-display italic text-sm text-gold-accent font-semibold mb-1">
                              &ldquo;{msg.bible_reference}&rdquo;
                            </p>
                          )}

                          <p className="font-body text-xs text-ink/80 italic mb-3 leading-relaxed">
                            &ldquo;{msg.message}&rdquo;
                          </p>

                          <p className="font-display italic text-brown-deep font-semibold text-sm">
                            — {msg.sender_name}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-brown-deep/8 flex items-center justify-between gap-2 mt-4">
                          <button
                            type="button"
                            onClick={() => toggleMessageApproval(msg.id, msg.is_approved)}
                            className={`text-xs px-3 py-1 rounded font-body uppercase tracking-wider font-semibold cursor-pointer ${
                              msg.is_approved
                                ? "bg-stone-100 text-ink/60 hover:bg-stone-200"
                                : "bg-emerald-700 text-white hover:bg-emerald-800"
                            }`}
                          >
                            {msg.is_approved ? "Hide" : "Approve"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteMessage(msg.id)}
                            className="text-xs text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50 uppercase tracking-wider font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
