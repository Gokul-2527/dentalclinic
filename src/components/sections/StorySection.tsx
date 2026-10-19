"use client";

import { useEffect, useRef, useState } from "react";
import ScrollImageSequence from "@/components/animation/ScrollImageSequence";
import { registerGsap } from "@/lib/animations/gsap";
import type { ClinicSettings } from "@/types/content";

const storyLabels = [
  "A WARM WELCOME",
  "CARE WITH CLARITY",
  "PRECISION TREATMENT",
  "YOUR HEALTHY SMILE",
];

export default function StorySection({
  story,
}: {
  story: ClinicSettings["story"];
}) {
  const [p, setP] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const steps = story.steps;
  const stepCount = steps.length;

  useEffect(() => {
    if (stepCount === 0) return;

    const gsap = registerGsap();
    const root = textRef.current;

    if (!root) return;

    const eyebrow = root.querySelector(".story-eyebrow");
    const heading = root.querySelector(".story-heading");
    const description = root.querySelector(".story-description");
    const number = root.querySelector(".story-number");
    const divider = root.querySelector(".story-divider");

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .fromTo(
          eyebrow,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
        )
        .fromTo(
          heading,
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.2",
        )
        .fromTo(
          divider,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.55 },
          "-=0.35",
        )
        .fromTo(
          description,
          { x: 28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7 },
          "-=0.45",
        )
        .fromTo(
          number,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4 },
          "-=0.35",
        );
    }, root);

    return () => ctx.revert();
  }, [
    Math.min(
      stepCount - 1,
      Math.floor(Math.min(1, Math.max(0, p)) * stepCount),
    ),
    stepCount,
  ]);

  if (stepCount === 0) return null;

  const progress = Math.min(1, Math.max(0, p));
  const idx = Math.min(stepCount - 1, Math.floor(progress * stepCount));

  const step = steps[idx] ?? steps[0]; // Safe fallback if undefined
  if (!step) return null;

  const stepNumber = String(idx + 1).padStart(2, "0");
  const totalSteps = String(stepCount).padStart(2, "0");
  const eyebrow = storyLabels[idx] ?? "YOUR DENTAL JOURNEY";

  return (
    <section id="story" aria-labelledby="story-h" className="relative w-full">
      <h2 id="story-h" className="sr-only">
        Your dental journey, step by step
      </h2>

      <ScrollImageSequence
        manifest={story.sequence}
        label="Scroll-driven film of a dental visit"
        scrollDistance={3200}
        onProgress={setP}
      >
        {/* Top overlay: keep the center open for the animation */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-8 sm:px-9 sm:pt-10 lg:px-14 lg:pt-14">
          <div
            ref={textRef}
            aria-live="polite"
            aria-atomic="true"
            className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-start gap-7 text-white sm:grid-cols-2 sm:gap-10 lg:gap-16"
          >
            {/* TOP LEFT: Heading */}
            <div className="min-w-0 max-w-2xl">
              <div className="story-eyebrow mb-4 flex items-center gap-3 sm:mb-6">
                <span className="h-px w-8 bg-[#F3B79E]" />
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#FFD4C2] sm:text-[10px] md:text-xs">
                  {eyebrow}
                </p>
              </div>

              <h3 className="story-heading max-w-xl font-suranna text-[clamp(2.8rem,6.5vw,6.5rem)] font-normal leading-[0.9] tracking-[-0.04em] [text-wrap:balance] [text-shadow:0_3px_24px_rgba(35,10,4,0.16)]">
                {step.title}
                <span className="text-[#F5B49A]">.</span>
              </h3>

              <div className="story-divider mt-5 h-px w-24 origin-left bg-gradient-to-r from-[#F5B49A] to-transparent sm:mt-7 sm:w-36" />
            </div>

            {/* TOP RIGHT: Description and step counter */}
            <div className="flex min-w-0 flex-col items-start sm:ml-auto sm:max-w-md sm:items-end lg:max-w-lg">
              <p className="story-description max-w-lg text-sm font-light leading-7 tracking-wide text-white/90 [text-shadow:0_2px_16px_rgba(35,10,4,0.2)] sm:text-right sm:text-base sm:leading-8 lg:text-lg">
                {step.text}
              </p>

              <div className="story-number mt-5 flex w-full items-center justify-between border-t border-white/25 pt-4 sm:mt-7 sm:justify-end sm:gap-5">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/65 sm:text-right">
                  Your dental journey
                </p>

                <p className="font-suranna text-3xl leading-none sm:text-4xl">
                  {stepNumber}
                  <span className="mx-1 text-lg text-white/45">/</span>
                  <span className="text-xl text-white/65">{totalSteps}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal progress line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#F5B49A] via-white to-[#F5B49A]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </ScrollImageSequence>
    </section>
  );
}
