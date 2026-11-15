import { Golos_Text, Science_Gothic } from "next/font/google";

/**
 * Вариант 9. Дисплей: Science Gothic, широкий геометрический гротеск с осью ширины 50–200
 * (капс заголовков ставим на 160–200 %), его прямоугольные формы рифмуются с блоками логотипа.
 * Текст: Golos Text, нейтральный гротеск. У обоих есть cyrillic-ext: Ң ң Ү ү Ө ө своими глифами
 * (Unbounded проверяли: кыргызские буквы у него падают в системный шрифт).
 */
export const v9Display = Science_Gothic({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  axes: ["wdth"],
  variable: "--font-v9-display",
  display: "swap",
});
export const v9Text = Golos_Text({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-v9-text",
  display: "swap",
});
