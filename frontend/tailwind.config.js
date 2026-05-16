export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Public Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        field: "#173124",
        soil: "#8b5e34",
        sun: "#fe942c",
        ink: "#1b1c1a",
        surface: "#fbf9f6",
        "surface-low": "#f5f3f0",
        "surface-container": "#efeeeb",
        "surface-high": "#eae8e5",
        outline: "#727973",
        "outline-variant": "#c2c8c2",
        sage: "#98b5a3",
        "sage-soft": "#ccebc8",
        "primary-container": "#2d4739"
      }
    }
  },
  plugins: []
};
