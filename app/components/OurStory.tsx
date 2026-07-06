import FadeIn from "./FadeIn";
import { TIMELINE } from "../lib/config";

export default function OurStory() {
  return (
    <section id="our-story" className="bg-brown-deep py-16 sm:py-24 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-16 md:mb-20">
          <span className="eyebrow" style={{ color: "#d9c9b9", opacity: 0.7 }}>
            Our Story
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream-light mt-4 mb-5 leading-tight">
            How it all began
          </h2>
          <p className="font-body text-beige-warm/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            Two paths, one love story — here&apos;s how it all unfolded.
          </p>
        </FadeIn>

        {/* Timeline — 3-col on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {TIMELINE.map((item, idx) => (
            <FadeIn
              key={item.number}
              delay={idx * 120}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              {/* Numbered circle */}
              <div
                className="w-11 h-11 rounded-full border border-gold-accent flex items-center justify-center mb-6 flex-shrink-0"
                aria-hidden="true"
              >
                <span className="font-display text-gold-accent text-lg leading-none">
                  {item.number}
                </span>
              </div>

              {/* Hairline connector on desktop */}
              <h3 className="font-display text-xl sm:text-2xl text-cream-light mb-3">
                {item.heading}
              </h3>
              <p className="font-body text-beige-warm/60 text-sm leading-relaxed">
                {item.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
