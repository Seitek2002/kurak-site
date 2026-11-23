import localFont from "next/font/local";

/**
 * Kurak Display: Dela Gothic One (SIL OFL 1.1, src/fonts/DelaGothicOne-OFL.txt) с дорисованными
 * кыргызскими Ң ң Ү ү Ө ө (их нет в оригинале). Латиница и кириллица, без японских глифов.
 * Типографику из меню услуг варианта 2 заказчица отметила как понравившуюся; этот файл даёт её же
 * на кыргызских страницах. Сборка шрифта: scripts/build-kurak-display.py.
 */
export const kurakDisplay = localFont({
  src: "../../fonts/KurakDisplay.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-kurak-display",
  display: "swap",
  fallback: ["Arial Black", "sans-serif"],
  adjustFontFallback: "Arial",
});
