import FadeIn from "./FadeIn";
import { SCHEDULE } from "../lib/config";

export default function Schedule() {
  return (
    <section id="schedule" className="py-16 sm:py-24 px-5 sm:px-6 bg-white-warm">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="eyebrow mb-4">Itinerary</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-deep mt-4">
            Order of the day
          </h2>
        </FadeIn>

        {/* Time-blocks */}
        <ol className="list-none space-y-0">
          {SCHEDULE.map((item, idx) => (
            <li key={idx}>
              <FadeIn delay={idx * 100}>
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 py-6 sm:py-8 border-b border-brown-deep/10 last:border-0">
                  {/* Time — italic Cormorant Garamond in gold */}
                  <div className="sm:w-36 flex-shrink-0 pt-0.5">
                    <time
                      className="font-display italic text-gold-accent text-lg leading-snug"
                      dateTime={item.time}
                    >
                      {item.time}
                    </time>
                  </div>

                  {/* Title + description */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-brown-deep mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-ink/55 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
