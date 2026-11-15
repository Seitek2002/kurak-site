import type { CategoryId } from "@/content/services";

/** Разделы страницы: шапка и подвал */
export const SECTIONS = [
  { href: "#uslugi", key: "services" },
  { href: "#kalendar", key: "calendar" },
  { href: "#cases", key: "cases" },
  { href: "#komanda", key: "team" },
  { href: "#kontakty", key: "contacts" },
] as const;

/** Тон лоскута каждого направления: шахматный порядок тёмных и светлых в сетке 2 × 4 */
export const CAT_TONE: Record<CategoryId, string> = {
  smm: "red", pr: "sand", events: "ochre", brand: "wine",
  sales: "walnut", digital: "gold", team: "paper", invest: "felt",
};

/** Фигура логотипа и поворот для лоскута направления */
export const CAT_SHAPE: Record<CategoryId, [number, number]> = {
  smm: [0, 0], pr: [3, 0], events: [1, 180], brand: [2, 0],
  sales: [4, 180], digital: [1, 0], team: [3, 180], invest: [2, 90],
};
