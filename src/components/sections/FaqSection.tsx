"use client";

import { useEffect, useRef, useState } from "react";
import type { Faq } from "@/types/content";

export default function FaqSection({
  faqs,
  phone,
}: {
  faqs: Faq[];
  phone?: string;
}) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const [visible, setVisible] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // start the staggered entrance once the list scrolls into view
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!faqs.length) return null;

  return (
    <section id="faq" className="bg-cream px-6 py-24" aria-labelledby="faq-h">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
        {/* left: sticky heading */}
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-ember/60">
            FAQ
          </p>
          <h2
            id="faq-h"
            className="mt-3 font-serif text-4xl leading-[1.05] text-ember md:text-5xl"
          >
            Questions, <span className="italic text-rust">answered.</span>
          </h2>
          <p className="mt-5 max-w-sm text-ember/70">
            Can&apos;t find what you&apos;re looking for? Reach out and the
            clinic will be happy to help.
          </p>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ember/20 px-5 py-3 text-sm font-medium text-ember transition hover:bg-ember hover:text-cream"
            >
              Call {phone}
              <span aria-hidden="true">→</span>
            </a>
          )}
        </div>

        {/* right: accordion */}
        <div ref={listRef} className="border-t border-ember/15">
          {faqs.map((f, i) => {
            const isOpen = open === f.id;
            const panelId = `faq-panel-${f.id}`;
            const btnId = `faq-btn-${f.id}`;

            return (
              <div
                key={f.id}
                className={`border-b border-ember/15 transition-all duration-700 ease-out motion-reduce:transition-none ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="group relative flex w-full items-center gap-5 overflow-hidden px-2 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach md:gap-8"
                  >
                    {/* hover fill that sweeps in from the left */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 origin-left bg-peach/30 transition-transform duration-500 ease-out motion-reduce:transition-none ${
                        isOpen
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />

                    {/* number */}
                    <span
                      aria-hidden="true"
                      className={`relative w-10 shrink-0 font-serif text-2xl transition-colors duration-300 md:w-14 md:text-3xl ${
                        isOpen ? "text-rust" : "text-ember/30"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* question */}
                    <span className="relative flex-1 text-lg font-medium text-ember md:text-xl">
                      {f.question}
                    </span>

                    {/* plus to cross */}
                    <span
                      aria-hidden="true"
                      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 motion-reduce:transition-none ${
                        isOpen
                          ? "rotate-45 border-ember bg-ember text-cream"
                          : "border-ember/25 text-ember group-hover:border-ember"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>

                {/* smooth height animation via grid rows */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl px-2 pb-7 pl-[3.75rem] text-ember/75 md:pl-[5.5rem]">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
