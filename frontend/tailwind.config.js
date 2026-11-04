/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cream: {
          50: '#fcfdfa',
          100: '#f7f8f2',
          200: '#eef0e4',
          300: '#e1e5d1',
          400: '#d0d6b9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'emerald-soft': '0 10px 25px -5px rgba(5, 150, 105, 0.15)',
        'emerald-card': '0 4px 20px -2px rgba(6, 78, 59, 0.08)',
      }
    },
  },
  plugins: [],
}