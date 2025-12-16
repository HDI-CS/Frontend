/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/component/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        gray10: '#F6F7F8',
        gray30: '#D0D7DD',
        gray50: '#8D8D8D',
        regularBlack: '#3A3A49',
        blue: '#4676FB',
        deepBlue: '#001D6C',
        red: '#DA1E28',
        lineGray: '#E9E9E7',
        green: '#34A853',
        blueBackground: '#F4F7FF',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        pretendard: ['var(--font-pretendard)'],
      },

      fontSize: {
        'title-big': ['32px', { lineHeight: '1.1', fontWeight: '700' }],
        title: ['20px', { lineHeight: '1.1', fontWeight: '700' }],
        'regular-big': ['18px', { lineHeight: '1', fontWeight: '400' }],
        regular: ['16px', { lineHeight: '20px', fontWeight: '400' }],
        'regular-small': ['14px', { lineHeight: '21px', fontWeight: '400' }],
        'bold-20': ['20px', { lineHeight: '1', fontWeight: '700' }],
        'bold-18': ['18px', { lineHeight: '1', fontWeight: '700' }],
        'bold-16': ['16px', { lineHeight: '1', fontWeight: '700' }],
      },

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },

      boxShadow: {
        card: '0 4px 14px rgba(0, 0, 0, 0.08)',
      },
    },
  },

  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.js',
    },
    '@tailwindcss/forms': {},
    autoprefixer: {},
  },
};
