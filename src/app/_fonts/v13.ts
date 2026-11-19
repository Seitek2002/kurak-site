import { Golos_Text, Pliant } from "next/font/google";

/**
 * Вариант 13 «Сборка».
 * Дисплей: Pliant, широкий геометрический гротеск (ось wdth 100–125): круглые чаши и прямые срезы
 * перекликаются с фигурами знака KURAK. Текст: Golos Text, спокойный гротеск с хорошей кириллицей.
 * Глифы Ң ң Ү ү Ө ө проверены в файлах cyrillic-ext обоих шрифтов (fontTools, ноябрь 2026).
 */
export const v13Display = Pliant({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["wdth"],
  variable: "--font-v13-display",
  display: "swap",
});

export const v13Text = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-v13-text",
  display: "swap",
});
