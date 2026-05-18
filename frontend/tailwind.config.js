/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          50: '#f0f4ff',
          100: '#d7defe',
          200: '#b5c1fd',
          300: '#8ea1fc',
          400: '#6077f6',
          500: '#3d54e8',
          600: '#2f3cd0',
          700: '#2430a2',
          800: '#1a256f',
          900: '#101840',
          950: '#090d22',
        },
        neon: {
          400: '#4dd4ff',
          500: '#33c7ff',
          600: '#1bbaff',
        },
        violet: {
          400: '#c18cff',
          500: '#9c61ff',
          600: '#7f40ff',
        },
        coral: {
          400: '#ff7f7f',
          500: '#ff5d5d',
        },
        steel: {
          50: '#f3f4f6',
          100: '#d1d5db',
          200: '#9ca3af',
          300: '#6b7280',
          400: '#4a5264',
          500: '#353b4a',
          600: '#252a38',
          700: '#1a1d28',
          800: '#12141c',
          900: '#0a0c10',
          950: '#050608',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(92, 153, 61, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(92, 153, 61, 0.8)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}