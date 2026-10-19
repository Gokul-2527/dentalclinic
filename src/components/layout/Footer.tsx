import Link from "next/link";
import Button from "@/components/ui/Button";
import type { SiteContent } from "@/types/content";

const linkClass =
  "group relative inline-block text-cream/70 transition-colors duration-300 hover:text-cream";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={linkClass}>
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-peach transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-[0.3em] text-peach">
      {children}
    </h3>
  );
}

export default function Footer({ c }: { c: SiteContent }) {
  const { settings: s, treatments } = c;

  return (
    <footer className="relative overflow-hidden bg-cocoa text-cream/80">
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-rust/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* CTA band */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-cream/10 py-16 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] text-cream md:text-6xl">
            Ready for your{" "}
            <span className="italic text-peach">best smile?</span>
          </h2>
          <Button href="/#appointment">Book an appointment</Button>
        </div>

        {/* columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* brand + contact */}
          <div>
            <p className="font-serif text-3xl text-cream">{s.name}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Considered, comfortable dental care with a plan built around you.
            </p>
          </div>

          {/* treatments */}
          <nav aria-label="Treatments">
            <ColumnTitle>Treatments</ColumnTitle>
            <ul className="mt-5 space-y-3 text-sm">
              {treatments.map((t) => (
                <li key={t.slug}>
                  <FooterLink href={`/treatments/${t.slug}`}>
                    {t.title}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* explore */}
          <nav aria-label="Explore">
            <ColumnTitle>Explore</ColumnTitle>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <FooterLink href="/#about">About</FooterLink>
              </li>
              <li>
                <FooterLink href="/#testimonials">Patient stories</FooterLink>
              </li>
              <li>
                <FooterLink href="/#doctors">Our team</FooterLink>
              </li>
              <li>
                <FooterLink href="/#faq">FAQ</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy-policy">Privacy policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/terms">Terms</FooterLink>
              </li>
            </ul>
          </nav>

          {/* visit */}
          <div>
            <ColumnTitle>Visit us</ColumnTitle>
            <address className="mt-5 space-y-3 text-sm not-italic">
              <p className="leading-relaxed text-cream/70">{s.address}</p>
              <p className="text-cream/70">{s.hours}</p>
              <p>
                <a className={linkClass} href={`tel:${s.phone}`}>
                  {s.phone}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-peach transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </p>
              <p>
                <a className={linkClass} href={`mailto:${s.email}`}>
                  {s.email}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-peach transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream/10 py-6 text-xs text-cream/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {s.name}. All rights reserved.
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-2 transition-colors hover:text-cream"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cream/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-peach group-hover:text-peach">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* giant faded wordmark */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-rampart-one text-[9.5vw] leading-[0.8] text-cream/[0.07]"
      >
        {s.name}
      </p>
    </footer>
  );
}
