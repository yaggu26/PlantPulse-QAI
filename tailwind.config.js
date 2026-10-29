/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0faf3',
          100: '#dcf2e3',
          200: '#bbe5cb',
          300: '#8ed1a8',
          400: '#59b07d',
          500: '#34925f',
          600: '#23764a',
          700: '#1c5d3c',
          800: '#194a33',
          900: '#163d2b',
          950: '#0a2218',
        },
        navy: {
          50: '#f1f5fb',
          100: '#e2eaf3',
          200: '#c5d3e6',
          300: '#9ab2d1',
          400: '#6788b5',
          500: '#476798',
          600: '#37517e',
          700: '#2e4266',
          800: '#283957',
          900: '#1d2b42',
          950: '#121a2b',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 42, 27, 0.06), 0 8px 24px rgba(16, 42, 27, 0.08)',
        glow: '0 0 0 1px rgba(52, 146, 95, 0.15), 0 12px 40px rgba(52, 146, 95, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.4s ease-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'dash': 'dash 1.2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        dash: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};
