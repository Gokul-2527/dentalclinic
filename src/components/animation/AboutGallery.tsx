"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HOVER_HEIGHT = 400;

const IMAGES = [
  {
    src: "/images/Aboutus/img1.webp",
    alt: "Dentist consulting with a patient",
    w: 300,
    h: 220,
  },
  {
    src: "/images/Aboutus/img2.webp",
    alt: "Modern comfortable dental suite",
    w: 180,
    h: 240,
  },
  {
    src: "/images/Aboutus/img3.jpg",
    alt: "Clinic reception area",
    w: 240,
    h: 160,
  },
  {
    src: "/images/Aboutus/img4.avif",
    alt: "Treatment room",
    w: 170,
    h: 170,
  },
  {
    src: "/images/Aboutus/img5.jpg",
    alt: "Dental equipment",
    w: 280,
    h: 200,
  },
  {
    src: "/images/Aboutus/img6.jpg",
    alt: "Friendly dental team",
    w: 190,
    h: 250,
  },
  {
    src: "/images/Aboutus/img7.avif",
    alt: "Patient smiling after treatment",
    w: 260,
    h: 180,
  },
  {
    src: "/images/Aboutus/img8.avif",
    alt: "Clinic interior detail",
    w: 220,
    h: 220,
  },
];

export default function AboutGallery() {
  const [active, setActive] = useState<number | null>(null);
  const [ratios, setRatios] = useState<Record<number, number>>({});

  return (
    <motion.div
      layout
      className="mx-auto flex w-full  flex-wrap items-center justify-center gap-4"
      onMouseLeave={() => setActive(null)}
      transition={{
        layout: {
          type: "spring",
          stiffness: 180,
          damping: 24,
          mass: 0.8,
        },
      }}
    >
      {IMAGES.map((img, i) => {
        const ratio = ratios[i];
        const isActive = active === i && !!ratio;

        const expandedWidth = ratio
          ? `min(${HOVER_HEIGHT * ratio}px, calc(100vw - 3rem))`
          : img.w;

        const expandedHeight = ratio
          ? `min(${HOVER_HEIGHT}px, calc((100vw - 3rem) / ${ratio}))`
          : img.h;

        return (
          <motion.figure
            layout
            key={img.src}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === i ? null : i)}
            initial={false}
            animate={{
              width: isActive ? expandedWidth : img.w,
              height: isActive ? expandedHeight : img.h,
              borderRadius: isActive ? 24 : 20,
              scale: isActive ? 1 : 0.98,
            }}
            transition={{
              layout: {
                type: "spring",
                stiffness: 180,
                damping: 24,
                mass: 0.8,
              },
              width: {
                type: "spring",
                stiffness: 170,
                damping: 25,
              },
              height: {
                type: "spring",
                stiffness: 170,
                damping: 25,
              },
              scale: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            style={{
              maxWidth: "calc(100vw - 3rem)",
              maxHeight: "min(400px, 65vh)",
            }}
            className={`relative shrink-0 cursor-pointer overflow-hidden shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[#C5460F] focus-visible:ring-offset-4 ${
              isActive ? "z-10" : "z-0"
            }`}
            tabIndex={0}
            role="button"
            aria-label={`${isActive ? "Collapse" : "Expand"} image: ${img.alt}`}
            aria-pressed={isActive}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: isActive ? 0.92 : 1,
              }}
              transition={{
                scale: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 90vw, 600px"
                className="object-cover"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;

                  if (naturalWidth && naturalHeight) {
                    setRatios((previous) => ({
                      ...previous,
                      [i]: naturalWidth / naturalHeight,
                    }));
                  }
                }}
              />
            </motion.div>

            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
              animate={{ opacity: isActive ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.figure>
        );
      })}
    </motion.div>
  );
}
