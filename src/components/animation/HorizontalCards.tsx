"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { registerGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Treatment } from "@/types/content";

export default function HorizontalCards({
  treatments,
}: {
  treatments: Treatment[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track || treatments.length === 0) return;

    const gsap = registerGsap();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".treatment-card", track);

      if (prefersReducedMotion() || cards.length < 2) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - section.clientWidth);

      // The track controls the main horizontal scroll.
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(getScrollAmount(), 1)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each card as it travels through the viewport.
      gsap.set(cards, {
        scale: 0.84,
        opacity: 0.25,
        transformOrigin: "center center",
      });

      cards.forEach((card) => {
        gsap.to(card, {
          keyframes: {
            scale: [0.84, 1, 0.78],
            opacity: [0.25, 1, 0],
          },
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: "left 95%",
            end: "right 5%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      // Keep the first card prominent when the sequence begins.
      if (cards[0]) {
        gsap.set(cards[0], {
          scale: 1,
          opacity: 1,
        });
      }

      // Recalculate the pin distance when image/layout sizes change.
      const refresh = () => {
        window.requestAnimationFrame(() => {
          if (section.isConnected) {
            ScrollTrigger.refresh();
          }
        });
      };

      window.addEventListener("resize", refresh);

      return () => {
        window.removeEventListener("resize", refresh);
      };
    }, section);

    return () => ctx.revert();
  }, [treatments]);

  if (treatments.length === 0) return null;

  return (
    <section
      id="treatments"
      ref={sectionRef}
      className="relative flex h-[100svh] flex-col justify-center overflow-hidden bg-cream"
      aria-labelledby="horizontal-treatments-heading"
    >
      {/* Fixed section heading */}
      <div className="absolute left-6 right-6 top-6 z-10 sm:left-10 sm:right-10 sm:top-8 lg:left-24 lg:right-24 lg:top-10">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-ember/55 sm:text-xs">
          Thoughtful care, tailored to you
        </p>

        <h2
          id="horizontal-treatments-heading"
          className="max-w-2xl font-suranna text-3xl leading-tight text-ember sm:text-5xl lg:text-6xl"
        >
          Care for every stage of your smile
        </h2>

        <p className=" text-xs text-ember/65 sm:text-sm">
          Scroll to discover your treatment options.
        </p>
      </div>

      {/* Horizontal card track */}
      <div
        ref={trackRef}
        className="mt-48 flex h-[68svh] w-max items-center gap-6 px-6 sm:gap-10 sm:px-10 lg:gap-12 lg:px-24 motion-reduce:!mt-0 motion-reduce:!h-auto motion-reduce:!w-full motion-reduce:!flex-col motion-reduce:!items-stretch motion-reduce:!gap-8 motion-reduce:!px-4"
      >
        {treatments.map((t, idx) => (
          <article
            key={t.slug}
            className="treatment-card group relative flex h-full w-[88vw] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-ember/10 bg-white shadow-[0_30px_90px_-30px_rgba(53,21,15,0.24)] sm:w-[82vw] sm:rounded-[2.25rem] lg:w-[min(78vw,1120px)] md:flex-row motion-reduce:!h-auto motion-reduce:!min-h-[480px] motion-reduce:!w-full motion-reduce:!shrink-0"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Image */}
            <div className="relative h-[42%] min-h-0 shrink-0 overflow-hidden bg-[#F0E5DC] md:h-full md:w-[56%]">
              <Image
                src={t.image}
                alt={t.imageAlt}
                fill
                sizes="(min-width: 1024px) 44vw, 88vw"
                priority={idx === 0}
                loading={idx === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#35150F]/25 via-transparent to-transparent md:bg-gradient-to-r" />

              <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/75 px-4 py-2 text-[9px] font-medium uppercase tracking-[0.2em] text-ember backdrop-blur-md sm:left-6 sm:top-6 sm:text-[10px]">
                Treatment {String(idx + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto p-5 sm:p-8 md:w-[44%] md:p-8 lg:p-12 xl:p-14">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-ember/50 sm:text-[10px]">
                  Personalised dental care
                </p>

                <h3 className="mt-3 font-suranna text-3xl leading-[1.05] text-ember sm:text-4xl lg:text-5xl xl:text-6xl">
                  {t.title}
                </h3>

                <div className="my-4 h-px w-14 bg-[#C5460F]/60 sm:my-6" />

                <p className="max-w-md text-sm font-light leading-6 text-ember/70 sm:text-base sm:leading-8">
                  {t.summary}
                </p>
              </div>

              <div className="mt-5 border-t border-ember/10 pt-4 sm:mt-8 sm:pt-6">
                <Link
                  href={`/treatments/${t.slug}`}
                  className="group/link inline-flex min-h-11 items-center gap-3 text-sm font-medium text-ember transition-colors hover:text-[#C5460F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:text-base"
                >
                  Explore treatment
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover/link:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </article>
        ))}

        {/* Final breathing space */}
        <div
          aria-hidden="true"
          className="w-2 shrink-0 sm:w-8 lg:w-12 motion-reduce:hidden"
        />
      </div>

      {/* Scroll progress hint */}
      <div className="absolute bottom-5 right-6 flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-ember/50 sm:bottom-8 sm:right-10 lg:right-24">
        <span>Scroll to explore</span>
        <span aria-hidden="true" className="text-base">
          →
        </span>
      </div>
    </section>
  );
}
