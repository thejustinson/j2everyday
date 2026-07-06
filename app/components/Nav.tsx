"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Monogram from "./Monogram";

const LEFT_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#our-story", label: "Our Story" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#schedule", label: "Schedule" },
];

const RIGHT_LINKS = [
  { href: "/#venue", label: "Venue" },
  { href: "/#dress-code", label: "Dress Code" },
  { href: "/#gift", label: "Gift" },
  { href: "/rsvp", label: "RSVP" },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hairline shadow appears once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on any navigation (hash change or route change)
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Prevent body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const linkClass =
    "font-body text-sm font-medium text-ink/80 hover:text-gold-accent transition-colors duration-200 tracking-wide";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* ── Main bar ── */}
      <nav
        className={`
          flex items-center h-16 px-6 md:px-10
          bg-cream-light/90 backdrop-blur-md
          border-b border-brown-deep/10
          transition-shadow duration-300
          ${scrolled ? "shadow-[0_1px_12px_rgba(74,52,41,0.08)]" : ""}
        `}
        aria-label="Main navigation"
      >
        {/* Left group */}
        <ul
          className="hidden lg:flex items-center gap-8 flex-1"
          role="list"
        >
          {LEFT_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Center — monogram (also fills left on mobile) */}
        <div className="flex-1 flex justify-start lg:flex-none lg:justify-center">
          <Monogram linkTo="/" size="md" />
        </div>

        {/* Right group */}
        <ul
          className="hidden lg:flex items-center gap-8 flex-1 justify-end"
          role="list"
        >
          {RIGHT_LINKS.map((link) => (
            <li key={link.href}>
              {link.label === "RSVP" ? (
                <Link
                  href={link.href}
                  className="font-body text-sm font-medium text-brown-deep border border-brown-deep px-5 py-1.5 rounded hover:bg-brown-deep hover:text-cream-light transition-all duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              ) : (
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Hamburger — visible below lg */}
        <button
          id="hamburger-btn"
          className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 -mr-2 text-brown-deep rounded focus-visible:outline-2 focus-visible:outline-gold-accent"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span
            className={`block h-px w-6 mx-auto bg-current origin-center transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <span
            className={`block h-px w-6 mx-auto bg-current transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 mx-auto bg-current origin-center transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* ── Mobile dropdown ── */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`
          lg:hidden
          overflow-hidden
          bg-cream-light/97 backdrop-blur-md
          border-b border-brown-deep/10
          transition-all duration-300 ease-in-out
          ${menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <ul className="px-6 py-4 flex flex-col gap-0" role="list">
          {ALL_LINKS.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  block py-3.5 font-body font-medium text-base
                  border-b border-brown-deep/8 last:border-0
                  transition-colors duration-200
                  ${link.label === "RSVP" ? "text-gold-accent" : "text-ink/80 hover:text-gold-accent"}
                `}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
