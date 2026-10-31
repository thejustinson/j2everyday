"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Monogram from "../components/Monogram";
import FadeIn from "../components/FadeIn";

interface GuestPhoto {
  id: number;
  url: string;
  uploader_name: string;
  chapter: string | null;
  note: string | null;
  created_at: string;
}

const CHAPTER_FILTERS = [
  "All Moments",
  "Church Ceremony",
  "Reception & Toasts",
  "Couple Portraits",
  "Party & Dance Floor",
  "Everyday Moments",
];

export default function GuestbookPage() {
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Moments");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.photos)) {
            setPhotos(data.photos);
          }
        }
      } catch (err) {
        console.error("Failed to load guestbook photos:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPhotos();
  }, []);

  const filteredPhotos = photos.filter((p) => {
    if (activeFilter === "All Moments") return true;
    return p.chapter === activeFilter;
  });

  const showNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! === filteredPhotos.length - 1 ? 0 : prev! + 1
    );
  }, [selectedIndex, filteredPhotos.length]);

  const showPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! === 0 ? filteredPhotos.length - 1 : prev! - 1
    );
  }, [selectedIndex, filteredPhotos.length]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, showNext, showPrev]);

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 border-b border-brown-deep/10 mb-12">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/gifts"
              className="font-body text-xs tracking-[0.16em] uppercase font-semibold text-brown-deep border border-brown-deep/20 hover:border-gold-accent hover:text-gold-accent px-3 py-1.5 rounded-full transition-colors hidden sm:inline-flex items-center"
            >
              <span>Registry</span>
            </Link>
            <Link
              href="/messages"
              className="font-body text-xs tracking-[0.16em] uppercase font-semibold text-brown-deep border border-brown-deep/20 hover:border-gold-accent hover:text-gold-accent px-3 py-1.5 rounded-full transition-colors hidden sm:inline-flex items-center"
            >
              <span>Wall</span>
            </Link>
            <Link
              href="/upload"
              className="font-body text-xs tracking-[0.18em] uppercase font-semibold text-brown-deep border border-brown-deep/30 hover:border-gold-accent hover:text-gold-accent px-3.5 py-1.5 rounded-full transition-colors"
            >
              + Upload Photos
            </Link>
          </div>
        </div>

        {/* Page Hero Title */}
        <FadeIn className="text-center mb-12 sm:mb-16 select-none">
          <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-3">
            [GUESTBOOK ALBUM &middot; #J2EVERYDAY]
          </span>
          <h1 className="font-script text-4xl sm:text-6xl text-brown-deep rotate-[-1.5deg] leading-tight mb-3">
            Moments through your eyes
          </h1>
          <p className="font-body text-ink/75 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Every smile, toast, dance move, and cherished candid captured by our beloved friends and family.
          </p>
        </FadeIn>

        {/* Chapter Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12 select-none">
          {CHAPTER_FILTERS.map((tag) => {
            const count =
              tag === "All Moments"
                ? photos.length
                : photos.filter((p) => p.chapter === tag).length;
            const isActive = activeFilter === tag;

            return (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setActiveFilter(tag);
                  setSelectedIndex(null);
                }}
                className={`
                  font-body text-xs px-4 py-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5
                  ${
                    isActive
                      ? "bg-brown-deep text-cream-light border-brown-deep shadow-xs font-medium"
                      : "bg-white text-ink/75 border-brown-deep/15 hover:border-gold-accent hover:text-brown-deep"
                  }
                `}
              >
                <span>{tag}</span>
                <span className={`text-[0.65rem] ${isActive ? "text-cream-light/70" : "text-ink/40"}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-brown-deep border-t-transparent mb-3" />
            <p className="font-body text-xs text-ink/50 tracking-widest uppercase">
              Loading memories...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPhotos.length === 0 && (
          <div className="bg-white border border-brown-deep/12 rounded-xl p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cream-light border border-brown-deep/15 flex items-center justify-center mx-auto mb-4 text-brown-deep">
              <span className="text-2xl">📷</span>
            </div>
            <h2 className="font-display italic text-2xl text-brown-deep mb-2">
              {activeFilter === "All Moments"
                ? "No memories uploaded yet"
                : `No photos in ${activeFilter}`}
            </h2>
            <p className="font-body text-xs text-ink/65 leading-relaxed mb-6">
              Be among the first to capture and share a sweet snapshot from our celebration.
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-brown-deep hover:bg-brown-deep/90 text-cream-light rounded-lg font-body text-xs tracking-[0.2em] uppercase font-semibold transition-colors shadow-xs"
            >
              Upload Moments &rarr;
            </Link>
          </div>
        )}

        {/* Photos Grid */}
        {!isLoading && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                onClick={() => setSelectedIndex(index)}
                className="polaroid-card bg-white p-3.5 pb-6 rounded-xs shadow-[0_8px_30px_rgba(43,29,20,0.06),0_1px_4px_rgba(43,29,20,0.04)] cursor-pointer group"
              >
                {/* Media Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-brown-deep/5 rounded-xs mb-4">
                  {photo.url.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={photo.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={photo.url}
                      alt={`Moment shared by ${photo.uploader_name}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-deep/15 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Caption / Details */}
                <div className="px-1 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display italic text-brown-deep text-base font-semibold truncate">
                      {photo.uploader_name}
                    </span>
                    <span className="font-body text-[0.62rem] tracking-wider uppercase text-gold-accent font-medium">
                      {photo.chapter || "Moment"}
                    </span>
                  </div>

                  {photo.note && (
                    <p className="font-body text-ink/75 text-xs italic line-clamp-2 mt-1">
                      &ldquo;{photo.note}&rdquo;
                    </p>
                  )}

                  <p className="font-body text-[0.62rem] text-ink/40 tracking-wider uppercase mt-3">
                    {new Date(photo.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && filteredPhotos[selectedIndex] && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close photo preview"
              className="absolute top-5 right-5 sm:top-7 sm:right-7 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Main Media in Lightbox */}
            <motion.div
              key={filteredPhotos[selectedIndex].id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center"
            >
              <div className="relative max-h-[65vh] overflow-hidden rounded-lg bg-black/40">
                {filteredPhotos[selectedIndex].url.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={filteredPhotos[selectedIndex].url}
                    controls
                    autoPlay
                    className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={filteredPhotos[selectedIndex].url}
                    alt={`Photo by ${filteredPhotos[selectedIndex].uploader_name}`}
                    className="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xl"
                  />
                )}
              </div>

              {/* Lightbox Caption */}
              <div className="mt-4 text-center max-w-xl px-4">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <p className="font-display italic text-2xl text-cream-light font-normal">
                    {filteredPhotos[selectedIndex].uploader_name}
                  </p>
                  <span className="font-body text-[0.62rem] tracking-[0.2em] uppercase text-gold-accent font-semibold border border-gold-accent/40 px-2 py-0.5 rounded-full">
                    {filteredPhotos[selectedIndex].chapter || "Moment"}
                  </span>
                </div>

                {filteredPhotos[selectedIndex].note && (
                  <p className="font-body text-cream-light/80 text-sm italic mb-2">
                    &ldquo;{filteredPhotos[selectedIndex].note}&rdquo;
                  </p>
                )}

                <p className="font-body text-[0.65rem] tracking-[0.25em] uppercase text-cream-light/50">
                  {selectedIndex + 1} of {filteredPhotos.length} &middot; #j2everyday
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
