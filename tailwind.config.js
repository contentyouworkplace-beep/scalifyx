/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#10B981', dark: '#059669', light: '#34D399' },
        secondary: { DEFAULT: '#6366F1', light: '#8B5CF6' },
        accent: '#10B981',
        surface: '#141419',
        card: '#1A1A22',
        bg: '#0A0A0F',
        border: '#27272A',
        inputBg: '#18181B',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
};
