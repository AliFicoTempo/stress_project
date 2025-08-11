/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-to-r' : 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      colors: {
        brand: {
          50: '#f5fbff', 100: '#eaf6ff', 200: '#cfe9ff', 300: '#9fd4ff',
          400: '#63b9ff', 500: '#2563EB', 600: '#1f4fd1', 700: '#173b9f', 
          800: '#122b75', 900: '#0d1c4f'
        },
        neutral: {
          50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 
          400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 
          800: '#1f2937', 900: '#111827'
        }
      },
      boxShadow: { card: '0 6px 18px rgba(16,24,40,0.06)' },
      borderRadius: { '2xl': '1rem' },
      fontFamily: { 
        sans: ['Inter','ui-sans-serif','system-ui'], 
        display: ['Orbitron','Inter','system-ui'] 
      }
    }
  },
  plugins: [],
  
}
