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
    flex: {
      '3': '3 3 0%'
    },
    borderImageSource: {
      "custom-gradient":
        "linear-gradient(328.15deg, rgba(255, 161, 16, 0.6) -5.22%, rgba(255, 255, 255, 0) 84.32%)",
    },
    backgroundImage: {
      "custom-gradient":
        "linear-gradient(96.3deg, rgba(106, 52, 211, 0.4) 14.82%, rgba(106, 52, 211, 0) 88.09%)",
      "custom-gradient1":
        "linear-gradient(97.19deg, rgba(106, 52, 211, 0.4) 14.82%, rgba(106, 52, 211, 0) 83.7%)",
      "custom-gradient2":
        "linear-gradient(122.58deg, #E79413 -19.89%, #EA3E5B 48.73%, #FA0AF0 119.63%)",
      "custom-gradient-mint":
        "linear-gradient(122.58deg, #E79413 -19.89%, #EA3E5B 48.73%, #FA0AF0 119.63%)",
      "custom-border-gradient":
        "linear-gradient(3.31deg, rgba(255, 161, 16, 0.6) -14.44%, rgba(255, 161, 16, 0) 91.68%)",
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    const newUtilities = {
      ".border-solid-1": {
        border: "1px solid",
      },
      ".border-gradient-custom": {
        borderImageSource:
          "linear-gradient(328.15deg, rgba(255, 161, 16, 0.6) -5.22%, rgba(255, 255, 255, 0) 84.32%)",
        borderImageSlice: "1",
      },
      ".rounded-border-gradient": {
        position: "relative",
        padding: "1px" /* Adjust as necessary */,
        borderRadius: "40px",
      },
      ".rounded-border-gradient-inner": {
        borderRadius: "40px",
        overflow: "hidden",
      },
    };

    addUtilities(newUtilities, ["responsive", "hover"]);
  },
  require("daisyui"),
];
