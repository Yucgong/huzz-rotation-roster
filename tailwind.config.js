/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          serif: ['Lora', 'Georgia', 'serif'],
          sans: ['DM Sans', 'sans-serif'],
          mono: ['DM Mono', 'monospace'],
        },
        colors: {
          cream: {
            50: '#fdfaf5',
            100: '#f9f2e4',
            200: '#f2e4c8',
          },
          rose: {
            warm: '#c9706a',
            deep: '#a85550',
          },
          ink: {
            DEFAULT: '#2c2420',
            light: '#6b5a54',
            muted: '#9c8c86',
          },
        },
        animation: {
          'fade-up': 'fadeUp 0.6s ease-out forwards',
          'fade-in': 'fadeIn 0.4s ease-out forwards',
          'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        },
        keyframes: {
          fadeUp: {
            '0%': { opacity: '0', transform: 'translateY(16px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          pulseSoft: {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.6' },
          },
        },
      },
    },
    plugins: [],
  }