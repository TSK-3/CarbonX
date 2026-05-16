export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Public Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        primary: '#173124',
        'on-primary': '#ffffff',
        'primary-container': '#2d4739',
        'on-primary-container': '#98b5a3',
        secondary: '#4a654a',
        'on-secondary': '#ffffff',
        'secondary-container': '#ccebc8',
        'on-secondary-container': '#506b50',
        tertiary: '#462200',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#663500',
        'on-tertiary-container': '#fe942c',
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        surface: '#fbf9f6',
        'on-surface': '#1b1c1a',
        'surface-variant': '#e4e2df',
        'on-surface-variant': '#424844',
        outline: '#727973',
        'outline-variant': '#c2c8c2',
        'surface-dim': '#dbdad7',
        'surface-bright': '#fbf9f6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f0',
        'surface-container': '#efeeeb',
        'surface-container-high': '#eae8e5',
        'surface-container-highest': '#e4e2df',
        'inverse-surface': '#30312f',
        'inverse-on-surface': '#f2f0ed',
        'surface-tint': '#496455',
        'inverse-primary': '#b0cdbb',
        // Legacy support/extra
        field: "#173124",
        ink: "#1b1c1a",
        sage: "#98b5a3",
        "sage-soft": "#ccebc8",
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
      },
      spacing: {
        'gutter': '16px',
        'margin': '20px',
      }
    }
  },
  plugins: []
};
