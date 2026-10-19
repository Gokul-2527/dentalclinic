import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { 
    extend: {
      colors: { 
        ember: "#3B1407", 
        cocoa: "#2A0E05", 
        cream: "#FBF1E8", 
        peach: "#F5A877", 
        clay: "#E7C3A5", 
        rust: "#B8481A", 
        copper: "#D9691F" 
      },
      fontFamily: { 
        serif: ["var(--font-serif)", "Georgia", "serif"], 
        sans: ["var(--font-sans)", "system-ui", "sans-serif"] 
      },
      transitionTimingFunction: { 
        luxe: "cubic-bezier(.22,1,.36,1)" 
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
    } 
  },
} satisfies Config;