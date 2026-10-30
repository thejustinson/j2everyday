"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface NavItem {
  id: string;
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "our-story", href: "/#our-story", label: "OUR STORY" },
  { id: "schedule", href: "/#schedule", label: "SCHEDULE" },
  { id: "gallery", href: "/#gallery", label: "GALLERY" },
  { id: "guestbook", href: "/guestbook", label: "GUESTBOOK" },
  { id: "gift", href: "/#gift", label: "GIFTS" },
];

export default function Nav() {
  const [activeSection, setActiveSection] = useState<string>("gallery");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for shadow and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy for active section
      const sections = ["home", "our-story", "schedule", "gift", "gallery"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on hash navigation
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav
        className={`
          flex items-center justify-between h-16 sm:h-20 px-6 sm:px-10 md:px-14
          bg-cream-light/95 backdrop-blur-md
          border-b border-brown-deep/10
          transition-all duration-300
          ${scrolled ? "shadow-[0_4px_20px_rgba(74,52,41,0.06)] bg-cream-light/98" : ""}
        `}
        aria-label="Main navigation"
      >
        {/* Left Side: Museum editorial links (OUR STORY, SCHEDULE, [GALLERY], GIFTS) */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative font-body text-[0.72rem] tracking-[0.22em] uppercase font-medium transition-colors duration-200"
              >
                {isActive ? (
                  <span className="text-brown-deep font-semibold">
                    [{item.label}]
                  </span>
                ) : (
                  <span className="text-ink/65 hover:text-brown-deep group-hover:tracking-[0.25em] transition-all duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Center: Brand Name (Jesulayomi & Justin / Kombu style) */}
        <div className="flex-1 md:flex-initial flex items-center justify-start md:justify-center">
          <Link
            href="/#home"
            className="group flex flex-col items-start md:items-center focus-visible:outline-2 focus-visible:outline-gold-accent"
          >
            <span className="font-display text-2xl sm:text-3xl text-brown-deep font-normal tracking-tight group-hover:opacity-85 transition-opacity">
              Jesulayomi &amp; Justin
            </span>
          </Link>
        </div>

        {/* Right Side: Hashtag & Upload */}
        <div className="hidden md:flex items-center justify-end gap-5 flex-1">
          <span className="font-body text-[0.68rem] tracking-[0.25em] uppercase text-ink/45 select-none">
            #J2EVERYDAY
          </span>
          <Link
            href="/upload"
            className="font-body text-[0.72rem] tracking-[0.2em] uppercase font-medium text-brown-deep hover:text-gold-accent transition-colors duration-200"
          >
            [UPLOAD PHOTOS]
          </Link>
        </div>

        {/* Mobile: Upload button & Hamburger toggle */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/upload"
            className="font-body text-[0.68rem] tracking-[0.16em] uppercase font-semibold text-brown-deep border border-brown-deep/25 px-2.5 py-1 rounded"
          >
            Upload
          </Link>
          <button
            type="button"
            className="p-2 text-brown-deep rounded focus-visible:outline-2 focus-visible:outline-gold-accent"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`h-px w-full bg-current transform transition-all duration-300 origin-left ${
                  menuOpen ? "rotate-45 translate-x-0.5" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-full bg-current transform transition-all duration-300 origin-left ${
                  menuOpen ? "-rotate-45 translate-x-0.5" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-cream-light/98 backdrop-blur-md border-b border-brown-deep/15 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-brown-deep/10 text-xs tracking-widest text-ink/40 uppercase">
                <span>Navigation</span>
                <span>#J2EVERYDAY</span>
              </div>
              <ul className="flex flex-col gap-2" role="list">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block py-2 font-body text-xs tracking-[0.2em] uppercase transition-colors ${
                          isActive
                            ? "text-brown-deep font-semibold"
                            : "text-ink/70 hover:text-brown-deep"
                        }`}
                      >
                        {isActive ? `[${item.label}]` : item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="pt-4 border-t border-brown-deep/10 flex items-center justify-between">
                <span className="font-display italic text-brown-deep text-sm">
                  November 7, 2026
                </span>
                <Link
                  href="/upload"
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-xs tracking-[0.2em] uppercase font-semibold text-cream-light bg-brown-deep px-4 py-2 rounded shadow-xs"
                >
                  Upload Photos
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
