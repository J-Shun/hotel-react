/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#38470B",
        secondary: "#949C7C",
        form: "#6A6A6A",
        range: "#D7DACE",
      },
      spacing: {
        "entry-card": "275px",
        "info-img-width": "573px",
        "info-img-height": "768px",
        "calendar-height": "340px",
        "form-padding": "84px",
        "form-width": "445px",
        "form-height": "700px",
        "result-width": "1112px",
        "icon-width": "518px",
        "flow-height": "86px",
        22: "5.5rem",
      },
      backgroundImage: {
        "transparent-bottom":
          "linear-gradient(180deg, #FFFFFF00 0%, #FFFFFF 100%)",
      },
      fontSize: {
        xxs: ["0.625rem", "0.75rem"],
      },
      borderWidth: {
        6: "6px",
      },
      animation: {
        pop: "pop 0.3s linear",
      },
      keyframes: {
        pop: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
