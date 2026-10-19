"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, prefersReducedMotion, motion } from "@/lib/animations/gsap";
/** One orchestrated hero timeline: reveals every [data-hero] child in sequence. */
export default function HeroReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const c = gsap.context(() => { gsap.timeline({ defaults: { ease: motion.ease, duration: 1 } }).from("[data-hero]", { y: 36, opacity: 0, stagger: 0.14 }); }, ref);
    return () => c.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
