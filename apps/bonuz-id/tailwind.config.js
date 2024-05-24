/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",

  // Or if using `src` directory:
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    button1Image: {
      "custom-gradient":
        "linear-gradient(96.3deg, rgba(106, 52, 211, 0.4) 14.82%, rgba(106, 52, 211, 0) 88.09%)",
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      ".border-custom-gradient": {
        "border-style": "solid",
        "border-width": "1px",
        "border-image-source":
          "linear-gradient(3.31deg, rgba(255, 161, 16, 0.6) -14.44%, rgba(255, 161, 16, 0) 91.68%)",
        "border-image-slice": 1,
      },
    });
  },
  require("daisyui"),
];
