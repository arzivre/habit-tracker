/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 30 column grid
        28: "repeat(28, minmax(0, 1fr))",
        29: "repeat(29, minmax(0, 1fr))",
        30: "repeat(30, minmax(0, 1fr))",
        31: "repeat(31, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
