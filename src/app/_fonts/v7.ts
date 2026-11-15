import { Golos_Text, Montserrat_Alternates } from "next/font/google";

/**
 * Вариант 7: дисплей Montserrat Alternates (жирный геометрический гротеск с округлыми, чуть причудливыми формами,
 * как заголовки ryba.team), текст Golos Text (чистый гротеск). Глифы Ң ң Ү ү Ө ө проверены в обоих
 * (у Unbounded и Manrope в cyrillic-ext их нет, поэтому они не подошли).
 */
export const v7Display = Montserrat_Alternates({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["700", "800"],
  variable: "--font-v7-display",
  display: "swap",
});
export const v7Text = Golos_Text({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: "variable",
  variable: "--font-v7-text",
  display: "swap",
});
