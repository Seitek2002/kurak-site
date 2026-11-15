import { Geologica, Piazzolla } from "next/font/google";

/**
 * Вариант 11 «Тогуз коргоол».
 * Дисплей: Piazzolla, антиква с рублеными, будто вырезанными ножом гранями: рифма с резной доской.
 * Текст и цифры счётчика: Geologica, спокойный гротеск. У обоих есть cyrillic-ext (Ң ң Ү ү Ө ө),
 * глифы проверены на скриншоте /v11/kg.
 */
export const v11Display = Piazzolla({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["opsz"],
  variable: "--font-v11-display",
  display: "swap",
});

export const v11Text = Geologica({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-v11-text",
  display: "swap",
});
