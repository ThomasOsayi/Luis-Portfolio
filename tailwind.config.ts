import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0a",
          elevated: "#0f0f0f",
          card: "#151515",
        },
        tx: {
          DEFAULT: "#ede8e0",
          dim: "rgba(237,232,224,0.50)",
          ghost: "rgba(237,232,224,0.22)",
          mute: "rgba(237,232,224,0.10)",
        },
        gold: {
          DEFAULT: "#c4a265",
          dim: "rgba(196,162,101,0.10)",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Chivo"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
