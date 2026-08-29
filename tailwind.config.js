/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ncert: {
          blue: {
            DEFAULT: '#1B365D',
            light: '#2E5B9A',
            dark: '#0F213A',
            50: '#F0F5FA',
            100: '#D9E6F2',
          },
          primarySector: {
            DEFAULT: '#2E7D32',
            light: '#4CAF50',
            bg: '#E8F5E9',
            border: '#A5D6A7',
            dark: '#1B5E20'
          },
          secondarySector: {
            DEFAULT: '#E65100',
            light: '#FF9800',
            bg: '#FFF3E0',
            border: '#FFCC80',
            dark: '#BF360C'
          },
          tertiarySector: {
            DEFAULT: '#512DA8',
            light: '#7E57C2',
            bg: '#EDE7F6',
            border: '#C5CAE9',
            dark: '#311B92'
          },
          warm: {
            bg: '#FDFBF7',
            card: '#FFFFFF',
            border: '#EAE6DF',
            muted: '#6B7280'
          },
          accent: {
            gold: '#D97706',
            yellow: '#F59E0B',
            green: '#10B981',
            red: '#EF4444'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 54, 93, 0.08)',
        'elevated': '0 10px 30px -5px rgba(27, 54, 93, 0.12)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
