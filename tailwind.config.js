/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#A100FF',
          violet: '#3D0066',
          black: '#160029',
          pink: '#FF50C8',
          'pink-light': '#FF8DE0',
        },
        surface: {
          900: '#0D0D18',
          800: '#12121F',
          700: '#1A1A2E',
          600: '#22223A',
          500: '#2E2E50',
        },
        severity: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#EAB308',
          low: '#3B82F6',
          healthy: '#22C55E',
          stale: '#F59E0B',
          grey: '#6B7280',
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", 'sans-serif'],
        body: ["'Inter'", 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
    },
  },
  plugins: [],
};
