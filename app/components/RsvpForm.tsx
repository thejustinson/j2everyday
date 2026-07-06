"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Monogram from "./Monogram";
import { RSVP_EMAIL } from "../lib/config";

type Attending = "accepts" | "declines" | null;

interface FormValues {
  name: string;
  code: string;
  attending: Attending;
  guests: string;
  phone: string;
  message: string;
}

const INITIAL: FormValues = {
  name: "",
  code: "",
  attending: null,
  guests: "1",
  phone: "",
  message: "",
};

// ── Success state ──────────────────────────────────────────────
function SuccessState({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center px-4 sm:px-6 py-16">
      <div className="max-w-md w-full text-center">
        {/* Check circle */}
        <div className="w-16 h-16 rounded-full border border-gold-accent flex items-center justify-center mx-auto mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a9824f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="font-display text-4xl text-brown-deep mb-4">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""}!
        </h2>
        <p className="font-body text-ink/65 text-sm sm:text-base leading-relaxed mb-10">
          Your email app should have opened with your RSVP ready to send.
          Please hit{" "}
          <strong className="text-brown-deep font-semibold">Send</strong> so
          your response reaches Jesulayomi &amp; Justin.
        </p>
        <Link
          href="/"
          className="font-body text-sm text-gold-accent hover:text-brown-deep transition-colors duration-200 tracking-wide"
        >
          ← Back to the wedding site
        </Link>
      </div>
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────
export default function RsvpForm() {
  const [form, setForm] = useState<FormValues>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [attendingError, setAttendingError] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.attending) {
      setAttendingError(true);
      return;
    }
    setAttendingError(false);

    const attendingText =
      form.attending === "accepts"
        ? "Joyfully accepts"
        : "Regretfully declines";

    const bodyLines = [
      `Full Name: ${form.name}`,
      `Invitation / Access Code: ${form.code}`,
      `Attending: ${attendingText}`,
      form.attending === "accepts"
        ? `Number Attending: ${form.guests}`
        : null,
      form.phone ? `Phone: ${form.phone}` : null,
      form.message ? `\nMessage:\n${form.message}` : null,
    ].filter(Boolean);

    const subject = encodeURIComponent(
      `RSVP — ${form.name} — ${attendingText}`,
    );
    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:${RSVP_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) return <SuccessState name={form.name} />;

  return (
    <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="w-full max-w-lg">
        {/* ── Header ── */}
        <header className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Monogram size="lg" linkTo="/" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-brown-deep mb-4">
            RSVP
          </h1>
          <p className="font-body text-ink/55 text-sm leading-relaxed max-w-xs mx-auto">
            This celebration is by invitation only. Please confirm using the
            details on your invitation.
          </p>
        </header>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white-warm border border-brown-deep/12 rounded-lg p-6 sm:p-8 md:p-10 space-y-6"
        >
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-name"
              className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55"
            >
              Full Name{" "}
              <span className="text-gold-accent" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="rsvp-name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="rsvp-input"
              placeholder="Your full name"
            />
          </div>

          {/* Access code */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-code"
              className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55"
            >
              Invitation / Access Code{" "}
              <span className="text-gold-accent" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="rsvp-code"
              type="text"
              required
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              className="rsvp-input"
              placeholder="Found on your invitation card"
            />
          </div>

          {/* Attending — pill radio buttons */}
          <fieldset>
            <legend className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55 mb-2.5">
              Attending?{" "}
              <span className="text-gold-accent" aria-hidden="true">
                *
              </span>
            </legend>
            <div className="flex gap-3">
              {(
                [
                  { value: "accepts", label: "Joyfully accepts" },
                  { value: "declines", label: "Regretfully declines" },
                ] as { value: Attending; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={form.attending === opt.value}
                  onClick={() => {
                    set("attending", opt.value);
                    setAttendingError(false);
                  }}
                  className={`
                    flex-1 py-2.5 px-2 sm:px-3 rounded-full border text-xs sm:text-sm font-body font-medium
                    text-center leading-tight
                    transition-all duration-200
                    focus-visible:outline-2 focus-visible:outline-gold-accent focus-visible:outline-offset-2
                    ${
                      form.attending === opt.value
                        ? "bg-brown-deep text-cream-light border-brown-deep"
                        : "bg-transparent text-brown-deep border-brown-deep/35 hover:border-brown-deep"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {attendingError && (
              <p
                className="mt-2 font-body text-xs text-red-700"
                role="alert"
                aria-live="polite"
              >
                Please let us know if you&apos;ll be attending.
              </p>
            )}
          </fieldset>

          {/* Guests + Phone — side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="rsvp-guests"
                className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55"
              >
                Number Attending
              </label>
              <select
                id="rsvp-guests"
                value={form.guests}
                onChange={(e) => set("guests", e.target.value)}
                className="rsvp-input"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="rsvp-phone"
                className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55"
              >
                Phone Number
              </label>
              <input
                id="rsvp-phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="rsvp-input"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="rsvp-message"
              className="font-body text-[0.72rem] uppercase tracking-[0.22em] text-ink/55"
            >
              Message for Jesulayomi &amp; Justin
            </label>
            <textarea
              id="rsvp-message"
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className="rsvp-input resize-none"
              rows={4}
              placeholder="Optional — share a message with the couple"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-brown-deep text-cream-light font-body font-medium text-xs uppercase tracking-[0.22em] rounded hover:bg-ink transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-gold-accent focus-visible:outline-offset-2"
          >
            Send RSVP
          </button>
        </form>

        {/* Back link */}
        <p className="text-center mt-8">
          <Link
            href="/"
            className="font-body text-sm text-gold-accent hover:text-brown-deep transition-colors duration-200 tracking-wide"
          >
            ← Back to the wedding site
          </Link>
        </p>
      </div>
    </div>
  );
}
