import localFont from "next/font/local";
import { Golos_Text } from "next/font/google";

/**
 * Вариант 8 «Меню» (по мотивам Додо Пиццы).
 * Заголовки: M PLUS Rounded 1c (SIL OFL 1.1, The Rounded M+ Project Authors), округлый геометрический гротеск,
 * ближе всего к подаче Dodo Rounded. С Google Fonts он тянет сотни японских кусков, поэтому шрифт урезан
 * до латиницы и кириллицы с кыргызскими Ң Ү Ө (U+0400–052F) через fontTools: 28 КБ на начертание, лежит в public/v8/fonts.
 * Текст: Golos Text, дружелюбный гротеск с cyrillic-ext.
 */
export const v8Display = localFont({
  src: [
    { path: "../../../public/v8/fonts/mplus-rounded-1c-700.woff2", weight: "700", style: "normal" },
    { path: "../../../public/v8/fonts/mplus-rounded-1c-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--v8-font-display",
  display: "swap",
  fallback: ["Nunito", "Arial Rounded MT Bold", "system-ui", "sans-serif"],
});

export const v8Body = Golos_Text({
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: ["400", "500", "600"],
  variable: "--v8-font-body",
  display: "swap",
});
