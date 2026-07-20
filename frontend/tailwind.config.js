/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0047ab",
        secondary: "#0d9488",
        navy: "#07112e",
      },
    },
  },
  plugins: [],
};
