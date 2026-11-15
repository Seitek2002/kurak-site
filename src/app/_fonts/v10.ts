import { Fira_Sans, Fira_Sans_Extra_Condensed } from "next/font/google";

/**
 * Вариант 10 «Чий». Дисплей: Fira Sans Extra Condensed, сверхузкий гуманистический гротеск с длинными
 * вертикальными штрихами: буквы стоят, как стебли чия. Текст: Fira Sans из той же семьи, нормальной ширины.
 * Проверено на /v10/kg: у обоих свои глифы Ң ң Ү ү Ө ө (cyrillic-ext).
 * Sofia Sans пробовали и отказались: у Extra Condensed нет ң и ө, а для lang="ky" она включает болгарские
 * формы (т как m, д как g).
 */
export const v10Display = Fira_Sans_Extra_Condensed({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["600", "700", "800"],
  variable: "--font-v10-display",
  display: "swap",
});

export const v10Text = Fira_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-v10-text",
  display: "swap",
});
