import { CATEGORIES } from "@/content/kurak";
import type { CategoryId } from "@/content/services";

/** Цвет шерсти направления: тот же, что у пучка в меню и у зубцов на полотне первого экрана */
export const wool = (cat: CategoryId) => `var(--v10-w${CATEGORIES.findIndex((c) => c.id === cat) + 1})`;
