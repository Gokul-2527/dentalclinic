"use client";

import { useState, useEffect } from "react";

interface RotatingHeroHeadlineProps {
  initialHeadline: string;
}

const ROTATING_HEADLINES = [
  "Modern care for a perfect smile.",
  "Gentle dentistry tailored for your family.",
  "Advanced technology, compassionate comfort.",
];

export default function RotatingHeroHeadline({
  initialHeadline,
}: RotatingHeroHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(true);

  // Combine the dynamic database/settings headline with fallback rotating taglines
  const headlines = [
    initialHeadline,
    ...ROTATING_HEADLINES.filter((h) => h !== initialHeadline),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeAnim(false); // Fade out and slide up slightly
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        setFadeAnim(true); // Fade in and slide down to position
      }, 400); // Transition duration matching CSS duration
    }, 4500); // Rotate every 4.5 seconds

    return () => clearInterval(interval);
  }, [headlines]);

  // Ensure headlineText is guaranteed to be a string
  const headlineText = headlines[currentIndex] || initialHeadline;
  const w = headlineText.replace(/\.$/, "").split(" ");
  const peachText = w.length > 2 ? `${w.slice(0, -2).join(" ")} ` : "";
  const whiteText = w.length > 2 ? w.slice(-2).join(" ") : headlineText;
  let characterIndex = 0;

  const renderLetters = (text: string, className: string) => (
    <span
      key={`${currentIndex}-${className}`}
      className={className}
      aria-hidden="true"
    >
      {Array.from(text, (character) => {
        const delay = characterIndex++ * 25;
        return (
          <span
            key={`${characterIndex}-${character}`}
            className="inline-block hero-letter-reveal"
            style={{ animationDelay: `${delay}ms`, whiteSpace: "pre" }}
          >
            {character}
          </span>
        );
      })}
    </span>
  );

  return (
    <h1
      data-hero
      aria-label={headlineText}
      className={`max-w-3xl font-sans text-[clamp(2.8rem,6vw,5.5rem)] font-light leading-[1] tracking-tight transition-all duration-500 transform ${
        fadeAnim ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
      }`}
    >
      {renderLetters(peachText, "text-peach")}
      {renderLetters(whiteText, "text-white")}
    </h1>
  );
}
