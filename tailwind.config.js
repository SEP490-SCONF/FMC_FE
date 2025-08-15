/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B2EBC',     // màu nhận diện thương hiệu
        secondary: '#232323',   // màu nền chính
        accent: '#FF9800',      // màu nhấn (nút, highlight)
        success: '#4CAF50',
        warning: '#FFC107',
        danger: '#F44336'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      }
    },
  },
  plugins: [],
}