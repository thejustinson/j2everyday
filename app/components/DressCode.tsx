import FadeIn from "./FadeIn";
import { DRESS_CODE } from "../lib/config";

/** The three suggested palette swatches */
const SWATCHES = [
  { hex: "#4a3429", label: "Deep Brown" },
  { hex: "#d9c9b9", label: "Warm Beige" },
  { hex: "#a9824f", label: "Gold Accent" },
];

function DressCard({
  title,
  description,
  delay = 0,
}: {
  title: string;
  description: string;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <article className="flex flex-col p-6 sm:p-8 md:p-10 border border-brown-deep/12 rounded-lg bg-cream-light h-full">
        <h3 className="font-display text-2xl text-brown-deep mb-1">{title}</h3>
        {/* Hairline under heading */}
        <div className="w-8 h-px bg-gold-accent mb-5" aria-hidden="true" />
        <p className="font-body text-ink/60 text-sm leading-relaxed flex-1 mb-8">
          {description}
        </p>

        {/* Colour swatches */}
        <div className="flex items-center gap-3">
          {SWATCHES.map((swatch) => (
            <span
              key={swatch.hex}
              className="w-6 h-6 rounded-full border border-brown-deep/20 flex-shrink-0"
              style={{ backgroundColor: swatch.hex }}
              title={swatch.label}
              aria-label={swatch.label}
            />
          ))}
          <span className="font-body text-ink/35 text-xs ml-1 tracking-wide">
            Colour palette
          </span>
        </div>
      </article>
    </FadeIn>
  );
}

export default function DressCode() {
  return (
    <section id="dress-code" className="py-16 sm:py-24 px-5 sm:px-6 bg-beige-warm">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <span className="eyebrow mb-4">Dress Code</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-deep mt-4">
            What to wear
          </h2>
        </FadeIn>

        {/* Two cards — side by side on sm+, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <DressCard title="Ladies" description={DRESS_CODE.ladies} delay={0} />
          <DressCard
            title="Gentlemen"
            description={DRESS_CODE.gentlemen}
            delay={100}
          />
        </div>
      </div>
    </section>
  );
}
