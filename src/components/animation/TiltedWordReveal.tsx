"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  tilt?: number; // degrees of overall rotation, negative = rises to the right
  curve?: number; // how much the ends bend (0 = straight, higher = more curve)
  speed?: number; // scroll speed in SVG units per second (higher = faster)
  reverse?: boolean; // run left to right
};

export default function CurvedMarquee({
  text,
  tilt = -8,
  curve = 220,
  speed = 160,
  reverse = false,
}: Props) {
  const measureRef = useRef<SVGTextElement>(null);
  const pathRef = useRef<SVGTextPathElement>(null);
  const [unit, setUnit] = useState(0);

  const unitText = `${text}  •  `;
  const REPEATS = 8;

  // measure one repeat of the text once the custom font has loaded
  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !measureRef.current) return;
      setUnit(measureRef.current.getComputedTextLength());
    };
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    else measure();
    return () => {
      cancelled = true;
    };
  }, [unitText]);

  // continuous loop, never pauses (no hover handlers)
  useEffect(() => {
    if (!unit || !pathRef.current) return;
    const el = pathRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let raf = 0;
    let last = performance.now();
    let offset = reverse ? -unit : 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      offset += (reverse ? 1 : -1) * speed * dt;
      // wrap by exactly one repeat so the loop is seamless
      if (offset <= -unit) offset += unit;
      if (offset > 0) offset -= unit;
      el.setAttribute("startOffset", String(offset));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [unit, speed, reverse]);

  // Curved path: wider than the viewBox so the ends never show.
  // Middle sits lower than the ends, so both ends curve up and inward.
  const pathD = `M -700 160 Q 1000 ${160 + curve * 2} 2700 160`;

  return (
    <div className="relative flex min-h-[70svh] w-full items-center overflow-hidden">
      <div
        className="-ml-[10%] w-[120%]"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        <svg
          viewBox={`0 0 2000 ${240 + curve}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label={text}
        >
          <defs>
            <path id="marquee-curve" d={pathD} />
          </defs>

          {/* hidden, used only to measure one repeat */}
          <text
            ref={measureRef}
            className="font-rampart-one"
            fontSize="230"
            visibility="hidden"
          >
            {unitText}
          </text>

          <g
            style={{
              filter:
                "drop-shadow(-3px 3px 0 #f4c9a8) drop-shadow(-6px 6px 0 #c2410c)",
            }}
          >
            <text
              className="font-rampart-one"
              fontSize="230"
              fill="#ffffff"
              aria-hidden="true"
              style={{ whiteSpace: "pre" }}
            >
              <textPath ref={pathRef} href="#marquee-curve" startOffset="0">
                {unitText.repeat(REPEATS)}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
