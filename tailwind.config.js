/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "ev-green": "#10b981",
        "ev-green-dark": "#059669",
        "ev-orange": "#f97316",
        "ev-surface": "#020617",
        "ev-surface-soft": "#0b1120",
        "ev-slate": "#020617",
        "cream": "#FFFAF0"
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
      }
    }
  },
  plugins: []
};

