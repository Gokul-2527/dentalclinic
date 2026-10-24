import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

type P = { params: Promise<{ slug: string }> };

type TreatmentInfo = {
  duration: string;
  recovery: string;
  benefits: string[];
  steps: { title: string; desc: string }[];
};

const TREATMENT_DETAILS: Record<string, TreatmentInfo> = {
  "teeth-whitening": {
    duration: "45–60 minutes",
    recovery: "Usually minimal",
    benefits: [
      "Helps lift stains caused by coffee, tea, and aging",
      "May visibly brighten teeth following treatment",
      "Professional application with appropriate gum protection",
      "A brighter smile tailored to your dental needs",
    ],
    steps: [
      {
        title: "Consultation & Shade Check",
        desc: "Your dentist evaluates your oral health and records your starting tooth shade.",
      },
      {
        title: "Gum Protection",
        desc: "Protective measures help safeguard your gums during the whitening procedure.",
      },
      {
        title: "Whitening Treatment",
        desc: "Professional whitening products are applied according to your treatment plan.",
      },
      {
        title: "Results & Aftercare",
        desc: "Your dentist reviews the outcome and explains how to maintain your smile.",
      },
    ],
  },
  "dental-implants": {
    duration: "1–3 hours per surgical phase",
    recovery:
      "Initial recovery often takes several days; integration takes months",
    benefits: [
      "A fixed replacement option for missing teeth",
      "Helps maintain jawbone function when clinically appropriate",
      "May avoid modifying neighbouring healthy teeth",
      "Can restore chewing function and confidence",
    ],
    steps: [
      {
        title: "Comprehensive Evaluation",
        desc: "Clinical examination and appropriate imaging help determine implant suitability.",
      },
      {
        title: "Implant Placement",
        desc: "The implant is placed into the jawbone by a qualified dental professional.",
      },
      {
        title: "Healing & Integration",
        desc: "The implant heals and integrates with the bone over a period of months.",
      },
      {
        title: "Custom Crown",
        desc: "A custom restoration is fitted when healing and clinical conditions permit.",
      },
    ],
  },
  "clear-aligners": {
    duration: "Treatment often spans several months",
    recovery: "Brief adjustment periods may occur with new trays",
    benefits: [
      "Clear trays offer a discreet orthodontic option",
      "Removable for eating and daily oral hygiene",
      "Treatment is planned around your individual teeth",
      "No traditional brackets or wires",
    ],
    steps: [
      {
        title: "Digital Assessment",
        desc: "Your dentist evaluates alignment and takes the required records or digital scans.",
      },
      {
        title: "Personalised Plan",
        desc: "A proposed tooth-movement plan is developed for your clinical needs.",
      },
      {
        title: "Progressive Alignment",
        desc: "You wear prescribed aligners and attend follow-up appointments.",
      },
      {
        title: "Retention",
        desc: "Retainers help maintain the result after active treatment.",
      },
    ],
  },
  "cosmetic-dentistry": {
    duration: "Varies by procedure and number of visits",
    recovery: "Depends on the selected procedure",
    benefits: [
      "Addresses selected chips, gaps, and uneven tooth shapes",
      "Colour and shape can be planned to suit your smile",
      "Options may include bonding or veneers",
      "A personalised approach to smile aesthetics",
    ],
    steps: [
      {
        title: "Smile Consultation",
        desc: "Discuss your goals and assess the condition of your teeth and gums.",
      },
      {
        title: "Treatment Planning",
        desc: "Your dentist explains suitable options, limitations, and alternatives.",
      },
      {
        title: "Restoration & Fitting",
        desc: "The selected cosmetic procedure is performed according to the agreed plan.",
      },
      {
        title: "Final Review",
        desc: "Your dentist checks the result and provides relevant aftercare guidance.",
      },
    ],
  },
  "preventive-care": {
    duration: "30–45 minutes",
    recovery: "Usually none",
    benefits: [
      "Helps manage plaque and tartar buildup",
      "Supports early identification of dental concerns",
      "Helps maintain clean teeth and healthy gums",
      "Supports long-term oral hygiene and preventive care",
    ],
    steps: [
      {
        title: "Dental Examination",
        desc: "Your dentist examines your teeth and gums and recommends imaging if necessary.",
      },
      {
        title: "Professional Cleaning",
        desc: "Plaque and tartar are removed using appropriate cleaning techniques.",
      },
      {
        title: "Polishing",
        desc: "Polishing may be performed where appropriate as part of your cleaning.",
      },
      {
        title: "Personalised Guidance",
        desc: "Receive recommendations for daily care and future dental check-ups.",
      },
    ],
  },
  "smile-makeovers": {
    duration: "A personalised multi-stage timeline",
    recovery: "Depends on the treatments involved",
    benefits: [
      "Brings multiple suitable treatments into one coordinated plan",
      "Considers oral health, function, and appearance",
      "Appointments can be planned around treatment stages",
      "A tailored approach to your smile goals",
    ],
    steps: [
      {
        title: "Smile Consultation",
        desc: "Discuss your expectations, dental history, and desired outcome.",
      },
      {
        title: "Treatment Blueprint",
        desc: "Your dentist outlines suitable procedures and the proposed sequence.",
      },
      {
        title: "Treatment Stages",
        desc: "The agreed procedures are carried out in a clinically appropriate order.",
      },
      {
        title: "Final Review",
        desc: "Your dentist reviews the outcome and explains ongoing maintenance.",
      },
    ],
  },
};

