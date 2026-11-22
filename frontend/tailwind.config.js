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
        jira: {
          bg: '#f4f5f7',
          card: '#ffffff',
          border: '#dfe1e6',
          borderHover: '#c1c7d0',
          blue: '#0052cc',
          blueHover: '#0065ff',
          text: '#172b4d',
          muted: '#5e6c84',
          subtle: '#6b778c',
        },
      },
      fontFamily: {
        sans: [
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
