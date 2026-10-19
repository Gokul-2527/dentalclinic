"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  type AppointmentInput,
} from "@/lib/validation/appointment";
import type { Treatment } from "@/types/content";

const STEPS = [
  { t: "Send your request", d: "Tell us what you need and when suits you." },
  { t: "We confirm your slot", d: "The clinic replies by phone or email." },
  { t: "Visit us", d: "Meet your dentist and talk through your options." },
];

function Field({
  id,
  label,
  type = "text",
  reg,
  error,
  multiline = false,
}: {
  id: string;
  label: string;
  type?: string;
  reg: UseFormRegisterReturn;
  error?: string;
  multiline?: boolean;
}) {
  const base =
    "peer w-full border-0 border-b-2 bg-transparent px-0 pb-2 pt-6 text-ember placeholder-transparent transition-colors focus:outline-none focus:ring-0 " +
    (error ? "border-red-600" : "border-ember/20 focus:border-rust");

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          placeholder=" "
          className={`${base} resize-none`}
          aria-invalid={!!error}
          aria-describedby={`${id}-e`}
          {...reg}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder=" "
          className={base}
          aria-invalid={!!error}
          aria-describedby={`${id}-e`}
          {...reg}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-0 text-xs text-ember/60 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-rust"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-e`} role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default function AppointmentSection({
  treatments,
  phone,
  hours,
}: {
  treatments: Treatment[];
  phone?: string;
  hours?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>({ resolver: zodResolver(appointmentSchema) });

  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const selected = watch("treatment");

  // fade the two panels in once the section scrolls into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSubmit = async (v: AppointmentInput) => {
    setStatus("idle");
    try {
      const r = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!r.ok) throw new Error();
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const reveal = (delay: number) =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${
      visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }` + (delay ? ` [transition-delay:${delay}ms]` : "");

  return (
    <section
      id="appointment"
      ref={rootRef}
      aria-labelledby="ap-h"
      className="relative overflow-hidden bg-clay/40 px-6 py-24"
    >
      <div className="mx-auto grid max-w-6xl items-stretch lg:grid-cols-[1fr_1.25fr]">
        {/* LEFT: dark info panel */}
        <div
          className={`relative overflow-hidden rounded-t-[2.5rem] bg-ember p-10 text-cream lg:rounded-l-[2.5rem] lg:rounded-tr-none lg:p-14 lg:pr-24 ${reveal(0)}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-rust/40 blur-3xl"
          />
          <p className="relative text-xs font-medium uppercase tracking-[0.35em] text-peach">
            Appointments
          </p>
          <h2
            id="ap-h"
            className="relative mt-3 font-serif text-4xl leading-[1.05] md:text-5xl"
          >
            Book your <span className="italic text-peach">visit.</span>
          </h2>
          <p className="relative mt-5 max-w-sm text-cream/75">
            Share a few details and the clinic will get back to you to confirm a
            time that works.
          </p>

          <ol className="relative mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-peach/60 font-serif text-peach">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.t}</p>
                  <p className="text-sm text-cream/65">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          {(phone || hours) && (
            <div className="relative mt-10 border-t border-cream/15 pt-6 text-sm text-cream/75">
              {hours && <p>{hours}</p>}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-1 inline-block text-peach underline-offset-4 hover:underline"
                >
                  {phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: form card, overlaps the dark panel on desktop */}
        <div
          className={`relative rounded-b-[2.5rem] bg-white p-8 shadow-2xl sm:p-10 lg:-ml-12 lg:my-8 lg:rounded-[2.5rem] lg:p-12 ${reveal(150)}`}
        >
          {status === "ok" ? (
            <div
              className="flex min-h-[28rem] flex-col items-center justify-center text-center"
              aria-live="polite"
            >
              <svg
                viewBox="0 0 52 52"
                className="h-20 w-20 text-rust"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="26" cy="26" r="23" className="ap-draw" />
                <path d="M15 27l8 8 14-16" className="ap-draw ap-draw-delay" />
              </svg>
              <h3 className="mt-6 font-serif text-3xl text-ember">
                Request received
              </h3>
              <p className="mt-3 max-w-sm text-ember/70">
                The clinic will confirm your slot by phone or email.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 rounded-full border border-ember/25 px-6 py-3 text-sm text-ember transition hover:bg-ember hover:text-cream"
              >
                Send another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="grid gap-x-8 gap-y-6 sm:grid-cols-2"
            >
              <Field
                id="name"
                label="Full name"
                reg={register("name")}
                error={errors.name?.message}
              />
              <Field
                id="email"
                label="Email"
                type="email"
                reg={register("email")}
                error={errors.email?.message}
              />
              <Field
                id="phone"
                label="Phone"
                type="tel"
                reg={register("phone")}
                error={errors.phone?.message}
              />
              <Field
                id="date"
                label="Preferred date"
                type="date"
                reg={register("date")}
                error={errors.date?.message}
              />

              {/* treatment chips (stored in the same "treatment" field) */}
              <fieldset className="sm:col-span-2">
                <legend className="text-xs text-ember/60">
                  Treatment interest
                </legend>
                <input type="hidden" {...register("treatment")} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {treatments.map((t) => {
                    const on = selected === t.title;
                    return (
                      <button
                        key={t.slug}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setValue("treatment", on ? "" : t.title, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach ${
                          on
                            ? "border-ember bg-ember text-cream"
                            : "border-ember/20 text-ember hover:-translate-y-0.5 hover:border-ember"
                        }`}
                      >
                        {t.title}
                      </button>
                    );
                  })}
                </div>
                {errors.treatment?.message && (
                  <p role="alert" className="mt-2 text-sm text-red-700">
                    {errors.treatment.message}
                  </p>
                )}
              </fieldset>

              <div className="sm:col-span-2">
                <Field
                  id="message"
                  label="Message (optional)"
                  multiline
                  reg={register("message")}
                  error={errors.message?.message}
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 rounded-full bg-ember px-8 py-4 text-cream transition hover:bg-rust disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Request appointment"}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>

                <div aria-live="polite">
                  {status === "error" && (
                    <p className="mt-4 text-red-700">
                      We couldn’t send your request. Check your details and try
                      again, or call the clinic.
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