const DEFAULT_INFO: TreatmentInfo = {
  duration: "Confirmed during consultation",
  recovery: "Depends on the treatment",
  benefits: [
    "Care tailored to your individual dental needs",
    "Clear explanations of available treatment options",
    "A personalised approach to comfort and oral health",
  ],
  steps: [
    {
      title: "Initial Consultation",
      desc: "Discuss your concerns, dental history, and treatment goals.",
    },
    {
      title: "Personalised Treatment",
      desc: "Your dentist explains the recommended procedure and alternatives.",
    },
    {
      title: "Aftercare & Review",
      desc: "Receive guidance on recovery, maintenance, and follow-up care.",
    },
  ],
};

export async function generateStaticParams() {
  return (await getSiteContent()).treatments.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const treatment = content.treatments.find((item) => item.slug === slug);

  return treatment
    ? buildMetadata({
        title: treatment.title,
        description: treatment.summary,
        path: `/treatments/${treatment.slug}`,
      })
    : {};
}

export default async function TreatmentPage({ params }: P) {
  const { slug } = await params;
  const content = await getSiteContent();

  const treatment = content.treatments.find((item) => item.slug === slug);

  if (!treatment) notFound();

  const info = TREATMENT_DETAILS[slug] ?? DEFAULT_INFO;

  const related = content.treatments
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-white text-gray-900">
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36 lg:px-12">
        {/* Breadcrumb / Back */}
        <div className="mb-10 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/"
            className="text-gray-500 transition-colors hover:text-orange-600"
          >
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href="/#treatments"
            className="text-gray-500 transition-colors hover:text-orange-600"
          >
            Treatments
          </Link>
          <span className="text-gray-300">/</span>
          <span className="max-w-[180px] truncate font-medium text-orange-600">
            {treatment.title}
          </span>
        </div>

        {/* Hero */}
        <section className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <div className="relative rounded-[2rem] border border-gray-100 bg-gradient-to-br from-orange-50/70 via-white to-gray-50/80 p-6 shadow-xl shadow-orange-950/5 sm:p-9 lg:p-11">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-100/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-800 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Personalised Dental Care
              </span>

              <h1 className="mt-7 max-w-2xl font-serif text-4xl leading-[1.12] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                {treatment.title}
                <span className="mt-2 block font-normal italic text-orange-700">
                  Designed around your smile.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
                {treatment.body || treatment.summary}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/#appointment"
                  className="group inline-flex items-center gap-3 rounded-full bg-orange-600 px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700"
                >
                  Book a consultation
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/#treatments"
                  className="rounded-full border border-gray-200 px-6 py-4 text-sm text-gray-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                >
                  Explore treatments
                </Link>
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-orange-200 via-gray-200 to-transparent" />

              {/* Quick Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors hover:border-orange-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Estimated duration
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-gray-900 sm:text-base">
                    {info.duration}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors hover:border-orange-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Recovery
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-medium leading-6 text-gray-900 sm:text-base">
                    {info.recovery}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-6 text-gray-500">
                Treatment duration and recovery vary by patient. Your dentist
                will confirm the appropriate plan during consultation.
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="group relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-orange-200/50 via-orange-100/30 to-transparent opacity-80 blur-2xl transition duration-700 group-hover:opacity-100" />

            <div className="relative h-[390px] overflow-hidden rounded-[2rem] border border-gray-200 bg-orange-50 shadow-2xl sm:h-[500px] lg:h-[620px]">
              <Image
                src={treatment.image}
                alt={treatment.imageAlt || treatment.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/20 via-transparent to-white/10" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/90 p-5 backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8 sm:p-6 shadow-lg">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-600">
                  Thoughtful care. Clear guidance.
                </span>
                <p className="mt-2 font-serif text-xl text-gray-950 sm:text-2xl">
                  Your comfort comes first.
                </p>
                <p className="mt-2 text-xs leading-6 text-gray-600 sm:text-sm">
                  Understand your options and make informed decisions with
                  guidance from your dental professional.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mt-28 sm:mt-36">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-600 sm:text-xs">
                The difference in care
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
                The benefits of a
                <span className="italic text-orange-600">
                  {" "}
                  thoughtful approach.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-600">
              Every treatment starts with understanding your needs, discussing
              suitable options, and planning care around your oral health.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {info.benefits.map((benefit, idx) => (
              <div
                key={benefit}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-orange-50/60 to-white p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7"
              >
                <div className="relative flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-100/70 text-orange-600">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="font-serif text-2xl text-orange-200">
                    0{idx + 1}
                  </span>
                </div>

                <p className="relative mt-7 text-sm leading-7 text-gray-700">
                  {benefit}
                </p>

                <div className="mt-6 h-px w-10 bg-orange-200 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Procedure Timeline */}
        <section className="relative mt-28 sm:mt-36">
          <div className="max-w-2xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-600 sm:text-xs">
              A clear path forward
            </span>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Your journey to better
              <span className="italic text-orange-600"> dental care.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600">
              Know what to expect at every stage, from your first consultation
              to the guidance you receive after treatment.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {info.steps.map((step, idx) => (
              <div
                key={`${step.title}-${idx}`}
                className="group relative rounded-3xl border border-gray-100 bg-gradient-to-b from-orange-50/40 to-white p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl text-orange-400">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-sm text-orange-600 transition-all duration-300 group-hover:bg-orange-600 group-hover:text-white">
                    →
                  </span>
                </div>

                <div className="my-6 h-px bg-gradient-to-r from-orange-200 via-gray-200 to-transparent" />

                <h3 className="font-serif text-xl leading-snug text-gray-950 transition-colors group-hover:text-orange-600">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600">
                  {step.desc}
                </p>

                <span className="absolute bottom-0 left-6 right-6 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-orange-500 to-transparent transition-transform duration-500 group-hover:scale-x-100 sm:left-7 sm:right-7" />
              </div>
            ))}
          </div>
        </section>

        {/* Consultation CTA */}
        <section className="relative mt-28 overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800 p-7 shadow-xl sm:mt-36 sm:p-12 lg:p-16 text-white">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-16 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-200 sm:text-xs">
                Start with a conversation
              </span>
              <h2 className="mt-4 font-serif text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                Ready to take the next step?
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-orange-100">
                Book a consultation to discuss {treatment.title.toLowerCase()},
                understand your options, and find the right plan for your smile.
              </p>
            </div>

            <Link
              href="/#appointment"
              className="inline-flex shrink-0 items-center justify-center gap-3 self-start rounded-full bg-white px-7 py-4 text-sm font-semibold text-gray-950 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-50 hover:shadow-lg md:self-center"
            >
              Book a consultation
              <span>↗</span>
            </Link>
          </div>
        </section>

        {/* Related Treatments */}
        {related.length > 0 && (
          <section className="mt-28 border-t border-gray-100 pt-14 sm:mt-36 sm:pt-16">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-600 sm:text-xs">
                  Continue exploring
                </span>
                <h2 className="mt-3 font-serif text-3xl text-gray-950 sm:text-4xl">
                  More ways to care for your smile.
                </h2>
              </div>

              <Link
                href="/#treatments"
                className="inline-flex items-center gap-2 text-sm text-orange-600 transition-colors hover:text-orange-700 font-medium"
              >
                All treatments <span>→</span>
              </Link>
            </div>

            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, idx) => (
                <Link
                  key={item.slug}
                  href={`/treatments/${item.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-orange-50/50 to-white p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-600/70">
                      Treatment 0{idx + 1}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-all duration-300 group-hover:border-orange-300 group-hover:bg-orange-600 group-hover:text-white">
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-7 font-serif text-2xl text-gray-950 transition-colors group-hover:text-orange-600">
                    {item.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-gray-600">
                    {item.summary}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-xs font-semibold text-orange-600">
                    Discover treatment
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-16 border-t border-gray-100 pt-6 text-center">
          <p className="text-xs leading-6 text-gray-400">
            Treatment suitability, expected outcomes, duration, and recovery
            vary between individuals. Consult your dentist for personalised
            advice.
          </p>
        </footer>
      </article>
    </main>
  );
}
