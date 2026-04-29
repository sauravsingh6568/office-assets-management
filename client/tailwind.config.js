/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf6",
          100: "#d7f5e8",
          200: "#b2ead3",
          300: "#7ddab5",
          400: "#43c08d",
          500: "#209f6d",
          600: "#168258",
          700: "#146849",
          800: "#14533c",
          900: "#124433",
        },
        ink: {
          900: "#0f1720",
          800: "#17212b",
          700: "#253341",
        },
        sand: "#f6f3ee",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 24px 60px rgba(15, 23, 32, 0.12)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(32,159,109,0.18), transparent 32%), radial-gradient(circle at top right, rgba(20,83,60,0.12), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #f6f3ee 45%, #eefbf6 100%)",
      },
    },
  },
  plugins: [],
};
