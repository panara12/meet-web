/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        header_bg_color:"#3b82f6",
      },
      text:{
        header_text_color:"#1e293b"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}