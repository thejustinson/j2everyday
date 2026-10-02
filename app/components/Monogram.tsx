import Image from "next/image";
import Link from "next/link";

interface MonogramProps {
  /** Visual size of the badge */
  size?: "sm" | "md" | "lg";
  /** If set, the monogram becomes a link to this href */
  linkTo?: string;
  className?: string;
}

const sizeConfig = {
  sm: { width: 38, height: 38, className: "w-9 h-9" },
  md: { width: 52, height: 52, className: "w-12 h-12 sm:w-13 sm:h-13" },
  lg: { width: 96, height: 96, className: "w-20 h-20 sm:w-24 sm:h-24" },
};

/**
 * Official Jesulayomi & Justin wedding logo / emblem.
 * Used in the navigation bar, RSVP page header, and footer.
 */
export default function Monogram({
  size = "md",
  linkTo,
  className = "",
}: MonogramProps) {
  const { width, height, className: sizeClass } = sizeConfig[size];

  const content = (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-105 ${sizeClass} ${className}`}
      aria-label="Jesulayomi & Justin Logo"
    >
      <Image
        src="/j2e-logo.png"
        alt="Jesulayomi & Justin"
        width={width}
        height={height}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );

  if (linkTo) {
    return (
      <Link
        href={linkTo}
        className="inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-gold-accent focus-visible:outline-offset-3"
        aria-label="j2everyday home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
