import Monogram from "./Monogram";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-cream-light border-t border-brown-deep/10 text-center">
      <div className="flex flex-col items-center gap-5">
        <Monogram size="lg" linkTo="/" />
        <p className="font-display italic text-brown-deep text-2xl tracking-wide">
          Jesulayomi &amp; Justin
        </p>
        <p className="font-body text-ink/40 text-xs tracking-[0.25em] uppercase">
          November 7, 2026 &nbsp;&middot;&nbsp; #j2everyday
        </p>
        <Link
          href="/upload"
          className="mt-1 font-body text-xs text-gold-accent hover:text-brown-deep transition-colors duration-200 tracking-[0.16em] uppercase font-medium"
        >
          Share Your Photos &rarr;
        </Link>
      </div>
    </footer>
  );
}
