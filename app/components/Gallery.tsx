import FadeIn from "./FadeIn";

/**
 * Gallery tile data.
 * To swap in a real photo, add a `src` string to the item and update
 * the tile to render a next/image — one change per tile.
 */
const GALLERY_ITEMS = [
  { id: 1, alt: "Jesulayomi and Justin" },             // 2×2 large tile
  { id: 2, alt: "A moment together" },
  { id: 3, alt: "A moment together" },
  { id: 4, alt: "A moment together" },
  { id: 5, alt: "A moment together" },
];

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a9824f"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

/**
 * Placeholder tile — swap the interior for a real next/image when ready.
 * The outer div classes (grid span etc.) are controlled by the parent.
 */
function PlaceholderTile({
  className = "",
  alt,
}: {
  className?: string;
  alt: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      role="img"
      aria-label={`${alt} — photo coming soon`}
      style={{
        background:
          "repeating-linear-gradient(135deg, #d9c9b9 0px, #d9c9b9 22px, #f8f3ec 22px, #f8f3ec 44px)",
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <CameraIcon />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.7rem",
            color: "#a9824f",
            letterSpacing: "0.12em",
          }}
        >
          Coming soon
        </span>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <section id="gallery" className="py-16 sm:py-24 px-5 sm:px-6 bg-cream-light">
      <div className="max-w-5xl mx-auto">
        <FadeIn className="text-center mb-12">
          <span className="eyebrow mb-4">Gallery</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-deep mt-4 mb-4">
            Moments together
          </h2>
          <p className="font-body text-ink/50 text-sm max-w-xs mx-auto leading-relaxed">
            Our favourite photos will live here — check back soon.
          </p>
        </FadeIn>

        {/* ── Bento grid ──
            Mobile  (2-col): first tile spans full width (col-span-2), rest 1×1
            Desktop (3-col): first tile spans 2 cols × 2 rows (sm:col-span-2 sm:row-span-2), rest 1×1
        */}
        <FadeIn delay={100}>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            style={{ gridAutoRows: "clamp(140px, 22vw, 200px)" }}
          >
            {/* Large bento tile */}
            <PlaceholderTile
              alt={GALLERY_ITEMS[0].alt}
              className="col-span-2 row-span-1 sm:row-span-2"
            />

            {/* Smaller tiles */}
            {GALLERY_ITEMS.slice(1).map((item) => (
              <PlaceholderTile
                key={item.id}
                alt={item.alt}
                className="col-span-1 row-span-1"
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
