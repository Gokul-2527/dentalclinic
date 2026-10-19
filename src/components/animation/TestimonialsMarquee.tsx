type Testimonial = { id: string; quote: string; author: string };

const initials = (author: string) =>
  author
    .split("·", 1)
    .join("")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Card({ t, tilt }: { t: Testimonial; tilt: string }) {
  return (
    <figure
      className={`relative w-[20rem] shrink-0 rounded-3xl border border-ember/10 bg-white p-7 shadow-xl transition duration-300 hover:-translate-y-2 hover:rotate-0 hover:shadow-2xl md:w-[24rem] ${tilt}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-5 left-6 flex h-11 w-11 items-center justify-center rounded-full bg-ember font-serif text-4xl leading-none text-peach"
      >
        <span className="translate-y-[3px]">“</span>
      </span>

      <blockquote className="mt-4 text-[15px] leading-relaxed text-cocoa">
        {t.quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach/40 text-sm font-semibold text-ember">
          {initials(t.author)}
        </span>
        <span className="text-sm text-ember/80">{t.author}</span>
      </figcaption>
    </figure>
  );
}

function Row({
  items,
  reverse = false,
  duration = 45,
}: {
  items: Testimonial[];
  reverse?: boolean;
  duration?: number;
}) {
  const group = (hidden = false) => (
    <div className="flex shrink-0 gap-6 pr-6" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <Card
          key={`${t.id}-${i}`}
          t={t}
          tilt={i % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]"}
        />
      ))}
    </div>
  );

  return (
    <div className="flex overflow-hidden py-8">
      <div
        className={`testimonial-track flex w-max ${
          reverse ? "testimonial-right" : "testimonial-left"
        }`}
        style={{ ["--t-duration" as string]: `${duration}s` }}
      >
        {group()}
        {group(true)}
      </div>
    </div>
  );
}

export default function TestimonialsMarquee({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const reversed = [...testimonials].reverse();

  return (
    <div
      className="-mx-6"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <Row items={testimonials} duration={50} />
      <Row items={reversed} reverse duration={60} />
    </div>
  );
}
