/** @type {import('tailwindcss').Config} */
module.exports = {
  // 공통 프리셋으로 사용할 것이므로 content는 각 앱에서 지정
  // apps/web, apps/admin 등에서 확장해 사용합니다.
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

  plugins: [
    require('@tailwindcss/forms'), // form 스타일 향상
    require('@tailwindcss/typography'), // prose 텍스트 스타일
  ],
};
