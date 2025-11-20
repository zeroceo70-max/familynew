
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#3B82F6',
        'brand-green': '#10B981',
        'soft-blue': '#EFF6FF',
        'soft-green': '#ECFDF5',
      }
    },
  },
  plugins: [],
}
