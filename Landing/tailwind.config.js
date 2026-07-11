/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./*.jsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
