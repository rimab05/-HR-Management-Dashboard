/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#12202B',
          800: '#1A2C3A',
          700: '#243B4C',
        },
        brand: {
          50: '#E9F6F5',
          100: '#CBEAE8',
          200: '#9ED8D4',
          500: '#16918E',
          600: '#0E7C7B',
          700: '#0B6564',
          800: '#094F4F',
        },
        surface: '#F3F5F8',
      },
    },
  },
  plugins: [],
};
