const colors = require('./src/constants/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        colors,
      }
    },
  },
  plugins: [],
}
