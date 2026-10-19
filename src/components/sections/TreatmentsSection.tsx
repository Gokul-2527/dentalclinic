import type { Treatment } from "@/types/content";
import HorizontalCards from "@/components/animation/HorizontalCards";

export default function TreatmentsSection({
  treatments,
}: {
  treatments: Treatment[];
}) {
  if (treatments.length === 0) {
    return (
      <section
        id="treatments"
        className="bg-cream px-6 py-28 "
        aria-labelledby="tr-h"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="tr-h" className="font-suranna text-5xl text-ember">
            Care for every stage of your smile
          </h2>

          <p className="mt-10 text-ember/70">
            Treatments will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  return <HorizontalCards treatments={treatments} />;
}
