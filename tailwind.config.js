/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        signature: ["'Great Vibes', cursive"],
      },
      boxShadow: {
        massive: "0 25px 50px rgba(0, 0, 0, 0.7)", // Super large shadow
      },
      animation: {
        "up-down": "upDown 3s ease-in-out infinite", // Animation name, duration, and infinite looping
      },
      keyframes: {
        upDown: {
          "0%, 100%": { transform: "translateY(0)" }, // Start and end positions
          "50%": { transform: "translateY(-10px)" }, // Middle position
        },
      },
    },
  },
  plugins: [],
};
