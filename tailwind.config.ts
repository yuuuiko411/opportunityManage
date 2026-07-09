import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          50: "#eef2ff",
          100: "#c7d2fe",
          600: "#4f46e5",
          700: "#3730a3",
        },
      },
      boxShadow: {
        soft: "4px 4px 0 #111827",
        "neo-sm": "2px 2px 0 #111827",
        "neo-lg": "7px 7px 0 #111827",
      },
    },
  },
  plugins: [],
};

export default config;
