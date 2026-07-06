import FadeIn from "./FadeIn";

export default function InviteBanner() {
  return (
    <section
      aria-label="Invite-only notice"
      className="bg-brown-deep py-14 px-6"
    >
      <FadeIn className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-2xl sm:text-3xl text-cream-light mb-4 leading-snug">
          An intimate celebration
        </h2>
        <p className="font-body text-beige-warm/80 text-sm sm:text-base leading-relaxed">
          We&apos;re keeping this day close — just family and friends who mean
          the world to us. Entry will be by invitation only, so please have
          your invitation or access card ready on the day.
        </p>
      </FadeIn>
    </section>
  );
}
