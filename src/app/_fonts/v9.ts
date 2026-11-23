import { Onest } from "next/font/google";

/**
 * Вариант 9, текст: Onest, как в меню услуг варианта 2 (типографику оттуда отметила заказчица).
 * У Onest есть cyrillic-ext: Ң ң Ү ү Ө ө своими глифами (проверено на /v9/kg).
 * Дисплей варианта: Kurak Display из ./kurakDisplay (Dela Gothic One с дорисованными кыргызскими буквами),
 * подключается в layout варианта.
 */
export const v9Text = Onest({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  variable: "--font-v9-text",
  display: "swap",
});
