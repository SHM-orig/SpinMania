/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        void: '#030014',
        neon: {
          cyan: '#00f5ff',
          magenta: '#ff2bd6',
          gold: '#ffd60a',
          purple: '#b14aff',
          red: '#ff3b6b',
        },
      },
      boxShadow: {
        cyan: '0 0 24px rgba(0, 245, 255, 0.45)',
        magenta: '0 0 24px rgba(255, 43, 214, 0.45)',
        gold: '0 0 28px rgba(255, 214, 10, 0.5)',
      },
    },
  },
  plugins: [],
};
