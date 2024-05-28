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
    borderImage: {
      "gradient-border":
        "1 solid linear-gradient(135.72deg, #57B3F5 0%, rgba(255, 255, 255, 0) 34.5%)",
    },
    backgroundImage: {
      "custom-gradient":
        "linear-gradient(122.58deg, #e79413 -19.89%, #ea3e5b 48.73%, #fa0af0 119.63%)",
      "custom-gradient1":
        "linear-gradient(122.58deg, #e79413 -19.89%, #ea3e5b 48.73%, #fa0af0 119.63%)",
      "custom-bg-gradient":
        "linear-gradient(97.19deg, rgba(106, 52, 211, 0.4) 14.82%, rgba(106, 52, 211, 0) 83.7%)",
      "custom-border-gradient":
        "linear-gradient(3.31deg, rgba(255, 161, 16, 0.6) -14.44%, rgba(255, 161, 16, 0) 91.68%)",
    },
  },
};
export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      ".border-custom-gradient": {
        "border-image-source":
          "linear-gradient(135.72deg, #57B3F5 0%, rgba(255, 255, 255, 0) 34.5%)",
        "border-image-slice": "1",
      },
    });
  },
  require("daisyui"),
];
