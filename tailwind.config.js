/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'figtree': ['Figtree', 'sans-serif'],
      },
      colors: {
        // Design system colors are already in Tailwind defaults
        // Using indigo, pink, purple, gray, zinc, lime, green, amber
      },
    },
  },
  plugins: [],
}

