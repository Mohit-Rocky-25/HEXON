import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        console: {
          bg: "#07090e",
          surface: "#0d1117",
          subtle: "#161b22",
          elevated: "#21262d",
          border: "#30363d",
          borderHover: "#484f58",
          text: "#f0f6fc",
          muted: "#8b949e",
          dim: "#6e7681",
          accent: "#00f2fe",
          accentHover: "#38bdf8",
          violet: "#a371f7",
          success: "#3fb950",
          warning: "#d29922",
          danger: "#f85149"
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
