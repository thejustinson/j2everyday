import FadeIn from "./FadeIn";
import { VENUE } from "../lib/config";

export default function Venue() {
  return (
    <section id="venue" className="py-16 sm:py-24 px-5 sm:px-6 bg-cream-light">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <span className="eyebrow mb-4">Venue</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-deep mt-4">
            Where we&apos;ll say &ldquo;I do&rdquo;
          </h2>
        </FadeIn>

        {/* Card */}
        <FadeIn delay={100}>
          <div className="border border-brown-deep/15 rounded-lg bg-white-warm text-center overflow-hidden">
            <div className="px-5 sm:px-10 py-10 sm:py-12">
              <h3 className="font-display text-2xl sm:text-3xl text-brown-deep mb-2">
                {VENUE.name}
              </h3>
              <p className="font-body text-ink/55 text-sm mb-10 leading-relaxed">
                {VENUE.address}
              </p>

              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-brown-deep text-brown-deep font-body text-sm font-medium px-8 py-3 rounded hover:bg-brown-deep hover:text-cream-light transition-all duration-200 tracking-wide"
              >
                Get Directions
              </a>
            </div>

            {/* Dashed divider note */}
            <div className="border-t border-dashed border-brown-deep/15 px-5 sm:px-10 py-6">
              <p className="font-body text-ink/40 text-xs leading-relaxed tracking-wide">
                Reception venue &amp; timing will be shared privately on your
                access card.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
