import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        groq: {
          bg: "#F3F3EE",
          surface: "#FFFFFF",
          subtle: "#F8F8F6",
          border: "#E7E5E4",
          borderHover: "#D6D3D1",
          text: "#0C0A09",
          muted: "#57534E",
          dim: "#A8A29E",
          coral: "#F55036",
          coralHover: "#E03E26",
          black: "#1E1E1E"
        },
        console: {
          bg: "#F3F3EE",
          surface: "#FFFFFF",
          subtle: "#F8F8F6",
          elevated: "#FFFFFF",
          border: "#E7E5E4",
          borderHover: "#D6D3D1",
          text: "#0C0A09",
          muted: "#57534E",
          dim: "#A8A29E",
          accent: "#F55036",
          accentHover: "#E03E26",
          violet: "#6366F1",
          success: "#16A34A",
          warning: "#D97706",
          danger: "#DC2626"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
