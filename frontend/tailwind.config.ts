import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--foreground) / <alpha-value>)",
          950: "#121417",
          900: "#1b1f24",
          800: "#252b32",
          700: "#3a424c",
          500: "#69737f"
        },
        pulse: {
          500: "#0f9f8f",
          600: "#0b8278",
          700: "#096a62",
          DEFAULT: "#0f9f8f"
        },
        canvas: {
          DEFAULT: "hsl(var(--background) / <alpha-value>)",
          soft: "hsl(var(--card) / <alpha-value>)",
          "soft-2": "hsl(var(--muted) / <alpha-value>)"
        },
        hairline: {
          DEFAULT: "hsl(var(--border) / <alpha-value>)",
          strong: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        body: "hsl(var(--foreground) / <alpha-value>)",
        mute: "hsl(var(--muted-foreground) / <alpha-value>)",
        success: "#0070f3",
        warning: {
          DEFAULT: "#f5a623",
          soft: "#ffefcf",
          deep: "#ab570a"
        },
        error: {
          DEFAULT: "#ee0000",
          soft: "#f7d4d6",
          deep: "#c50000"
        },
        violet: {
          DEFAULT: "#7928ca",
          soft: "#d8ccf1",
          deep: "#4c2889"
        },
        cyan: {
          DEFAULT: "#50e3c2",
          soft: "#aaffec",
          deep: "#29bc9b"
        }
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
        xs: "4px",
        xl: "16px",
        pill: "100px",
        "pill-sm": "64px"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Geist Mono", "monospace"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(18, 20, 23, 0.08)",
        level1: "0 0 0 1px rgba(0,0,0,0.08)",
        level2: "0px 1px 1px rgba(0,0,0,0.02), 0px 2px 2px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.08)",
        level3: "0px 2px 2px rgba(0,0,0,0.04), 0px 8px 8px -8px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.08)",
        level4: "0px 2px 2px rgba(0,0,0,0.04), 0px 8px 16px -4px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(0,0,0,0.08)",
        level5: "0px 1px 1px rgba(0,0,0,0.02), 0px 8px 16px -4px rgba(0,0,0,0.04), 0px 24px 32px -8px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.08)",
      },
      letterSpacing: {
        "display-xl": "-2.4px",
        "display-lg": "-1.28px",
        "display-md": "-0.96px",
        "display-sm": "-0.6px",
        "body-sm": "-0.28px"
      }
    }
  },
  plugins: [forms, animate]
};

export default config;
