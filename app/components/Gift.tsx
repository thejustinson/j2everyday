import FadeIn from "./FadeIn";
import { ACCOUNT } from "../lib/config";

const ACCOUNT_ROWS = [
  { label: "Account Name", value: ACCOUNT.name },
  { label: "Account Number", value: ACCOUNT.number },
  { label: "Bank", value: ACCOUNT.bank },
];

export default function Gift() {
  return (
    <section id="gift" className="py-16 sm:py-24 px-5 sm:px-6 bg-cream-light">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <span className="eyebrow mb-4">Gift</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-brown-deep mt-4 leading-tight">
            Your presence is the present
          </h2>
        </FadeIn>

        {/* Card — gold border */}
        <FadeIn delay={100}>
          <div className="border border-gold-accent/45 rounded-lg bg-white-warm px-5 sm:px-8 md:px-12 py-8 sm:py-10">
            <p className="font-body text-ink/65 text-sm sm:text-base leading-relaxed text-center mb-10">
              We don&apos;t need any physical gift items — the greatest gift is
              having you there with us. If you&apos;d still like to bless us, a
              cash gift is warmly welcome.
            </p>

            {/* Account details */}
            <dl className="space-y-0">
              {ACCOUNT_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-0.5 xs:gap-0 py-3 border-b border-brown-deep/8 last:border-0"
                >
                  <dt className="font-body text-ink/45 text-xs uppercase tracking-[0.15em]">
                    {row.label}
                  </dt>
                  <dd className="font-body text-brown-deep font-medium text-sm text-left xs:text-right ml-0 break-all">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
