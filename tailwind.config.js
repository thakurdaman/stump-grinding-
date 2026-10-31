/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bark: "#33241B",
        cream: "#FBF6EC",
        orange: {
          DEFAULT: "#E8731A",
          hover: "#D0610D",
          light: "#FAECE2",
        },
        forest: {
          DEFAULT: "#2E5E3E",
          dark: "#20442D",
          light: "#EAF2EC",
        },
        wood: {
          DEFAULT: "#8A5A3B",
          dark: "#684128",
          light: "#D9C2B0",
        },
        sand: {
          DEFAULT: "#EFE4CE",
          light: "#F7F2E7",
          dark: "#D8C7A5",
        },
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
