import Link from "next/link";

interface MonogramProps {
  /** Visual size of the badge */
  size?: "sm" | "md" | "lg";
  /** If set, the monogram becomes a link to this href */
  linkTo?: string;
  className?: string;
}

const sizes = {
  sm: { outer: "w-9 h-9", text: "text-base" },
  md: { outer: "w-12 h-12", text: "text-xl" },
  lg: { outer: "w-20 h-20", text: "text-3xl" },
};

/**
 * J² circular monogram badge.
 * Used in the nav (center), RSVP page header, and footer.
 * Plays on both names starting with J and the site name j2everyday.
 */
export default function Monogram({
  size = "md",
  linkTo,
  className = "",
}: MonogramProps) {
  const { outer, text } = sizes[size];

  const badge = (
    <span
      className={`
        inline-flex items-center justify-center rounded-full
        border border-brown-deep
        font-display italic text-brown-deep
        select-none flex-shrink-0
        ${outer} ${text} ${className}
      `}
      aria-label="J² monogram — Jesulayomi and Justin"
    >
      J
      <sup
        style={{ fontSize: "0.52em", lineHeight: 1, verticalAlign: "super" }}
      >
        2
      </sup>
    </span>
  );

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        className="rounded-full focus-visible:outline-2 focus-visible:outline-gold-accent focus-visible:outline-offset-3"
        aria-label="j2everyday home"
      >
        {badge}
      </Link>
    );
  }

  return badge;
}
