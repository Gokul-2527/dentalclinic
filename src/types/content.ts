export interface Treatment { slug: string; title: string; summary: string; body: string; image: string; imageAlt: string }
export interface Doctor { slug: string; name: string; qualifications: string; specialization: string; image: string }
export interface Testimonial { id: string; author: string; quote: string }
export interface Faq { id: string; question: string; answer: string }
export interface SequenceManifest { framePath: string; frameCount: number; width: number; height: number; poster: string }
export interface ClinicSettings {
  name: string; phone: string; email: string; address: string; hours: string; city: string;
  hero: { headline: string; description: string; image: string; imageAlt: string };
  story: { steps: { title: string; text: string }[]; sequence: SequenceManifest };
}
export interface SiteContent { settings: ClinicSettings; treatments: Treatment[]; doctors: Doctor[]; testimonials: Testimonial[]; faqs: Faq[] }
