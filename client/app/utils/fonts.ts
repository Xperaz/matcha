import { Readex_Pro } from "next/font/google";

export const readex_pro = Readex_Pro({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-readex-pro",
  weight: ["200", "300", "400", "500", "700"],
  preload: false,
});

export const fontReadexPro = readex_pro.variable;
