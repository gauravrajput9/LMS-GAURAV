import animatePlugin from 'tailwindcss-animate'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@shadcn/ui/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
      },
    },
  },
  plugins: [animatePlugin], 
  darkMode: "class",
}
