/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFCF9',
        surface: '#FFFFFF',
        border: '#E7E3DA',
        textMain: '#1F2430',
        textMuted: '#5C6472',
        sectorPrimary: '#2E8B57',
        sectorSecondary: '#E07A3F',
        sectorTertiary: '#2F6FB0',
        accentYellow: '#F2B233',
        statusSuccess: '#3D9970',
        statusWarning: '#E0A800',
        statusDisrupted: '#C0563A',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'lift': '0 6px 20px rgba(0, 0, 0, 0.08)',
      },
      fontSize: {
        'sm': ['14px', '20px'],
        'base': ['16px', '24px'],
        'lg': ['18px', '26px'],
        'xl': ['22px', '30px'],
        '2xl': ['28px', '36px'],
        '3xl': ['40px', '48px'],
      },
      scale: {
        '102': '1.02',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '70%': { opacity: '1', transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-out both',
        scaleUp: 'scaleUp 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2) both',
        popIn: 'popIn 0.4s ease-out both',
        floaty: 'floaty 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
