/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#181613",
        muted: "#6e6960",
        line: "#e8e2d8",
        paper: "#fffdf9",
        shell: "#f7f3eb",
        halal: "#2f6f4e",
        sage: "#dfe9df",
        saffron: "#c88438"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        editorial: "0 22px 60px rgba(24, 22, 19, 0.08)"
      }
    }
  },
  plugins: []
};
