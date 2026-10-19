"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { registerGsap, prefersReducedMotion, motion } from "@/lib/animations/gsap";
export default function StaggerGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const c = gsap.context(() => { gsap.from(ref.current!.children, { y: 40, opacity: 0, duration: motion.dur, ease: motion.ease, stagger: motion.stagger, scrollTrigger: { trigger: ref.current, start: "top 80%", once: true } }); }, ref);
    return () => c.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
