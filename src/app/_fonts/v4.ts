import { Golos_Text, Nata_Sans } from "next/font/google";

/**
 * Вариант 4 «Конструктор». Nata Sans: широкий геометрический гротеск, круглые О и С как полукруг знака,
 * для крупного дисплея и цифр. Golos Text: нейтральный гротеск для текста (швейцарская пара: геометрия над гротеском).
 * У обоих есть кыргызские Ң Ү Ө (подмножество cyrillic-ext). next/font всё равно пишет в CSS все диапазоны,
 * а subsets решает, что предзагрузить: cyrillic-ext в списке, чтобы на /v4/kg буквы не мигали запасным шрифтом.
 */
export const nata = Nata_Sans({ subsets: ["cyrillic", "cyrillic-ext", "latin"], weight: ["800"], variable: "--font-v4-display", display: "swap" });
export const golos = Golos_Text({ subsets: ["cyrillic", "cyrillic-ext", "latin"], weight: ["400", "600"], variable: "--font-v4-body", display: "swap" });
