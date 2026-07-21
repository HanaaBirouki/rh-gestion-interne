// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8f9ff",
        foreground: "#0b1c30",
        primary: "#00236f",
        "primary-container": "#1e3a8a",
        secondary: "#0051d5",
        "secondary-container": "#316bf3",
        border: "#c5c5d3",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        outline: "#757682",
        "outline-variant": "#c5c5d3",
        surface: "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#444651",
        "on-primary": "#ffffff",
        "on-primary-container": "#90a8ff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#fefcff",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#b6c4ff",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/forms"), // Commenté temporairement
  ],
}