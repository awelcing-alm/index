import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Newspaper palette tokens (utility classes you can use directly)
      colors: {
        paper: "#FDF9F3",
        ink: "#1C1B1A",
        burgundy: "#5A2A27",
        gold: "#C6A664",
        lawgreen: "#3B4D3F",
        line: "#D9D6D2",

        // shadcn + app variables (HSL-backed)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // charts (toned to the palette; override in CSS vars if needed)
        chart: {
          1: "hsl(var(--chart-1, 20 10% 10%))",      // ink
          2: "hsl(var(--chart-2, 8 38% 25%))",       // burgundy
          3: "hsl(var(--chart-3, 44 41% 59%))",      // gold
          4: "hsl(var(--chart-4, 140 13% 27%))",     // lawgreen
          5: "hsl(var(--chart-5, 30 12% 60%))"       // line-ish neutral
        },

        // optional sidebar namespace (mapped to vars you already use)
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },

      // Sharp corners by default; still configurable via --radius
      borderRadius: {
        lg: "var(--radius, 0px)",
        md: "calc(var(--radius, 0px) - 2px)",
        sm: "calc(var(--radius, 0px) - 4px)"
      },

      // Minimal, print-like shadows
      boxShadow: {
        panel: "0 1px 0 0 rgba(0,0,0,0.05)"
      },

      // Typography: use CSS vars (set via next/font) for newspaper feel
      fontFamily: {
        serif: ["var(--font-serif)", "'EB Garamond'", "Georgia", "ui-serif", "serif"],
        sans: ["var(--font-sans)", "'Source Sans 3'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
