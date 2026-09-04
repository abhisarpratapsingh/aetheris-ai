/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        surface: "#0f172a",
        surfaceElevated: "#1e293b",
        editorial: {
          dark: "#1c1e22",
          card: "#24272c",
          elevated: "#2d3137",
          border: "rgba(255, 255, 255, 0.08)",
          textPrimary: "#f8fafc",
          textSecondary: "#94a3b8",
          coral: "#ff5733",
          coralHover: "#ff6d4d",
          coralLight: "rgba(255, 87, 51, 0.15)",
        },
        accent: {
          blue: "#38bdf8",
          purple: "#818cf8",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#fb7185",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(129, 140, 248, 0.4)' },
        }
      }
    },
  },
  plugins: [],
};
