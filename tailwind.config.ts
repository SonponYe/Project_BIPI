import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // BIPI brand teal, matched to the pitch deck's header/callout color.
        pulse: {
          50: "#e6f2ef",
          100: "#cce6e0",
          500: "#0f766e",
          600: "#0c5f58",
          700: "#0a4d47",
          800: "#073a35",
        },
      },
    },
  },
  plugins: [],
};

export default config;
