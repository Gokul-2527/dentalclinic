import Image from "next/image";
import { getSiteContent } from "@/lib/api/client";
import { buildMetadata } from "@/lib/seo/metadata";
import Button from "@/components/ui/Button";
import HeroReveal from "@/components/animation/HeroReveal";
import StorySection from "@/components/sections/StorySection";
import TreatmentsSection from "@/components/sections/TreatmentsSection";
import FaqSection from "@/components/sections/FaqSection";
import AppointmentSection from "@/components/sections/AppointmentSection";
import CurvedMarquee from "@/components/animation/TiltedWordReveal";
import AboutGallery from "@/components/animation/AboutGallery";
import ScrollIndicator from "@/components/animation/ScrollIndicator";
import TestimonialsMarquee from "@/components/animation/TestimonialsMarquee";
import DoctorsSection from "@/components/sections/DoctorsSection";
import { AboutPillars, AboutStats } from "@/components/sections/AboutExtras";
import Navbar from "@/components/layout/Navbar";

export const revalidate = 300;
export const metadata = buildMetadata({
  title: "Premium dental care",
  description:
    "Comfortable, personalised dental care: whitening, implants, aligners and cosmetic dentistry.",
});

export default async function Home() {
  const {
    settings: s,
    treatments,
    testimonials,
    doctors,
    faqs,
  } = await getSiteContent();

  return (
    <>
      {/* Render Navbar here and pass name prop */}
      <Navbar name={s.name || "Clinic"} />

      <div className="">
        {/* Shared background image */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-rust">
          <Image
            src="/images/bg_img2.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ember/70 via-ember/20 to-transparent" />
        </div>

        {/* HERO SECTION */}
        <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-transparent px-6">
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 pt-24 md:grid-cols-2">
            <HeroReveal className="text-cream">
              <h1
                data-hero
                className="max-w-3xl font-sans text-[clamp(2.8rem,6vw,5.5rem)] font-light leading-[1] tracking-tight"
              >
                {(() => {
                  const w = s.hero.headline.replace(/\.$/, "").split(" ");
                  return (
                    <>
                      <span className="text-peach">
                        {w.slice(0, -2).join(" ")}{" "}
                      </span>
                      <span className="text-white">
                        {w.slice(-2).join(" ")}
                      </span>
                    </>
                  );
                })()}
              </h1>

              <p data-hero className="mt-6 max-w-lg text-lg text-cream/85">
                {s.hero.description}
              </p>

              <div data-hero className="mt-8 flex flex-wrap gap-4">
                <Button href="#appointment">Book an appointment</Button>
                <Button href="#treatments" variant="glass">
                  Explore our treatments
                </Button>
              </div>
            </HeroReveal>

            <div className="relative flex items-center justify-center">
              <div className="relative h-72 w-72 animate-float md:h-[650px] md:w-[650px]">
                <Image
                  src="/images/Teeth2.png"
                  alt="Floating teeth illustration"
                  fill
                  priority
                  sizes="(max-width: 768px) 288px, 650px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          <ScrollIndicator href="#about" />
        </section>

        {/* ABOUT SECTION */}
        <section
          id="about"
          className="mx-auto flex w-full max-w-7xl flex-col items-center gap-20 px-6 pb-28 pt-10 scroll-mt-24"
        >
          <CurvedMarquee
            text="Dentistry that listens first."
            tilt={-8}
            curve={220}
            speed={160}
          />
          <p className="max-w-xl text-center text-lg text-cream/80">
            Every plan starts with your goals, your comfort and a clear
            explanation of the options.
          </p>

          <AboutStats
            stats={[
              { value: 10, suffix: "+", label: "Years of care" },
              { value: doctors.length, label: "Dentists" },
              { value: treatments.length, label: "Treatments" },
              { value: 5000, suffix: "+", label: "Smiles cared for" },
            ]}
          />

          <AboutGallery />
          <AboutPillars />
        </section>
      </div>

      <div id="story" className="scroll-mt-24">
        <StorySection story={s.story} />
      </div>

      <div id="treatments" className="scroll-mt-24">
        <TreatmentsSection treatments={treatments} />
      </div>

      <section
        id="testimonials"
        className="overflow-hidden px-6 py-24 bg-white scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-ember/60">
            Kind words
          </p>
          <h2 className="mt-3 font-serif text-4xl text-ember md:text-5xl">
            Patient stories
          </h2>

          {testimonials.length ? (
            <div className="mt-10">
              <TestimonialsMarquee testimonials={testimonials} />
            </div>
          ) : (
            <p className="mt-6 text-cocoa/70">
              Approved patient testimonials will appear here.
            </p>
          )}
        </div>
      </section>

      <div id="doctors" className="scroll-mt-24">
        <DoctorsSection doctors={doctors} />
      </div>

      <div id="appointment" className="scroll-mt-24">
        <AppointmentSection
          treatments={treatments}
          phone={s.phone}
          hours={s.hours}
        />
      </div>

      <div id="contact" className="scroll-mt-24">
        <FaqSection faqs={faqs} phone={s.phone} />
      </div>
    </>
  );
}
