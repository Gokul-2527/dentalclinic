export default function ScrollIndicator({
  href = "#about",
  label = "Scroll",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <a
      href={href}
      aria-label={`${label} down to the next section`}
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/90 transition-colors hover:text-white"
    >
      <span className="text-xs font-medium uppercase tracking-[0.35em]">
        {label}
      </span>

      <span
        className="flex flex-col items-center -space-y-2"
        aria-hidden="true"
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="h-6 w-6 animate-scroll-arrow"
            style={{ animationDelay: `${i * 0.2}s` }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        ))}
      </span>
    </a>
  );
}
