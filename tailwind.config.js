export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: '#f39c12',
        buttonHover: '#e67e22',
        cardBg: 'rgba(255, 255, 255, 0.8)',
        overlay: 'rgba(0, 0, 0, 0.4)',
        primaryBg: '#ffffff',
        textColor: '#000000'
      },
      backgroundImage: {
        'hero-pattern': "url('/public/images/background.jpg')",
      },
    },
  },
  plugins: [],
}
