import { Literata, Oswald } from "next/font/google";

/**
 * Вариант 3 в теме Paste-up (Hallmark). У шрифтов темы (League Gothic, Newsreader) нет кириллицы,
 * поэтому взяты ближайшие по классу с кыргызскими Ң Ү Ө: Oswald для плакатных заголовков,
 * Literata для текста. Расширенная кириллица без предзагрузки: качается, когда встретится на странице.
 */
// optional: заголовок не перерисовывается при поздней подгрузке шрифта (стабильный LCP на мобильных)
export const oswald = Oswald({ subsets: ["cyrillic", "latin"], weight: ["600"], variable: "--font-oswald", display: "optional" });
export const oswaldExt = Oswald({ subsets: ["cyrillic-ext"], weight: ["600"], variable: "--font-oswald-ext", display: "swap", preload: false });
export const literata = Literata({ subsets: ["cyrillic", "latin"], weight: ["400", "500"], variable: "--font-literata", display: "swap" });
export const literataExt = Literata({ subsets: ["cyrillic-ext"], weight: ["400", "500"], variable: "--font-literata-ext", display: "swap", preload: false });
