"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { registerGsap, prefersReducedMotion, motion } from "@/lib/animations/gsap";
type From = "center" | "bottom" | "left";
const hidden: Record<From, string> = { center: "inset(30% 30% 30% 30% round 2rem)", bottom: "inset(100% 0% 0% 0% round 2rem)", left: "inset(0% 100% 0% 0% round 2rem)" };
export default function RevealImage({ src, alt, from = "bottom", sizes = "(min-width:1024px) 50vw, 100vw", className = "", priority = false }: { src: string; alt: string; from?: From; sizes?: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const c = gsap.context(() => {
      const st = { trigger: ref.current, start: "top 85%", once: true };
      gsap.fromTo(ref.current, { clipPath: hidden[from] }, { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.2, ease: motion.ease, scrollTrigger: st });
      gsap.fromTo(ref.current!.querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: motion.ease, scrollTrigger: st });
    }, ref);
    return () => c.revert();
  }, [from]);
  return <div ref={ref} className={`relative overflow-hidden rounded-[2rem] ${className}`}><Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" /></div>;
}
