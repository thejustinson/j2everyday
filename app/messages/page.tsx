"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Monogram from "../components/Monogram";
import FadeIn from "../components/FadeIn";

interface WallMessage {
  id: number;
  sender_name: string;
  category: "prayer" | "bible_verse" | "love_note" | "congratulations" | string;
  message: string;
  bible_reference: string | null;
  created_at: string;
}

const CATEGORY_TABS = [
  { id: "all", label: "All Blessings", icon: "✨" },
  { id: "prayer", label: "Prayers", icon: "🕊️" },
  { id: "bible_verse", label: "Bible Verses", icon: "📖" },
  { id: "love_note", label: "Words of Wisdom", icon: "💌" },
  { id: "congratulations", label: "Congratulations", icon: "🎉" },
];

export default function MessageWallPage() {
  const [messages, setMessages] = useState<WallMessage[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState("");
  const [category, setCategory] = useState("prayer");
  const [messageText, setMessageText] = useState("");
  const [bibleReference, setBibleReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error("Failed to load message wall:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    if (activeTab === "all") return messages;
    return messages.filter(
      (m) => (m.category || "").toLowerCase() === activeTab.toLowerCase()
    );
  }, [messages, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: senderName.trim(),
          category,
          message: messageText.trim(),
          bibleReference: bibleReference.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Failed to post message.");
        setIsSubmitting(false);
        return;
      }

      // Prepend to messages
      setMessages((prev) => [data.message, ...prev]);
      setPostSuccess(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setPostSuccess(false);
        setSenderName("");
        setMessageText("");
        setBibleReference("");
      }, 1500);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "prayer":
        return { label: "Prayer", icon: "🕊️", bg: "bg-amber-50 text-amber-900 border-amber-200/60" };
      case "bible_verse":
        return { label: "Scripture", icon: "📖", bg: "bg-stone-100 text-stone-800 border-stone-300/70" };
      case "love_note":
        return { label: "Wisdom", icon: "💌", bg: "bg-rose-50 text-rose-900 border-rose-200/60" };
      default:
        return { label: "Blessing", icon: "🎉", bg: "bg-cream-light text-brown-deep border-brown-deep/20" };
    }
  };

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
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

          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setFormError("");
              setPostSuccess(false);
            }}
            className="font-body text-xs tracking-[0.18em] uppercase font-semibold text-cream-light bg-brown-deep hover:bg-brown-deep/90 px-4 py-2 rounded-full transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <span>+</span>
            <span>Add Prayer / Blessing</span>
          </button>
        </div>

        {/* Page Hero Title */}
        <FadeIn className="text-center mb-10 select-none">
          <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-2.5">
            [SPIRITUAL FOUNDATION &middot; #J2EVERYDAY]
          </span>
          <h1 className="font-script text-4xl sm:text-6xl text-brown-deep rotate-[-1.5deg] leading-tight mb-3">
            Our Wall of Prayers &amp; Scriptures
          </h1>
          <p className="font-body text-ink/75 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            &ldquo;Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.&rdquo; — Leave a heartfelt prayer, your favorite bible verse, or words of wisdom for our marriage journey.
          </p>
        </FadeIn>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10 select-none">
          {CATEGORY_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? messages.length
                : messages.filter(
                    (m) => (m.category || "").toLowerCase() === tab.id
                  ).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  font-body text-xs px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5
                  ${
                    isActive
                      ? "bg-brown-deep text-cream-light border-brown-deep shadow-xs font-medium"
                      : "bg-white text-ink/75 border-brown-deep/15 hover:border-gold-accent hover:text-brown-deep"
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brown-deep border-t-transparent mb-3" />
            <p className="font-body text-xs text-ink/50 tracking-widest uppercase">
              Loading prayers &amp; blessings...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMessages.length === 0 && (
          <div className="bg-white border border-brown-deep/12 rounded-2xl p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-cream-light border border-brown-deep/15 flex items-center justify-center mx-auto mb-4 text-brown-deep text-2xl">
              🕊️
            </div>
            <h2 className="font-display italic text-2xl text-brown-deep mb-2">
              Be the first to bless the couple
            </h2>
            <p className="font-body text-xs text-ink/65 leading-relaxed mb-6">
              Write a prayer, share an uplifting scripture, or leave wisdom for Jesulayomi &amp; Justin.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-6 py-3 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.2em] uppercase font-semibold transition-colors shadow-xs cursor-pointer"
            >
              Add Blessing &rarr;
            </button>
          </div>
        )}

        {/* ── Messages Grid / Wall ── */}
        {!isLoading && filteredMessages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-start">
            {filteredMessages.map((item) => {
              const badge = getCategoryBadge(item.category);
              const isScripture = item.category.toLowerCase() === "bible_verse" || Boolean(item.bible_reference);

              return (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  className="bg-white border border-brown-deep/12 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative group"
                >
                  <div className="washi-tape" aria-hidden="true" />

                  {/* Card Header: Category Badge & Date */}
                  <div className="flex items-center justify-between pb-3 border-b border-brown-deep/8 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[0.62rem] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.label}</span>
                    </span>

                    <span className="font-body text-[0.62rem] text-ink/40 tracking-wider uppercase">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Bible Reference Highlight */}
                  {item.bible_reference && (
                    <div className="mb-2.5">
                      <span className="font-display italic text-sm text-gold-accent font-semibold block">
                        &ldquo;{item.bible_reference}&rdquo;
                      </span>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="mb-4">
                    <p
                      className={`font-body text-ink/80 text-sm leading-relaxed ${
                        isScripture ? "font-serif italic text-[0.95rem]" : ""
                      }`}
                    >
                      &ldquo;{item.message}&rdquo;
                    </p>
                  </div>

                  {/* Sender Signature */}
                  <div className="pt-3 border-t border-brown-deep/8 flex items-center justify-between">
                    <div>
                      <p className="font-display italic text-brown-deep text-base font-semibold">
                        {item.sender_name}
                      </p>
                      <span className="font-body text-[0.6rem] text-ink/40 tracking-widest uppercase block">
                        With love
                      </span>
                    </div>

                    <span className="text-gold-accent/40 font-script text-xl select-none">
                      &hearts;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Submit Message Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-brown-deep/15 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8"
            >
              <div className="washi-tape" aria-hidden="true" />

              <div className="text-center mb-6">
                <span className="font-body text-[0.65rem] tracking-[0.25em] uppercase text-gold-accent font-semibold block mb-1">
                  [MESSAGE WALL BLESSING]
                </span>
                <h3 className="font-display italic text-2xl text-brown-deep">
                  Bless Jesulayomi &amp; Justin
                </h3>
                <p className="font-body text-xs text-ink/65 mt-1">
                  Share your prayers, favorite scripture, or words of wisdom.
                </p>
              </div>

              {postSuccess ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl border border-amber-200">
                    🕊️
                  </div>
                  <h4 className="font-display italic text-2xl text-brown-deep mb-1">
                    Amen! Thank You.
                  </h4>
                  <p className="font-body text-xs text-ink/70">
                    Your prayer &amp; blessing has been added to the message wall.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5">
                      What are you sharing?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "prayer", label: "🕊️ Prayer" },
                        { id: "bible_verse", label: "📖 Scripture" },
                        { id: "love_note", label: "💌 Wisdom" },
                        { id: "congratulations", label: "🎉 Congrats" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCategory(item.id)}
                          className={`py-2 px-3 text-xs font-body rounded-lg border transition-colors cursor-pointer ${
                            category === item.id
                              ? "bg-brown-deep text-cream-light border-brown-deep font-semibold"
                              : "bg-cream-light/60 border-brown-deep/15 text-brown-deep hover:border-gold-accent"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="sender-name"
                      className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                    >
                      Your Name / Family
                    </label>
                    <input
                      id="sender-name"
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Pastor Paul, Auntie Funmi, Sarah & David"
                      className="rsvp-input"
                    />
                  </div>

                  {/* Bible Reference (optional/encouraged) */}
                  <div>
                    <label
                      htmlFor="bible-ref"
                      className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                    >
                      Scripture Reference (Optional)
                    </label>
                    <input
                      id="bible-ref"
                      type="text"
                      value={bibleReference}
                      onChange={(e) => setBibleReference(e.target.value)}
                      placeholder="e.g. 1 Corinthians 13:4-8, Ecclesiastes 4:9-12"
                      className="rsvp-input"
                    />
                  </div>

                  {/* Message / Prayer Textarea */}
                  <div>
                    <label
                      htmlFor="message-text"
                      className="block font-body text-[0.72rem] tracking-[0.2em] uppercase text-gold-accent font-semibold mb-1.5"
                    >
                      Your Prayer / Message
                    </label>
                    <textarea
                      id="message-text"
                      rows={4}
                      required
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Write your blessing, scripture, or prayer for their journey..."
                      className="rsvp-input resize-none"
                    />
                  </div>

                  {formError && (
                    <p className="font-body text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                      {formError}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-lg font-body text-xs tracking-wider uppercase text-ink/60 hover:text-brown-deep transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || !senderName.trim() || !messageText.trim()}
                      className="px-6 py-2.5 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.18em] uppercase font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Posting..." : "Share Blessing"}
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
