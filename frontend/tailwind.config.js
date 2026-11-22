/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coroot: {
          bg: '#050507',
          surface: '#0d0d12',
          card: '#121217',
          cardHover: '#181820',
          border: '#23232c',
          borderHover: '#32323f',
          green: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
