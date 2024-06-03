/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  havelockBlue: "selector",
  theme: {
    fontFamily: {
      poppins: "Poppins",
    },
    extend: {
      borderWidth: {
        1: "1px",
      },
      fontSize: {
        "2xs": "10px",
      },
      colors: {
        "havelock-blue": {
          50: "#f0f7fe",
          100: "#deecfb",
          200: "#c4e0f9",
          300: "#9bccf5",
          400: "#6cb0ee",
          500: "#5498e9",
          600: "#3476dc",
          700: "#2b61ca",
          800: "#294fa4",
          900: "#264582",
          950: "#1c2c4f",
        },
        "burnt-umber": {
          50: "#fdf4f3",
          100: "#fce7e4",
          200: "#fbd3cd",
          300: "#f7b5aa",
          400: "#f08979",
          500: "#e5634e",
          600: "#d14731",
          700: "#b03825",
          800: "#8f3122",
          900: "#792f23",
          950: "#41150e",
        },
      },
      backgroundImage: {
        "app-linear-gradient":
          "linear-gradient(to bottom right, var(--tw-gradient-stops)), linear-gradient(to top right, var(--tw-gradient-stops))",
        "app-login-radial":
          "radial-gradient(345% 170% at 0% 0%, var(--tw-gradient-stops)), radial-gradient(260% 170% at 100% 115%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
