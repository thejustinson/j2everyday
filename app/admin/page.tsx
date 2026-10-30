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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [giftClaims, setGiftClaims] = useState<GiftClaimAdmin[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [mainTab, setMainTab] = useState<"photos" | "gifts">("photos");
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "approved">("pending");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async (pwd: string) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const [photosRes, giftsRes] = await Promise.all([
        fetch("/api/admin/photos", { headers: { "x-admin-password": pwd } }),
        fetch("/api/admin/gifts", { headers: { "x-admin-password": pwd } }),
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

  const toggleApproval = async (id: number, currentStatus: boolean) => {
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
    if (!confirm(`Are you sure you want to release the claim on "${giftTitle}"? Other guests will be able to claim it again.`)) return;

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

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === "pending") return !p.is_approved;
    if (activeFilter === "approved") return p.is_approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-brown-deep/10 mb-8">
          <Link
            href="/"
            className="font-body text-xs tracking-[0.2em] uppercase text-brown-deep hover:text-gold-accent transition-colors"
          >
            &larr; Back to Home
          </Link>

          <div className="text-center">
            <span className="font-script text-2xl sm:text-3xl text-brown-deep block">
              Jesulayomi &amp; Justin
            </span>
            <span className="font-body text-[0.62rem] tracking-[0.25em] uppercase text-gold-accent font-semibold">
              Couple Dashboard &middot; Admin
            </span>
          </div>

          <Link
            href="/upload"
            className="font-body text-xs tracking-[0.18em] uppercase text-brown-deep hover:text-gold-accent transition-colors"
          >
            Upload Page &rarr;
          </Link>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-12 bg-white border border-brown-deep/15 rounded-xl p-8 shadow-sm">
            <h1 className="font-display italic text-2xl text-brown-deep mb-2 text-center">
              Couple Admin Access
            </h1>
            <p className="font-body text-xs text-ink/65 text-center mb-6">
              Enter the passcode to review guest photos and manage the wedding gift registry.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passcode"
                  className="rsvp-input text-center font-mono tracking-widest text-base"
                />
              </div>

              {errorMsg && (
                <p className="font-body text-xs text-red-600 text-center font-medium">
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
            {/* Top Navigation Tabs: Photos vs Gifts */}
            <div className="flex items-center justify-center gap-3 mb-8 select-none">
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
                  {giftClaims.length}/{GIFTS.length}
                </span>
              </button>
            </div>

            {/* TAB 1: GUEST PHOTOS */}
            {mainTab === "photos" && (
              <div>
                {/* Stats Bar */}
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

                  <div className="bg-white border border-emerald-600/20 rounded-xl p-4 sm:p-5 text-center">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-emerald-700 block mb-1">
                      Approved
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-semibold text-emerald-800">
                      {stats.approved}
                    </span>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-4 border-b border-brown-deep/8">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveFilter("pending")}
                      className={`px-4 py-1.5 rounded-full font-body text-xs transition-colors cursor-pointer ${
                        activeFilter === "pending"
                          ? "bg-gold-accent text-white font-medium shadow-xs"
                          : "bg-white text-ink/70 border border-brown-deep/15 hover:border-gold-accent"
                      }`}
                    >
                      Pending ({stats.pending})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter("approved")}
                      className={`px-4 py-1.5 rounded-full font-body text-xs transition-colors cursor-pointer ${
                        activeFilter === "approved"
                          ? "bg-brown-deep text-cream-light font-medium shadow-xs"
                          : "bg-white text-ink/70 border border-brown-deep/15 hover:border-brown-deep"
                      }`}
                    >
                      Approved ({stats.approved})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveFilter("all")}
                      className={`px-4 py-1.5 rounded-full font-body text-xs transition-colors cursor-pointer ${
                        activeFilter === "all"
                          ? "bg-ink text-white font-medium shadow-xs"
                          : "bg-white text-ink/70 border border-brown-deep/15 hover:border-ink"
                      }`}
                    >
                      All ({stats.total})
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchDashboardData(password)}
                    className="font-body text-xs text-ink/60 hover:text-brown-deep tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>↻</span> Refresh List
                  </button>
                </div>

                {/* Photo Cards Grid */}
                {filteredPhotos.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-brown-deep/10">
                    <p className="font-display italic text-2xl text-brown-deep mb-1">
                      {activeFilter === "pending"
                        ? "All caught up! No pending photos."
                        : "No photos found in this category."}
                    </p>
                    <p className="font-body text-xs text-ink/50">
                      New guest uploads will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredPhotos.map((photo) => (
                        <motion.div
                          key={photo.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between ${
                            photo.is_approved
                              ? "border-emerald-600/30"
                              : "border-gold-accent/50 shadow-xs"
                          }`}
                        >
                          {/* Media Image */}
                          <div>
                            <div className="relative aspect-[4/3] bg-brown-deep/5 overflow-hidden">
                              {photo.url.match(/\.(mp4|webm|mov)$/i) ? (
                                <video
                                  src={photo.url}
                                  controls
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full h-full group"
                                  title="Click to view full resolution"
                                >
                                  <img
                                    src={photo.url}
                                    alt={`Shared by ${photo.uploader_name}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </a>
                              )}

                              {/* Status Badge */}
                              <div className="absolute top-2 right-2">
                                {photo.is_approved ? (
                                  <span className="px-2.5 py-1 rounded-full text-[0.62rem] font-body uppercase tracking-wider font-semibold bg-emerald-700 text-white shadow-xs">
                                    Approved &amp; Live
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[0.62rem] font-body uppercase tracking-wider font-semibold bg-gold-accent text-white shadow-xs">
                                    Needs Approval
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-display italic text-brown-deep font-semibold text-base truncate">
                                  {photo.uploader_name}
                                </span>
                                <span className="font-body text-[0.62rem] tracking-wider uppercase text-gold-accent font-medium">
                                  {photo.chapter || "Moment"}
                                </span>
                              </div>

                              {photo.note && (
                                <p className="font-body text-xs text-ink/75 italic line-clamp-3 mb-2 bg-cream-light/60 p-2 rounded-md">
                                  &ldquo;{photo.note}&rdquo;
                                </p>
                              )}

                              <p className="font-body text-[0.65rem] text-ink/40 tracking-wider">
                                Uploaded on{" "}
                                {new Date(photo.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="p-4 pt-0 border-t border-brown-deep/8 flex items-center justify-between gap-2 mt-2">
                            <button
                              type="button"
                              disabled={processingId === photo.id}
                              onClick={() => toggleApproval(photo.id, photo.is_approved)}
                              className={`flex-1 py-2 px-3 rounded-lg font-body text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                                photo.is_approved
                                  ? "bg-amber-100 hover:bg-amber-200 text-amber-900"
                                  : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                              }`}
                            >
                              {processingId === photo.id
                                ? "Updating..."
                                : photo.is_approved
                                ? "Revoke Approval"
                                : "✓ Approve & Publish"}
                            </button>

                            <button
                              type="button"
                              disabled={processingId === photo.id}
                              onClick={() => deletePhoto(photo.id)}
                              className="py-2 px-3 rounded-lg font-body text-xs uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
                              title="Delete photo"
                            >
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GIFT REGISTRY */}
            {mainTab === "gifts" && (
              <div className="space-y-4">
                <div className="bg-white border border-brown-deep/12 rounded-xl p-5 mb-6">
                  <h2 className="font-display italic text-2xl text-brown-deep mb-1">
                    Wedding Gift Wishlist Status
                  </h2>
                  <p className="font-body text-xs text-ink/65">
                    Real-time status of items claimed by wedding guests. If an item was claimed by mistake, you can release the claim below so others can view and purchase it.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GIFTS.map((gift) => {
                    const claim = giftClaims.find((c) => c.gift_id === gift.id);

                    return (
                      <div
                        key={gift.id}
                        className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                          claim ? "border-emerald-600/40 bg-emerald-50/20" : "border-brown-deep/15"
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

                          {/* Claim Status */}
                          {claim ? (
                            <div className="p-3 bg-white border border-emerald-600/20 rounded-lg space-y-1 mb-4">
                              <div className="flex items-center justify-between">
                                <span className="font-body text-[0.65rem] tracking-wider uppercase text-emerald-800 font-semibold">
                                  ✓ Claimed by {claim.claimed_by}
                                </span>
                                <span className="font-body text-[0.62rem] text-ink/40">
                                  {new Date(claim.claimed_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              {claim.note && (
                                <p className="font-body text-xs text-ink/75 italic">
                                  &ldquo;{claim.note}&rdquo;
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 bg-cream-light/60 border border-brown-deep/10 rounded-lg mb-4">
                              <span className="font-body text-xs text-ink/60 italic">
                                Available &middot; No one has claimed this gift yet.
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer action */}
                        <div className="flex items-center justify-between pt-3 border-t border-brown-deep/8 gap-2">
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body text-[0.68rem] tracking-wider uppercase text-gold-accent hover:text-brown-deep transition-colors"
                          >
                            View on Jumia &rarr;
                          </a>

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
          </div>
        )}
      </div>
    </div>
  );
}
