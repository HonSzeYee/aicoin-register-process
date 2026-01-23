import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f0c84a",
        "primary-focus": "#d1a83f",
        "primary-content": "#1c1c1c",

        secondary: "#202130",
        "secondary-content": "#ffffff",

        accent: "#ee7f5e",
        "accent-content": "#1c1c1c",

        neutral: "#f5f0e6",
        "neutral-content": "#1c1c1c",

        info: "#202130",
        success: "#267c47",
        warning: "#f5d362",
        error: "#d62828",
      },
      boxShadow: {
        soft: "0 30px 60px rgba(23, 19, 14, 0.18)",
        glow: "0 20px 45px rgba(255, 202, 143, 0.4)",
      },
      borderRadius: {
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    styled: true,
    themes: [
      {
        lofi: {
          "primary": "#f0c84a",
          "primary-focus": "#d1a83f",
          "primary-content": "#1c1c1c",
          "secondary": "#202130",
          "secondary-content": "#ffffff",
          "accent": "#ee7f5e",
          "accent-content": "#1c1c1c",
          "neutral": "#f5f0e6",
          "neutral-content": "#1c1c1c",
          "info": "#202130",
          "success": "#267c47",
          "warning": "#f5d362",
          "error": "#d62828",
          "base-100": "#fefbf5",
          "base-200": "#f5f0e6",
          "base-content": "#1c1c1c",
        },
      },
    ],
  },
};
