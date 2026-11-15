import { CATEGORIES, TEAM, type Category, type Lang, type T } from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { V11 } from "@/content/v11";

export type HoleId = "strategy" | CategoryId;
export type Hole = { id: HoleId; n: number; short: T; goal: T; category: Category | null };

/** Девять лунок нашей стороны: первая (с неё начинается партия) — стратегия, дальше восемь направлений по порядку */
export const HOLES: Hole[] = [
  { id: "strategy", n: 1, short: V11.strategy.short, goal: V11.strategy.goal, category: null },
  ...CATEGORIES.map((c, i) => ({ id: c.id as HoleId, n: i + 2, short: c.short, goal: c.goal, category: c })),
];

export const HOLE_INDEX: Record<HoleId, number> = Object.fromEntries(HOLES.map((h, i) => [h.id, i])) as Record<HoleId, number>;

/** Сколько коргоолов лежит в каждой лунке: по одному на отмеченную услугу (и один на стратегию) */
export function countsFor(picked: string[], strategy: boolean): number[] {
  const counts = HOLES.map(() => 0);
  if (strategy) counts[0] = 1;
  HOLES.forEach((h, i) => {
    if (h.category) counts[i] = h.category.services.filter((sv) => picked.includes(sv.id)).length;
  });
  return counts;
}

/** Какими лунками руководит человек: по имени в CATEGORIES, а если имя ещё не прислали, по его направлению */
export function holesOf(personId: string): number[] {
  const person = TEAM.find((p) => p.id === personId);
  if (!person) return [];
  const out: number[] = [];
  HOLES.forEach((h, i) => {
    const c = h.category;
    if (!c) return;
    if (c.lead.name ? c.lead.name === person.name.value.ru && !person.name.draft : person.category === c.id) out.push(i);
  });
  return out;
}

/** Позиции коргоолов внутри лунки (в процентах от её размера), подсолнух из центра */
export function korgoolSpots(n: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const r = n === 1 ? 0 : 15 * Math.sqrt(i + 0.5);
    const a = i * 2.39996 + 0.6;
    out.push({ x: 50 + Math.cos(a) * Math.min(r, 30), y: 50 + Math.sin(a) * Math.min(r, 30) });
  }
  return out;
}

/** Номера ходов на коргоолах в одной лунке: раскладка без наложений */
export function markSpots(n: number): { x: number; y: number }[] {
  const layouts: { x: number; y: number }[][] = [
    [],
    [{ x: 50, y: 50 }],
    [{ x: 31, y: 50 }, { x: 69, y: 50 }],
    [{ x: 50, y: 29 }, { x: 30, y: 64 }, { x: 70, y: 64 }],
    [{ x: 32, y: 32 }, { x: 68, y: 32 }, { x: 32, y: 68 }, { x: 68, y: 68 }],
  ];
  return layouts[Math.min(n, 4)] ?? [];
}

/** «Руководитель SMM» → «руководитель SMM» для подписи «Ведёт: …» */
export const lcFirst = (x: string) => (/^\p{Lu}\p{Ll}/u.test(x) ? x.charAt(0).toLocaleLowerCase("ru") + x.slice(1) : x);

export const pick = (x: T, lang: Lang) => x[lang];
