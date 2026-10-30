"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import FadeIn from "./FadeIn";

interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  caption: string;
  widthClass: string;
  aspectClass: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 6,
    src: "/6.jpg",
    alt: "Jesulayomi and Justin embracing and laughing together",
    caption: "Joy & Laughter",
    widthClass: "w-[280px] sm:w-[360px]",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: 2,
    src: "/2.jpg",
    alt: "Full length portrait of the couple in celebration attire",
    caption: "Together in Grace",
    widthClass: "w-[220px] sm:w-[270px]",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: 1,
    src: "/1.jpg",
    alt: "Intimate embrace and radiant smiles",
    caption: "Golden Hour",
    widthClass: "w-[280px] sm:w-[350px]",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: 4,
    src: "/4.jpg",
    alt: "Close-up portrait featuring the engagement ring",
    caption: "The Promise",
    widthClass: "w-[210px] sm:w-[250px]",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: 5,
    src: "/5.jpg",
    alt: "Joyful moment and candid laughter",
    caption: "Pure Happiness",
    widthClass: "w-[250px] sm:w-[300px]",
    aspectClass: "aspect-[1/1]",
  },
  {
    id: 3,
    src: "/3.jpg",
    alt: "Jesulayomi and Justin elegant seated portrait",
    caption: "Forever & Always",
    widthClass: "w-[230px] sm:w-[280px]",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: 7,
    src: "/7.jpg",
    alt: "Artistic motion-blur dance and laughter",
    caption: "Caught in the Moment",
    widthClass: "w-[220px] sm:w-[260px]",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: 8,
    src: "/8.jpg",
    alt: "Playful piggyback moment in matching white tees and batik",
    caption: "Our Everyday",
    widthClass: "w-[210px] sm:w-[250px]",
    aspectClass: "aspect-[4/5]",
  },
  {
    id: 9,
    src: "/9.jpg",
    alt: "Loving embrace in casual white tees and batik",
    caption: "Always By Your Side",
    widthClass: "w-[250px] sm:w-[300px]",
    aspectClass: "aspect-[1/1]",
  },
  {
    id: 10,
    src: "/10.jpg",
    alt: "Artistic silhouette embrace against white light",
    caption: "Two Souls",
    widthClass: "w-[220px] sm:w-[270px]",
    aspectClass: "aspect-[3/4]",
  },
];

