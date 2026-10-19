"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
let registered = false;
export function registerGsap() { if (!registered && typeof window !== "undefined") { gsap.registerPlugin(ScrollTrigger); registered = true; } return gsap; }
export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const motion = { ease: "power3.out", dur: 0.9, stagger: 0.12 };
