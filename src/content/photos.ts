/**
 * Фото и логотипы клиентов для всех вариантов (1–9). Пока агентство их не прислало, на сайте стоят плейсхолдеры
 * <PhotoSlot>: рамка с силуэтом и подписью «Фото…» или «Логотип клиента».
 *
 * Прислали фото: положите файл в public/photos/… и впишите путь БЕЗ ведущего слеша (например "photos/team/oksana.jpg").
 * Плейсхолдер сам сменится фотографией во всех вариантах. Пустая строка = плейсхолдер.
 * Логотипы клиентов публикуем только с их разрешения (концепция).
 */
import type { CategoryId } from "./services";

/** Портреты руководителей. Ключи совпадают с TEAM[].id в content/kurak.ts */
export const TEAM_PHOTOS: Record<string, string> = {
  oksana: "",
  bibinur: "",
  nurchik: "",
  "smm-lead": "",
  "pr-lead": "",
};

/** Кто стоит за направлением, для вариантов 1–3, где руководители описаны через категорию */
export const PERSON_BY_CATEGORY: Partial<Record<CategoryId, string>> = {
  invest: "oksana",
  events: "bibinur",
  brand: "nurchik",
  smm: "smm-lead",
  pr: "pr-lead",
};

/** Фото проектов. Ключи совпадают с CASES[].id (coffee, forum, clinic, food) */
export const CASE_PHOTOS: Record<string, string> = {
  coffee: "",
  forum: "",
  clinic: "",
  food: "",
};

/** Фото авторов отзывов, по порядку REVIEWS */
export const REVIEW_PHOTOS: string[] = ["", "", ""];

/** Логотипы клиентов, давших разрешение, по порядку CLIENT_LOGOS */
export const CLIENT_LOGO_FILES: string[] = ["", "", "", ""];

export const teamPhoto = (personId: string | undefined) => (personId ? TEAM_PHOTOS[personId] || undefined : undefined);
export const categoryPhoto = (cat: CategoryId) => teamPhoto(PERSON_BY_CATEGORY[cat]);
export const casePhoto = (caseId: string) => CASE_PHOTOS[caseId] || undefined;
export const reviewPhoto = (i: number) => REVIEW_PHOTOS[i] || undefined;
export const clientLogo = (i: number) => CLIENT_LOGO_FILES[i] || undefined;

/** Подписи плейсхолдеров на двух языках */
export const SLOT_TEXT = {
  photo: { ru: "Фото", ky: "Сүрөт" },
  portrait: { ru: "Фото", ky: "Сүрөт" },
  project: { ru: "Фото проекта", ky: "Долбоордун сүрөтү" },
  author: { ru: "Фото автора", ky: "Автордун сүрөтү" },
  client: { ru: "Логотип клиента", ky: "Кардардын логотиби" },
} as const;
