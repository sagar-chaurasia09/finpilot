import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Midnight Gold palette
        bg: "#0a0a0a",
        surface: "#121212",
        border: "#262626",
        muted: "#a1a1aa",
        fg: "#f9fafb",
        brand: { DEFAULT: "#d4af37", dark: "#b8941f" },   // Royal gold
        accent: { DEFAULT: "#f59e0b", dark: "#d97706" },  // Amber
        gold: {
          50: "#fdf7e3",
          100: "#f9e9a8",
          200: "#f1d678",
          300: "#e5c24a",
          400: "#d4af37",
          500: "#b8941f",
          600: "#8f7017",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Cabinet Grotesk", "Satoshi", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(212, 175, 55, 0.28)",
        "glow-accent": "0 0 24px rgba(245, 158, 11, 0.28)",
        "glow-lg": "0 0 60px -10px rgba(212, 175, 55, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
