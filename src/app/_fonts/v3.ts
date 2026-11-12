import { Onest, Rubik } from "next/font/google";

/** Вариант 3: заголовки */
// optional: заголовок не перерисовывается при поздней подгрузке шрифта (стабильный LCP на мобильных)
export const rubik = Rubik({ subsets: ["cyrillic", "latin"], weight: ["700"], variable: "--font-rubik", display: "optional" });

/** Вариант 3: кыргызские ң ү ө. Без предзагрузки: браузер скачает их, только когда встретит на странице */
export const rubikExt = Rubik({ subsets: ["cyrillic-ext"], weight: ["700"], variable: "--font-rubik-ext", display: "swap", preload: false });
export const onestExt = Onest({ subsets: ["cyrillic-ext"], weight: ["400", "600"], variable: "--font-onest-ext", display: "swap", preload: false });
