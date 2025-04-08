/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',
        dark: '#1A1A1A',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};