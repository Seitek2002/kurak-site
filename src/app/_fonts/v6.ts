import { IBM_Plex_Sans } from "next/font/google";

/**
 * Вариант 6 «Эсеп»: один строгий гротеск на всю страницу. IBM Plex Sans переменный по ширине и насыщенности:
 * заголовки и крупные цифры набраны узким начертанием (wdth 85), текст обычным (wdth 100).
 * Табличные цифры (tnum) есть, кыргызские Ң ң Ү ү Ө ө лежат в подмножестве cyrillic-ext.
 */
export const plex = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["wdth"],
  variable: "--font-v6-plex",
  display: "swap",
});
