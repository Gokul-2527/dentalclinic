import Link from "next/link";
import type { ReactNode } from "react";
export default function Button({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "glass" }) {
  const base = "inline-flex items-center rounded-full px-7 py-3.5 text-sm font-medium transition duration-500 ease-luxe focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-peach";
  const v = variant === "solid" ? "bg-peach text-ember hover:bg-cream" : "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20";
  return <Link href={href} className={`${base} ${v}`}>{children}</Link>;
}
