/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    screens: {
      sm: "300px",
      ss: "350px",
      md: "768px",
      lg: "1024px",
      xl: "1290px",
      "2xl": "1536px",
    },
    colors: {
      primary: "#E7842D",
      secondry: "#3373B9",
      darkBlue: "#060551",
      orange: "#EAA429",
      grey: "#f2f4f6",
      black: "#00040f",
      dimBlack: "rgba(0,0,0,0.7)",
      lightGrey: "#00040f",
      white: "#FFF",
      bodyBg: "#F4F4F4",
      red: "#FF0000	",
    },
    extend: {
      backgroundImage:
        "linear-gradient(135deg, rgba(231, 132, 45, 0.4), rgba(51, 115, 185, 0.4))",
      boxShadow: {
        blackShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        hoverShadow: "0 15px 30px rgba(0,0,0,0.3)",
      },
    },
    fontFamily: {
      body: ["Inter", "sans-serif"],
      dari: ["YekanBakh-Heavy"],
      dari_text: ["YekanBakh-Heavy-light"],
      special: ["Roboto"],
    },
  },
  plugins: [],
};
