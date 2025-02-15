/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        "light-grey": "#E4E0E1",
        beige: "#D6C0B3",
        brown: "#AB886D",
        "dark-brown": "#493628",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "map-base": "#EAEAEA",
        "map-hover": "#DADADA",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        hint: "hint 1.5s ease-in-out infinite",
        circle: "circle 2s ease-in-out infinite",
        marker: "marker 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards",
      },
      keyframes: {
        hint: {
          "0%, 100%": { fill: "#EAEAEA" },
          "50%": { fill: "#4ade80" },
        },
        circle: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.3)", opacity: "0.4" },
          "100%": { transform: "scale(1)", opacity: "0.8" },
        },
        marker: {
          "0%": {
            transform: "scaleX(0)",
            opacity: "0",
          },
          "100%": {
            transform: "scaleX(1)",
            opacity: "1",
          },
        },
      },
      backgroundImage: {
        "map-pattern": "url('/patterns/cartography.svg')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
