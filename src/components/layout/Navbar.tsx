"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { label: "Services", href: "/#treatments", id: "treatments" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Technology", href: "/#story", id: "story" },
  { label: "Testimonials", href: "/#testimonials", id: "testimonials" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const;

export default function Navbar({ name }: { name: string }) {
  const pathname = usePathname();
  const isInnerPage = pathname !== "/";

  const [scrolled, setScrolled] = useState(isInnerPage);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [pill, setPill] = useState({ left: 0, width: 0, show: false });

  const barRef = useRef<HTMLSpanElement>(null);
  const lastY = useRef(0);
  const openRef = useRef(open);
  openRef.current = open;

  // scroll: solid state, hide/show, progress line, "top of page" reset
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // On homepage, toggle based on scroll. On inner pages, always stay scrolled (solid style).
      setScrolled(isInnerPage || y > 40);
      setHidden(y > lastY.current && y > 240 && !openRef.current);
      lastY.current = y;

      if (y < 200 && !isInnerPage) setActive("");

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, y / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isInnerPage]);

  // scroll-spy: highlight the section in the middle of the screen (only relevant on home)
  useEffect(() => {
    if (isInnerPage) return;
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [isInnerPage]);

  // mobile menu: lock body scroll, close on Escape or when resized to desktop
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  // sliding hover highlight
  const movePill = (el: HTMLElement) =>
    setPill({ left: el.offsetLeft, width: el.offsetWidth, show: true });

  return (
    <>
      <header
        onFocusCapture={() => setHidden(false)}
        className={`fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-500 ease-out motion-reduce:transition-none ${
          hidden ? "-translate-y-[150%]" : "translate-y-0"
        }`}
      >
        <nav
          aria-label="Main"
          className={`relative flex w-full items-center justify-between rounded-full border px-5 py-3 text-cream transition-all duration-500 ease-out motion-reduce:transition-none ${
            scrolled
              ? "max-w-5xl border-cream/15 bg-ember/75 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              : "max-w-7xl border-transparent bg-transparent"
          }`}
        >
          {/* logo */}
          <Link
            href="/"
            aria-label={`${name} home`}
            className="group flex items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt={name}
              width={240}
              height={100}
              priority
              className="h-14 w-auto brightness-0 invert transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none"
            />
          </Link>

          {/* desktop links with a sliding highlight */}
          <ul
            className="relative hidden items-center md:flex"
            onMouseLeave={() => setPill((p) => ({ ...p, show: false }))}
          >
            <span
              aria-hidden="true"
              className="absolute top-0 h-full rounded-full bg-cream/12 transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.show ? 1 : 0,
              }}
            />
            {LINKS.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.id}>
                  <a
                    href={l.href}
                    aria-current={isActive ? "true" : undefined}
                    onMouseEnter={(e) => movePill(e.currentTarget)}
                    onFocus={(e) => movePill(e.currentTarget)}
                    className={`relative z-10 block rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach ${
                      isActive ? "text-peach" : "text-cream/85 hover:text-cream"
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-peach transition-transform duration-300 ${
                        isActive ? "scale-100" : "scale-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* desktop CTA */}
          <a
            href="/#appointment"
            className="group relative hidden items-center gap-2 overflow-hidden rounded-full border border-cream/60 px-5 py-2 text-sm transition-colors duration-300 hover:text-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach md:inline-flex"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-cream transition-transform duration-300 ease-out group-hover:scale-y-100 motion-reduce:transition-none"
            />
            <span className="relative">Book an appointment</span>
            <span
              aria-hidden="true"
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>

          {/* mobile burger */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 md:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-cream transition-all duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-5 rounded bg-cream transition-all duration-300 ${
                  open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          {/* scroll progress line */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-8 -bottom-px h-0.5 overflow-hidden rounded-full transition-opacity duration-500 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              ref={barRef}
              className="block h-full origin-left bg-peach"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
        </nav>
      </header>

      {/* mobile full-screen menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ember px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          clipPath: open
            ? "circle(150% at calc(100% - 2.25rem) 2.25rem)"
            : "circle(0% at calc(100% - 2.25rem) 2.25rem)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-rust/40 blur-3xl"
        />

        <ul className="relative space-y-2">
          {LINKS.map((l, i) => (
            <li
              key={l.id}
              className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${250 + i * 70}ms` : "0ms" }}
            >
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-2 font-serif text-4xl text-cream transition-colors hover:text-peach"
              >
                <span className="text-sm text-peach/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/#appointment"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`relative mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-peach px-7 py-4 text-ember transition-all duration-500 ease-out motion-reduce:transition-none ${
            open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{
            transitionDelay: open ? `${250 + LINKS.length * 70}ms` : "0ms",
          }}
        >
          Book an appointment <span aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}
