import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#121417",
          900: "#1b1f24",
          800: "#252b32",
          700: "#3a424c",
          500: "#69737f"
        },
        pulse: {
          500: "#0f9f8f",
          600: "#0b8278",
          700: "#096a62"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(18, 20, 23, 0.08)"
      }
    }
  },
  plugins: [forms]
};

export default config;
