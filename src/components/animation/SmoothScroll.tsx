"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap, prefersReducedMotion } from "@/lib/animations/gsap";
/** Single scroll controller: Lenis drives ScrollTrigger through gsap.ticker. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const gsap = registerGsap();
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return null;
}
