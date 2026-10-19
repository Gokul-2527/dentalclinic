"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  address: string;
  hours: string;
  phone: string;
  email: string;
};

const icons = {
  pin: "M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
  clock: "M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
};

function Row({
  icon,
  label,
  value,
  href,
  visible,
  delay,
}: {
  icon: keyof typeof icons;
  label: string;
  value: string;
  href?: string;
  visible: boolean;
  delay: number;
}) {
  const inner = (
    <>
      {/* fill that sweeps in from the left on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-peach/15 transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-peach/40 text-peach transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-peach group-hover:text-ember motion-reduce:transition-none">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={icons[icon]} />
        </svg>
      </span>
      <span className="relative min-w-0">
        <span className="block text-xs uppercase tracking-[0.25em] text-cream/50">
          {label}
        </span>
        <span className="mt-1 block break-words text-lg text-cream">
          {value}
        </span>
      </span>
      {href && (
        <span
          aria-hidden="true"
          className="relative ml-auto text-peach opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
        >
          →
        </span>
      )}
    </>
  );

  const cls = `group relative flex items-center gap-5 overflow-hidden border-b border-cream/10 px-2 py-5 transition-all duration-700 ease-out motion-reduce:transition-none ${
    visible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
  }`;
  const style = { transitionDelay: visible ? `${delay}ms` : "0ms" };

  return href ? (
    <a
      href={href}
      className={`${cls} focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach`}
      style={style}
    >
      {inner}
    </a>
  ) : (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}

export default function ContactSection({
  address,
  hours,
  phone,
  email,
}: Props) {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  // start the entrance animation once the section scrolls into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  return (
    <section
      id="contact"
      ref={rootRef}
      aria-labelledby="contact-h"
      className="relative overflow-hidden bg-ember/70 px-6 py-24 text-cream md:py-32"
    >
      {/* soft glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-rust/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        {/* LEFT: heading + contact rows */}
        <div>
          <p
            className={`text-xs font-medium uppercase tracking-[0.35em] text-peach transition-all duration-700 motion-reduce:transition-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Contact
          </p>
          <h2
            id="contact-h"
            className={`mt-3 font-serif text-5xl leading-[1.02] transition-all delay-100 duration-700 motion-reduce:transition-none md:text-6xl ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Visit the <span className="italic text-peach">clinic.</span>
          </h2>
          <p
            className={`mt-5 max-w-md text-cream/70 transition-all delay-200 duration-700 motion-reduce:transition-none ${
              visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            Drop in, call ahead or send us a message. We&apos;ll be glad to
            help.
          </p>

          <div className="mt-10 border-t border-cream/10">
            <Row
              icon="pin"
              label="Address"
              value={address}
              href={directions}
              visible={visible}
              delay={300}
            />
            <Row
              icon="clock"
              label="Hours"
              value={hours}
              visible={visible}
              delay={400}
            />
            <Row
              icon="phone"
              label="Phone"
              value={phone}
              href={`tel:${phone}`}
              visible={visible}
              delay={500}
            />
            <Row
              icon="mail"
              label="Email"
              value={email}
              href={`mailto:${email}`}
              visible={visible}
              delay={600}
            />
          </div>
        </div>

        {/* RIGHT: stylized map card */}
        <div
          className={`relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-cream/10 bg-cocoa shadow-2xl transition-all delay-300 duration-1000 ease-out motion-reduce:transition-none sm:aspect-[5/4] lg:aspect-[4/5] ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-12 scale-95 opacity-0"
          }`}
        >
          {/* map grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* faux roads */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 500"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
          >
            <path
              d="M-20 380 C 120 300, 200 360, 420 200"
              className="text-cream/15"
              strokeWidth="10"
            />
            <path
              d="M-20 380 C 120 300, 200 360, 420 200"
              className="text-peach/40"
              strokeWidth="1.5"
              strokeDasharray="6 10"
            />
            <path
              d="M120 -20 C 160 160, 260 240, 240 520"
              className="text-cream/10"
              strokeWidth="8"
            />
          </svg>

          {/* pulsing pin */}
          <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-peach/30 motion-reduce:animate-none"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-peach/20 motion-reduce:animate-none"
              style={{ animationDelay: "0.8s" }}
            />
            <div className="relative animate-float motion-reduce:animate-none">
              <svg
                viewBox="0 0 24 24"
                className="h-14 w-14 text-peach drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
              </svg>
            </div>
          </div>

          {/* floating address card */}
          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-4 rounded-2xl bg-cream p-5 text-ember shadow-xl">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-ember/50">
                Find us
              </p>
              <p className="mt-1 truncate font-serif text-lg">{address}</p>
            </div>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm text-cream transition hover:bg-rust focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach"
            >
              Directions
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
