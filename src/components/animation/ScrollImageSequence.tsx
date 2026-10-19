"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { registerGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import type { SequenceManifest } from "@/types/content";

interface Props { manifest: SequenceManifest; scrollDistance?: number; fit?: "cover" | "contain"; initialFrames?: number; maxDpr?: number; label: string; onProgress?: (p: number) => void; children?: ReactNode }
const src = (m: SequenceManifest, i: number) => m.framePath.replace("{index}", String(i + 1).padStart(4, "0"));

export default function ScrollImageSequence({ manifest, scrollDistance = 3000, fit = "cover", initialFrames = 12, maxDpr = 1.5, label, onProgress, children }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cb = useRef(onProgress); cb.current = onProgress;
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) return; // poster stays as the static fallback
    const cv = canvas.current!, ctx = cv.getContext("2d");
    if (!ctx) return;
    const gsap = registerGsap();
    const n = manifest.frameCount, frames: (HTMLImageElement | null)[] = Array(n).fill(null);
    let current = 0, alive = true;
    const load = (i: number) => new Promise<void>((res) => {
      const img = new window.Image(); img.decoding = "async";
      img.onload = () => { frames[i] = img; res(); };
      img.onerror = () => res(); // missing frame: nearest loaded frame is drawn instead
      img.src = src(manifest, i);
    });
    const nearest = (i: number) => { for (let d = 0; d < n; d++) { const f = frames[i - d] ?? frames[i + d]; if (f) return f; } return null; };
    const draw = (i: number) => {
      const img = nearest(i); if (!img) return;
      const s = (fit === "cover" ? Math.max : Math.min)(cv.width / img.width, cv.height / img.height);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, (cv.width - img.width * s) / 2, (cv.height - img.height * s) / 2, img.width * s, img.height * s);
    };
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, maxDpr), r = cv.getBoundingClientRect(); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); draw(current); };
    resize(); window.addEventListener("resize", resize);

    (async () => {
      await Promise.all(Array.from({ length: Math.min(initialFrames, n) }, (_, i) => load(i)));
      if (!alive) return; setShowPoster(!frames[0]); draw(0);
      for (let i = initialFrames; i < n && alive; i++) await load(i); // progressive load
    })();

    const state = { f: 0 };
    const ctxG = gsap.context(() => {
      gsap.to(state, { f: n - 1, ease: "none",
        scrollTrigger: { trigger: wrap.current, start: "top top", end: `+=${scrollDistance}`, scrub: 0.4, pin: true, onUpdate: (st) => cb.current?.(st.progress) },
        onUpdate: () => { const i = Math.round(state.f); if (i !== current) { current = i; draw(i); } } });
    }, wrap);
    return () => { alive = false; window.removeEventListener("resize", resize); ctxG.revert(); frames.fill(null); };
  }, [manifest, scrollDistance, fit, initialFrames, maxDpr]);

  return (
    <div ref={wrap} className="relative h-[100svh] w-full overflow-hidden bg-ember" role="img" aria-label={label}>
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      {showPoster && <Image src={manifest.poster} alt="" fill sizes="100vw" className="object-cover" />}
      {children}
    </div>
  );
}
