/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: [
    './index.html',
    './src/**/*.{tsx,ts,jsx,js}'
  ],
  theme: {
    extend: {
      animation: {
        wave: 'wave 1.5s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    }
  },
  plugins: [
    daisyui,
  ],
}

