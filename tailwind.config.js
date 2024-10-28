/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'color-1': '#252525',
        'color-2': '#9A9A9A',
        'color-3': '#3B3B3B',
        'color-4': '#FF0000',
        'color-5': '#FD99FF',
        'color-6': '#FF9E9E',
        'color-7': '#91F48F',
        'color-8': '#FFF599',
        'color-9': '#9EFFFF',
        'color-10': '#B69CFF',
        'color-11': '#FFFFFF',
        'color-12': '#CFCFCF',
        'color-13': '#000000',
      },
    },
  },
  plugins: [],
}
