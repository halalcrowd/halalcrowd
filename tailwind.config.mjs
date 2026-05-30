/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#181613",
        muted: "#6e6960",
        line: "#d9eadf",
        paper: "#ffffff",
        shell: "#eff8f2",
        halal: "#2f6f4e",
        halalDark: "#24583e",
        sage: "#dfe9df",
        saffron: "#2f6f4e"
      },
      fontFamily: {
        display: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        editorial: "0 22px 60px rgba(24, 22, 19, 0.08)"
      }
    }
  },
  plugins: []
};
