import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E51A5C",
        secondary: "#F5F0F2",
        "primary-foreground": "#FFFFFF",
        "secondary-foreground": "#171212",
        destructive: "#FF4D4D",
        "destructive-foreground": "#FFFFFF",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
