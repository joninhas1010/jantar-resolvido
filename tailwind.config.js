/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        amarelo: '#FDE047',
        preto: '#0A0A0A',
        grafite: '#171717',
        cinza: '#262626',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'card': '32px',
      },
    },
  },
  plugins: [],
}
