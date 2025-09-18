/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ugBlue: "#2E5AAC",
        ugLightBlue: "#E7F0FF",
        ugGrey: "#F5F7FA"
      },
      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.08)"
      }
    },
  },
  plugins: [],
}
