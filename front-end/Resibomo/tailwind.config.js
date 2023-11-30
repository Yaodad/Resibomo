/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#303032',
        secondary: '#b6b6b9',
        tertiary: '#d63416'
      },
      fontFamily: {
        'sans': 'Helvetica, Arial, sans-serif',
        primary: 'Nimbus Sans L, sans-serif',
        secondary: 'IBM Plex Mono, sans-serif'
      }
    },
  },
  plugins: [],
}