import { Commissioner, Ysabeau_Office } from "next/font/google";

/**
 * Вариант 12 «Жарчы».
 * Дисплей: Commissioner с осью FLAR (раструбные, будто высеченные окончания) и VOLM: голос глашатая,
 * громкий, но тёплый. Текст: Ysabeau Office, гуманистический гротеск с каллиграфической основой.
 * Глифы Ң ң Ү ү Ө ө проверены в файлах cyrillic-ext обоих шрифтов (fontTools, ноябрь 2026).
 * У Sofia Sans и Wix Madefor их нет, у Unbounded и Manrope тоже.
 */
export const v12Display = Commissioner({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["FLAR", "VOLM"],
  variable: "--font-v12-display",
  display: "swap",
});

export const v12Text = Ysabeau_Office({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-v12-text",
  display: "swap",
});
