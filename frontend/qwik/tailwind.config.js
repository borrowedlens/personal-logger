/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