// Duplicate list for continuous seamless infinite loop
const CONTINUOUS_PHOTOS = [...GALLERY_PHOTOS, ...GALLERY_PHOTOS];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Lightbox navigation
  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % GALLERY_PHOTOS.length);
  }, [selectedIndex]);

  const showPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev! === 0 ? GALLERY_PHOTOS.length - 1 : prev! - 1
    );
  }, [selectedIndex]);

  // Keyboard controls & body scroll lock for lightbox
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
    <section
      id="gallery"
      className="py-20 sm:py-32 bg-cream-light relative overflow-hidden select-none border-t border-brown-deep/10"
    >
      {/* ── Scoped inline CSS to ensure marquee never wraps ── */}
      <style>{`
        @keyframes marquee-rtl-anim {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .gallery-track {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
          animation: marquee-rtl-anim 55s linear infinite;
          will-change: transform;
        }
        .gallery-track:hover {
          animation-play-state: paused !important;
        }
        .gallery-track.is-paused {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* ── Section Header ── */}
      <div className="max-w-5xl mx-auto px-6 mb-10 sm:mb-14 text-center">
        <FadeIn>
          <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-2">
            [EXHIBITION]
          </span>
          <h2 className="font-display italic text-3xl sm:text-4xl text-brown-deep font-normal">
            Moments Together
          </h2>
        </FadeIn>
      </div>

      {/* ── Continuous Right-to-Left Infinite Exhibition Strip ── */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge fade masks for seamless entrance/exit */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-cream-light to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-cream-light to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        {/* The Continuous Infinite Marquee Strip */}
        <div
          className={`gallery-track flex flex-row flex-nowrap items-center gap-6 sm:gap-8 lg:gap-10 ${
            isPaused || selectedIndex !== null ? "is-paused" : ""
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {CONTINUOUS_PHOTOS.map((photo, idx) => {
            const originalIndex = idx % GALLERY_PHOTOS.length;
            return (
              <motion.div
                key={`${photo.id}-${idx}`}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                onClick={() => setSelectedIndex(originalIndex)}
                className={`
                  relative shrink-0 flex-shrink-0 group cursor-pointer
                  bg-white p-2.5 sm:p-3 pb-4
                  shadow-[0_8px_30px_rgba(43,29,20,0.06),0_1px_4px_rgba(43,29,20,0.04)]
                  border border-brown-deep/10 rounded-xs
                  ${photo.widthClass}
                `}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedIndex(originalIndex);
                  }
                }}
                aria-label={`View photo: ${photo.caption}`}
              >
                {/* Image Frame */}
                <div
                  className={`relative w-full ${photo.aspectClass} overflow-hidden bg-brown-deep/5`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 280px, 400px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                    draggable={false}
                  />
                  {/* Subtle Museum Art Hover Overlay */}
                  <div
                    className="absolute inset-0 bg-brown-deep/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                  >
                    <span className="font-body text-[0.65rem] tracking-[0.25em] uppercase text-cream-light font-medium bg-brown-deep/80 px-3 py-1.5 rounded-full backdrop-blur-xs">
                      Enlarge
                    </span>
                  </div>
                </div>

                {/* Minimal title underneath the photo — NO DATES */}
                <div className="mt-3 px-1 text-center">
                  <span className="font-display italic text-brown-deep text-sm sm:text-base block">
                    {photo.caption}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Controls (Date Removed) ── */}
      <FadeIn delay={100} className="mt-10 sm:mt-14 text-center select-none px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
          <p className="font-body text-[0.68rem] sm:text-xs tracking-[0.3em] uppercase text-ink/50 flex items-center gap-2">
            <span className="text-gold-accent font-semibold">&larr;</span>
            <span>HOVER TO PAUSE &middot; CLICK PHOTO TO ENLARGE</span>
            <span className="text-gold-accent font-semibold">&larr;</span>
          </p>

          {/* Interactive Pause / Resume Pill */}
          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-brown-deep/80 hover:text-brown-deep hover:bg-brown-deep/5 transition-all border border-brown-deep/20 px-3 py-1 rounded-full flex items-center gap-1.5 cursor-pointer"
            aria-label={isPaused ? "Resume continuous animation" : "Pause continuous animation"}
          >
            <span>{isPaused ? "▶" : "⏸"}</span>
            <span>{isPaused ? "Resume Flow" : "Pause Flow"}</span>
          </button>

          {/* Guestbook Link */}
          <Link
            href="/guestbook"
            className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-brown-deep hover:text-gold-accent hover:bg-brown-deep/5 transition-all border border-brown-deep/25 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <span>📖</span>
            <span>Guestbook Album</span>
          </Link>

          {/* Upload Photos Link */}
          <Link
            href="/upload"
            className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-gold-accent hover:text-brown-deep hover:bg-gold-accent/10 transition-all border border-gold-accent/40 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-medium cursor-pointer"
          >
            <span>+</span>
            <span>Upload Your Photos</span>
          </Link>
        </div>
      </FadeIn>

      {/* ── Fullscreen Lightbox Modal with Framer Motion ── */}
      <AnimatePresence>
        {selectedIndex !== null && (
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
              className="absolute top-5 right-5 sm:top-7 sm:right-7 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-accent cursor-pointer"
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
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Previous Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-accent cursor-pointer"
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
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center border border-gold-accent/40 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-accent cursor-pointer"
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
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Active Image with Spring Motion */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-4xl max-h-[75vh] sm:max-h-[82vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[65vh] sm:h-[78vh]">
                <Image
                  src={GALLERY_PHOTOS[selectedIndex].src}
                  alt={GALLERY_PHOTOS[selectedIndex].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 95vw, 1000px"
                  className="object-contain"
                />
              </div>
            </motion.div>

            {/* Bottom Caption & Counter */}
            <div
              className="mt-4 text-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display italic text-cream-light text-xl sm:text-2xl">
                {GALLERY_PHOTOS[selectedIndex].caption}
              </p>
              <p className="font-body text-gold-accent text-xs sm:text-sm tracking-widest uppercase mt-1">
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(GALLERY_PHOTOS.length).padStart(2, "0")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
