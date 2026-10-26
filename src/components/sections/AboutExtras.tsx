"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

/* ---------- shared: true once the element scrolls into view ---------- */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, seen };
}

/* ---------- count-up number ---------- */
function CountUp({ to, start }: { to: number; start: boolean }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const duration = 1800;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return <>{n.toLocaleString("en-IN")}</>;
}

/* ---------- 1. stats strip ---------- */
export type Stat = { value: number; suffix?: string; label: string };

export function AboutStats({ stats }: { stats: Stat[] }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.3);

  return (
    <section ref={ref} aria-labelledby="about-stats-title" className="w-full">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-peach">
            Our practice in numbers
          </p>
          <h2
            id="about-stats-title"
            className="mt-2 font-serif text-3xl leading-tight text-cream md:text-4xl"
          >
            Care that adds up.
          </h2>
        </div>
        <span
          aria-hidden="true"
          className="hidden h-px w-24 bg-peach/60 sm:block"
        />
      </div>

      <div className="grid w-full grid-cols-2 border-y border-cream/20 py-2 lg:grid-cols-4 lg:py-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`relative border-cream/20 px-4 py-6 transition-all duration-700 ease-out motion-reduce:transition-none sm:px-6 lg:py-4 ${
              i % 2 === 1 ? "border-l" : "border-l-0"
            } ${i === 0 ? "lg:border-l-0" : "lg:border-l"} ${
              seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: seen ? `${i * 120}ms` : "0ms" }}
          >
            <span className="mb-4 block text-[10px] font-medium uppercase tracking-[0.25em] text-cream/45">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="whitespace-nowrap font-serif text-4xl leading-none tabular-nums text-peach sm:text-5xl md:text-6xl">
              <CountUp to={s.value} start={seen} />
              {s.suffix}
            </p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream/75 sm:text-xs">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 2. pillars + CTA ---------- */
const PILLARS = [
  {
    title: "We listen first",
    text: "Every plan starts with your goals, your concerns and your comfort, before any treatment is suggested.",
  },
  {
    title: "We explain clearly",
    text: "You hear the options, the process and the estimated costs in plain language, so every decision is yours.",
  },
  {
    title: "We care gently",
    text: "Careful techniques and an unhurried pace keep visits calm, from the first check-up to the final follow-up.",
  },
];

export function AboutPillars() {
  const { ref, seen } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref} className="w-full">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-peach">
          How we care
        </p>
        <h3 className="mt-3 font-serif text-3xl text-cream md:text-4xl">
          Built around <span className="italic text-peach">you.</span>
        </h3>
      </div>

      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <li
            key={p.title}
            className={`group relative overflow-hidden rounded-3xl border border-cream/15 bg-cream/10 p-8 backdrop-blur-md transition-all duration-700 ease-out hover:-translate-y-2 hover:bg-cream/15 motion-reduce:transition-none ${
              seen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
            style={{ transitionDelay: seen ? `${i * 150}ms` : "0ms" }}
          >
            {/* big faded number */}
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-4 font-serif text-8xl leading-none text-cream/[0.07] transition-transform duration-500 group-hover:scale-110"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <h4 className="relative font-serif text-2xl text-cream">
              {p.title}
            </h4>
            <p className="relative mt-3 text-cream/75">{p.text}</p>

            {/* line that grows on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-8 bottom-6 h-px origin-left scale-x-0 bg-peach transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>

      {/* closing CTA */}
      <div
        className={`mt-14 flex flex-col items-center gap-6 text-center transition-all delay-300 duration-700 motion-reduce:transition-none ${
          seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="max-w-lg text-lg text-cream/80">
          Curious what a visit looks like? Meet the people who will look after
          your smile.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="#appointment">Book an appointment</Button>
          <Button href="#doctors" variant="glass">
            Meet our team
          </Button>
        </div>
      </div>
    </div>
  );
}
