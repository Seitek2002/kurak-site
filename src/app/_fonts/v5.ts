import { Golos_Text, Noto_Serif_Display } from "next/font/google";

/**
 * Вариант 5 «Кут». Антиква Noto Serif Display: высокий контраст, ось ширины (берём 84 %),
 * чтобы длинные кыргызские слова держались в строке. Текст: гротеск Golos Text.
 * У обоих есть cyrillic-ext, то есть Ң ң Ү ү Ө ө.
 */
export const v5Serif = Noto_Serif_Display({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["wdth"],
  variable: "--font-v5-serif",
  display: "swap",
});

export const v5Sans = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-v5-sans",
  display: "swap",
});
