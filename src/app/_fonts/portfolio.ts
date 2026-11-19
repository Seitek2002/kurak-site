import { TikTok_Sans } from "next/font/google";

/**
 * Портфолио в PDF: одна гарнитура TikTok Sans, ширина знаков работает как ранг.
 * Заголовки широкие и жирные (wdth 125–150), как приземистые фигуры логотипа KURAK; текст обычной ширины.
 * cyrillic-ext даёт Ң ң Ү ү Ө ө (проверено по cmap шрифта).
 */
export const pfSans = TikTok_Sans({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  axes: ["wdth", "opsz"],
  variable: "--font-pf",
  display: "block",
});
