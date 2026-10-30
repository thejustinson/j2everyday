"use client";

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Monogram from "./Monogram";
import FadeIn from "./FadeIn";
import { SHARED_ALBUM_URL } from "../lib/config";
import { useUploadThing } from "../lib/uploadthing";

interface UploadedMemory {
  id: string;
  url: string;
  guestName: string;
  tag: string;
  note: string;
  date: string;
}

const MOMENT_TAGS = [
  "Church Ceremony",
  "Reception & Toasts",
  "Couple Portraits",
  "Party & Dance Floor",
  "Everyday Moments",
];

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [guestName, setGuestName] = useState("");
  const [selectedTag, setSelectedTag] = useState(MOMENT_TAGS[0]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedMemories, setSavedMemories] = useState<UploadedMemory[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load approved memories from the database
  const loadApprovedMemories = async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.photos)) {
          interface ApiPhoto {
            id: number;
            url: string;
            uploader_name: string;
            chapter: string;
            note: string;
            created_at: string;
          }
          setSavedMemories(
            data.photos.map((p: ApiPhoto) => ({
              id: String(p.id),
              url: p.url,
              guestName: p.uploader_name,
              tag: p.chapter || "Moment",
              note: p.note || "",
              date: new Date(p.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Could not load community memories:", err);
    }
  };

  useEffect(() => {
    loadApprovedMemories();
  }, []);

  // UploadThing hook
  const { startUpload } = useUploadThing("guestPhotoUploader", {
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
    onClientUploadComplete: async (res) => {
      try {
        if (!res || res.length === 0) {
          throw new Error("No files uploaded");
        }

        const photosPayload = res.map((item) => ({
          url: item.ufsUrl || item.url,
          key: item.key,
        }));

        const saveRes = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            photos: photosPayload,
            guestName: guestName.trim() || "A Loved Guest",
            chapter: selectedTag,
            note: note.trim(),
          }),
        });

        if (!saveRes.ok) {
          throw new Error("Failed to save photos to database");
        }

        setIsSubmitted(true);
        setFiles([]);
        setPreviews([]);
        setNote("");
        setUploadProgress(0);
        // Refresh community list
        loadApprovedMemories();
      } catch (err) {
        console.error("Error in onClientUploadComplete:", err);
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Files uploaded, but failed to save guest notes. Please let the couple know!"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setErrorMessage(
        error.message || "Upload failed. Please try again with smaller files."
      );
      setIsSubmitting(false);
      setUploadProgress(0);
    },
  });

  // Generate image previews when files change
  const handleFileSelection = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    const incoming = Array.from(newFiles).filter((f) =>
      f.type.startsWith("image/") || f.type.startsWith("video/")
    );

    const updated = [...files, ...incoming];
    setFiles(updated);

    // Create object URLs for preview
    const newPreviews = incoming.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    setErrorMessage("");
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      await startUpload(files);
    } catch (err) {
      console.error("Submit error:", err);
      setErrorMessage("Could not start upload. Please check your connection.");
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFiles([]);
    setPreviews([]);
    setErrorMessage("");
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-cream-light py-10 sm:py-16 px-4 sm:px-6">
      {/* ── Top Navigation Bar ── */}
      <div className="max-w-4xl mx-auto flex items-center justify-between pb-8 border-b border-brown-deep/10 mb-12">
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

        <span className="font-body text-[0.68rem] tracking-[0.25em] uppercase text-ink/40">
          #j2everyday
        </span>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* ── Page Header ── */}
        <FadeIn className="text-center mb-10 sm:mb-14 select-none">
          <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-3">
            [GUESTBOOK ALBUM &middot; #J2EVERYDAY]
          </span>
          <h1 className="font-script text-4xl sm:text-6xl text-brown-deep rotate-[-1.5deg] leading-tight mb-3">
            Share your favorite moments
          </h1>
          <p className="font-body text-ink/75 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Did you capture a special laugh, dance step, or candid memory during
            our wedding? We would love to experience our day through your eyes.
          </p>
        </FadeIn>

        {/* ── Upload Card or Success View ── */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-brown-deep/12 rounded-xl p-6 sm:p-10 shadow-[0_12px_40px_rgba(43,29,20,0.06)] relative"
            >
              {/* Frosted washi tape on top of the card */}
              <div className="washi-tape" aria-hidden="true" />

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* 1. Drag & Drop Zone */}
                <div>
                  <label className="block font-body text-[0.72rem] tracking-[0.22em] uppercase text-gold-accent font-semibold mb-2">
                    Select Photos or Videos
                  </label>

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200
                      ${
                        isDragOver
                          ? "border-gold-accent bg-beige-warm/20 scale-[0.99]"
                          : "border-brown-deep/20 hover:border-gold-accent/70 hover:bg-cream-light/40"
                      }
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleFileSelection(e.target.files)
                      }
                    />

                    <div className="w-14 h-14 rounded-full bg-cream-light border border-gold-accent/40 flex items-center justify-center mx-auto mb-4 text-brown-deep shadow-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>

                    <p className="font-display italic text-lg sm:text-xl text-brown-deep mb-1">
                      Drag &amp; drop photos here, or click to browse
                    </p>
                    <p className="font-body text-xs text-ink/50 tracking-wide">
                      Supports JPG, PNG, HEIC, MP4 &bull; Take a quick photo or choose from library
                    </p>
                  </div>

                  {/* Thumbnail Previews Grid */}
                  {previews.length > 0 && (
                    <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {previews.map((src, i) => (
                        <div
                          key={i}
                          className="relative aspect-square rounded-lg overflow-hidden border border-brown-deep/15 group shadow-xs bg-cream-light"
                        >
                          <img
                            src={src}
                            alt={`Upload preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(i);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-brown-deep/80 hover:bg-brown-deep text-cream-light flex items-center justify-center transition-transform hover:scale-110"
                            aria-label={`Remove photo ${i + 1}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Guest Name */}
                <div>
                  <label
                    htmlFor="guest-name"
                    className="block font-body text-[0.72rem] tracking-[0.22em] uppercase text-gold-accent font-semibold mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Uncle Femi, Sarah & David"
                    className="rsvp-input"
                  />
                </div>

                {/* 3. Moment Tag Selection */}
                <div>
                  <label className="block font-body text-[0.72rem] tracking-[0.22em] uppercase text-gold-accent font-semibold mb-2">
                    Celebration Chapter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {MOMENT_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`
                          font-body text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer
                          ${
                            selectedTag === tag
                              ? "bg-brown-deep text-cream-light border-brown-deep shadow-xs font-medium"
                              : "bg-cream-light/60 text-ink/75 border-brown-deep/15 hover:border-gold-accent hover:text-brown-deep"
                          }
                        `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Note / Love Wish */}
                <div>
                  <label
                    htmlFor="guest-note"
                    className="block font-body text-[0.72rem] tracking-[0.22em] uppercase text-gold-accent font-semibold mb-2"
                  >
                    Note for Jesulayomi &amp; Justin (Optional)
                  </label>
                  <textarea
                    id="guest-note"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Leave a sweet memory, joke, or blessing..."
                    className="rsvp-input resize-none"
                  />
                </div>

                {/* Progress Bar & Error Messages */}
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between font-body text-xs text-ink/70">
                      <span>Uploading to wedding album...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-cream-light rounded-full overflow-hidden border border-brown-deep/10">
                      <div
                        className="h-full bg-gold-accent transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-body text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* 5. Submit Button */}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || files.length === 0}
                    whileHover={{ scale: files.length > 0 && !isSubmitting ? 1.01 : 1 }}
                    whileTap={{ scale: files.length > 0 && !isSubmitting ? 0.98 : 1 }}
                    className={`
                      w-full py-4 rounded-lg font-body text-xs tracking-[0.22em] uppercase font-semibold
                      transition-all duration-200 flex items-center justify-center gap-2 shadow-sm
                      ${
                        files.length > 0 && !isSubmitting
                          ? "bg-brown-deep text-cream-light hover:bg-brown-deep/95 cursor-pointer"
                          : "bg-brown-deep/40 text-cream-light/60 cursor-not-allowed"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-cream-light"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Uploading {files.length} Photo{files.length > 1 ? "s" : ""} ({uploadProgress}%)...</span>
                      </>
                    ) : (
                      <span>
                        Upload {files.length > 0 ? `${files.length} Photo${files.length > 1 ? "s" : ""}` : "Photos"} to Album &rarr;
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* ── Celebratory Success View ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-brown-deep/12 rounded-xl p-8 sm:p-12 shadow-[0_12px_40px_rgba(43,29,20,0.06)] text-center relative"
            >
              <div className="washi-tape" aria-hidden="true" />

              <div className="w-16 h-16 rounded-full border border-gold-accent bg-cream-light flex items-center justify-center mx-auto mb-6 text-gold-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h2 className="font-display italic text-3xl sm:text-4xl text-brown-deep mb-3">
                Memories Received!
              </h2>
              <p className="font-body text-ink/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-4">
                Thank you so much{guestName ? `, ${guestName}` : ""}! Your photos have been uploaded successfully.
              </p>
              <p className="font-body text-xs text-ink/60 max-w-sm mx-auto mb-8 bg-beige-warm/15 py-2.5 px-4 rounded-full border border-brown-deep/10">
                To keep our album joyful and safe, photos will appear in the community gallery once approved by the couple.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="font-body text-xs tracking-[0.2em] uppercase font-semibold text-cream-light bg-brown-deep px-6 py-3 rounded-lg hover:bg-brown-deep/90 transition-colors shadow-xs cursor-pointer"
                >
                  Upload More Photos
                </button>
                <Link
                  href="/"
                  className="font-body text-xs tracking-[0.2em] uppercase font-medium text-brown-deep border border-brown-deep/20 px-6 py-3 rounded-lg hover:bg-cream-light transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Optional Shared Drive / Photos Link ── */}
        {SHARED_ALBUM_URL !== "#" && (
          <FadeIn delay={150} className="mt-8 text-center">
            <p className="font-body text-xs text-ink/60">
              Prefer uploading full folders directly?{" "}
              <a
                href={SHARED_ALBUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-accent hover:text-brown-deep underline underline-offset-4 font-medium transition-colors"
              >
                Open Google Photos / Drive Album &rarr;
              </a>
            </p>
          </FadeIn>
        )}

        {/* ── Community Guest Feed ── */}
        {savedMemories.length > 0 && (
          <FadeIn delay={200} className="mt-16 sm:mt-24 pt-12 border-t border-brown-deep/10">
            <div className="text-center mb-8">
              <span className="font-body text-[0.68rem] tracking-[0.28em] uppercase text-gold-accent font-semibold block mb-1">
                [COMMUNITY FEED]
              </span>
              <h3 className="font-display italic text-2xl sm:text-3xl text-brown-deep">
                Moments Captured by Our Guests
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {savedMemories.map((item) => (
                <div
                  key={item.id}
                  className="polaroid-card bg-white p-3 pb-5 rounded-xs shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-brown-deep/5 rounded-xs mb-3">
                    <img
                      src={item.url}
                      alt={`Photo shared by ${item.guestName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="px-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display italic text-brown-deep text-sm font-semibold truncate">
                        {item.guestName}
                      </span>
                      <span className="font-body text-[0.6rem] tracking-wider uppercase text-gold-accent">
                        {item.tag}
                      </span>
                    </div>
                    {item.note && (
                      <p className="font-body text-ink/70 text-xs italic line-clamp-2 mt-1">
                        &ldquo;{item.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
