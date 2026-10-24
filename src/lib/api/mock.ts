import type { SiteContent } from "@/types/content";
const t = (slug: string, title: string, summary: string) => ({
  slug, title, summary, body: `${summary} Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.`,
  image: "/images/placeholder.svg", imageAlt: `${title} consultation`,
});
// PLACEHOLDER CONTENT: replace via the admin API. Never publish unverified credentials or reviews.
export const mockContent: SiteContent = {
  settings: {
    name: "Aurelia Dental", phone: "+91 00000 00000", email: "hello@example.com",
    address: "Add verified clinic address", hours: "Mon–Sat 9:00–18:00", city: "Your city",
    hero: { headline: "Modern care for a perfect smile", description: "Considered, comfortable dental care with a plan built around you.", image: "/images/bg_img2.png", imageAlt: "Illustration of a tooth with a peach smile curve" },
   
story: {
  steps: [
    {
      title: "Feel at ease.",
      text: "Your visit begins with a warm welcome and time to talk. We listen to your concerns, understand your needs, and help you feel comfortable from the very first moment.",
    },
    {
      title: "Know your smile.",
      text: "Every smile is different. With a careful examination and clear explanations, we help you understand your dental health, explore your options, and make informed decisions.",
    },
    {
      title: "Care with precision.",
      text: "Thoughtful techniques and a gentle approach guide every step of your treatment. We focus on accuracy, comfort, and attention to detail, keeping you informed throughout.",
    },
    {
      title: "Leave with confidence.",
      text: "Your care continues beyond the treatment chair. We guide you through recovery, share practical advice, and help you maintain a healthy smile with a personalised care plan.",
    },
  ],

  sequence: {
    framePath: "/images/sequence/frame-{index}.webp",
    frameCount: 101,
    width: 1280,
    height: 720,
    poster: "/images/placeholder.svg",
  },
},

  },
treatments: [
    {
      slug: "teeth-whitening",
      title: "Teeth whitening",
      summary: "Professional whitening to lift stains safely.",
      body: "Professional whitening to lift stains safely. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_1.jpg",
      imageAlt: "Teeth whitening treatment",
    },
    {
      slug: "dental-implants",
      title: "Dental implants",
      summary: "Fixed replacements for missing teeth.",
      body: "Fixed replacements for missing teeth. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_2.jpg",
      imageAlt: "Dental implants treatment",
    },
    {
      slug: "clear-aligners",
      title: "Clear aligners",
      summary: "Discreet straightening with removable trays.",
      body: "Discreet straightening with removable trays. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_3.webp",
      imageAlt: "Clear aligners treatment",
    },
    {
      slug: "cosmetic-dentistry",
      title: "Cosmetic dentistry",
      summary: "Refined shape, colour and balance.",
      body: "Refined shape, colour and balance. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_4.jpg",
      imageAlt: "Cosmetic dentistry treatment",
    },
    {
      slug: "preventive-care",
      title: "Preventive dental care",
      summary: "Check-ups and cleanings that prevent problems.",
      body: "Check-ups and cleanings that prevent problems. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_5.jpg",
      imageAlt: "Preventive dental care treatment",
    },
    {
      slug: "smile-makeovers",
      title: "Smile makeovers",
      summary: "A combined plan for a complete change.",
      body: "A combined plan for a complete change. Your dentist explains every option, the process and the costs before treatment begins. Results vary between patients.",
      image: "/images/treatment/Treatment_6.jpeg",
      imageAlt: "Smile makeovers treatment",
    },
  ],
doctors: [
  { slug: "dr-ananya-krishnan", name: "Dr. Ananya Krishnan", qualifications: "BDS, MDS (Prosthodontics)", specialization: "Implantology", image: "/images/Doctors/doctor1.jpg" },
  { slug: "dr-meera-subramanian", name: "Dr. Meera Subramanian", qualifications: "BDS, MDS (Orthodontics)", specialization: "Orthodontics & aligners", image: "/images/Doctors/doctor5.jpg" },
  { slug: "dr-kavya-raghavan", name: "Dr. Kavya Raghavan", qualifications: "BDS, MDS (Conservative Dentistry & Endodontics)", specialization: "Cosmetic dentistry", image: "/images/Doctors/doctor3.jpg" },
  { slug: "dr-priya-venkatesh", name: "Dr. Priya Venkatesh", qualifications: "BDS, MDS (Periodontology)", specialization: "Gum care & preventive dentistry", image: "/images/Doctors/doctor4.webp" },
  { slug: "dr-arjun-natarajan", name: "Dr. Arjun Natarajan", qualifications: "BDS", specialization: "General dentistry", image: "/images/Doctors/doctor2.jpg" },
],testimonials: [
  { id: "t1", quote: "I used to dread dental visits. Here, everything was explained before it happened and I never felt rushed.", author: "Placeholder Name · Teeth whitening" },
  { id: "t2", quote: "The team listened first and gave me clear options. The whole process felt calm and well planned.", author: "Placeholder Name · Dental implants" },
  { id: "t3", quote: "My aligners were explained step by step, and the follow-ups were easy to book.", author: "Placeholder Name · Clear aligners" },
  { id: "t4", quote: "Gentle, careful and on time. My check-up was the most comfortable one I've had.", author: "Placeholder Name · Preventive care" },
  { id: "t5", quote: "They took the time to understand what I wanted from my smile, and the result looks natural.", author: "Placeholder Name · Cosmetic dentistry" },
  { id: "t6", quote: "Clear costs up front, no surprises, and a plan that fit my schedule.", author: "Placeholder Name · Smile makeover" },
],
faqs: [
  { id: "1", question: "Is the first visit painful?", answer: "Your dentist examines and discusses options first. Anything uncomfortable is explained before it happens." },
  { id: "2", question: "How do I book?", answer: "Use the appointment form. The clinic confirms your slot by phone or email." },
  { id: "3", question: "What should I bring to my first appointment?", answer: "Bring any previous dental records or X-rays you have, a list of medicines you take, and any questions you'd like to ask." },
  { id: "4", question: "How long does a check-up take?", answer: "A routine check-up and cleaning usually takes under an hour. Your dentist will tell you if you need more time." },
  { id: "5", question: "Will you explain the cost before treatment?", answer: "Yes. Your dentist explains the options, the process and the estimated costs before any treatment begins." },
  { id: "6", question: "Do you treat children and families?", answer: "Please contact the clinic to confirm which age groups and services are available." },
  { id: "7", question: "What if I need to reschedule?", answer: "Call or email the clinic as early as you can and the team will help you find a new slot." },
  { id: "8", question: "How often should I get a check-up?", answer: "Many people visit every six months, but your dentist will recommend a schedule that suits your needs." },
],
};
