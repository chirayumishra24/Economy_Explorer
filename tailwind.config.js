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
      }
    },
  },
  plugins: [],
}
