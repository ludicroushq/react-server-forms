import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@react-server-forms/daisy-ui/dist/**/*",
  ],
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
  daisyui: {
    themes: ["light"],
    logs: false,
  },
} satisfies Config;
