import localFont from "next/font/local";

/**
 * Dela Gothic One (OFL, src/fonts/DelaGothicOne-OFL.txt), урезан до латиницы и кириллицы:
 * 13 КБ вместо сотен японских кусков из Google Fonts. Кыргызских ң ү ө в нём нет,
 * поэтому вариант 3 (русский и кыргызский) набран Rubik.
 * Каждый шрифт в своём модуле: Next подключает на странице все шрифты импортированного модуля.
 */
export const dela = localFont({
  src: "../../fonts/DelaGothicOne-kurak.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-dela",
  // optional: заголовок не перерисовывается при поздней подгрузке шрифта (стабильный LCP на мобильных)
  display: "optional",
  fallback: ["Arial Black", "sans-serif"],
  adjustFontFallback: "Arial",
});
