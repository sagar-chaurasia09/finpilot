import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0f",
        surface: "#111218",
        border: "#1e2029",
        muted: "#6b7280",
        fg: "#e5e7eb",
        brand: { DEFAULT: "#00d4aa", dark: "#00b894" },
        accent: { DEFAULT: "#8b5cf6", dark: "#7c3aed" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Cabinet Grotesk", "Satoshi", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 212, 170, 0.25)",
        "glow-accent": "0 0 24px rgba(139, 92, 246, 0.25)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
