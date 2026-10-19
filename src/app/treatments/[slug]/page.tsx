import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

type P = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getSiteContent()).treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const resolvedParams = await params;
  const content = await getSiteContent();
  const t = content.treatments.find((x) => x.slug === resolvedParams.slug);

  return t
    ? buildMetadata({
        title: t.title,
        description: t.summary,
        path: `/treatments/${t.slug}`,
      })
    : {};
}

export default async function TreatmentPage({ params }: P) {
  const resolvedParams = await params;
  const c = await getSiteContent();
  const slug = resolvedParams.slug;

  const t = c.treatments.find((x) => x.slug === slug);
  if (!t) notFound();

  const related = c.treatments.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <h1 className="font-serif text-5xl text-ember">{t.title}</h1>
      <p className="mt-6 text-lg text-cocoa/80">{t.body}</p>
      <Link
        href="/#appointment"
        className="mt-8 inline-block rounded-full bg-ember px-7 py-3.5 text-cream"
      >
        Book an appointment
      </Link>
      <h2 className="mt-16 font-serif text-2xl">Related treatments</h2>
      <ul className="mt-4 space-y-2">
        {related.map((r) => (
          <li key={r.slug}>
            <Link
              className="underline decoration-peach"
              href={`/treatments/${r.slug}`}
            >
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
