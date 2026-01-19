
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#6366f1', // Indigo
          600: '#4f46e5',
          700: '#4338ca',
        },
        accent: {
          400: '#fbbf24', // Amber
          500: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
