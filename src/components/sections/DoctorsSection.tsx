"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/types/content";

type Doctor = SiteContent["doctors"][number];

export default function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  const [visible, setVisible] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  // start the staggered entrance once the team scrolls into view
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!doctors.length) return null;

  return (
    <section id="doctors" className="overflow-hidden px-6 pb-28 pt-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-ember/60">
          Meet the team
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ember md:text-5xl">
          Your dental <span className="italic text-rust">team.</span>
        </h2>

        <ul
          ref={listRef}
          className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {doctors.map((d, i) => (
            <li
              key={d.slug}
              className={`group transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              } ${i % 2 === 1 ? "lg:mt-14" : ""}`}
              style={{ transitionDelay: visible ? `${i * 130}ms` : "0ms" }}
            >
              <div className="relative">
                {/* peach blob behind the portrait */}
                <span
                  aria-hidden="true"
                  className="absolute -inset-3 rounded-[48%_52%_45%_55%/55%_45%_55%_45%] bg-peach/50 transition-transform duration-700 ease-out group-hover:rotate-[14deg] group-hover:scale-105 motion-reduce:transition-none"
                />

                {/* big index number */}
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-6 z-10 font-serif text-6xl leading-none text-rust/80 transition-transform duration-500 group-hover:-translate-y-1"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* arch-shaped portrait */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-b-3xl rounded-t-[999px] bg-clay shadow-xl">
                  <Image
                    src={d.image}
                    alt={`Portrait of ${d.name}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
                    loading="lazy"
                  />

                  {/* slide-up bar on hover / keyboard focus */}
                  <a
                    href="#appointment"
                    className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-ember px-6 py-4 text-sm text-cream transition-transform duration-500 ease-out focus-visible:translate-y-0 group-hover:translate-y-0 motion-reduce:transition-none"
                  >
                    Book a visit
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <p className="font-serif text-2xl text-ember">{d.name}</p>
                <p className="mt-1 text-sm text-cocoa/70">{d.qualifications}</p>
                <span className="mt-3 inline-block rounded-full border border-ember/20 px-3 py-1 text-xs text-ember transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-cream">
                  {d.specialization}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
