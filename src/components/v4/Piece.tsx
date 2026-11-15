import type { CategoryId } from "@/content/services";

/**
 * Детали «Конструктора». Четыре фигуры знака KURAK, приведённые к квадрату 100 × 100:
 * блок с V-вырезом (K), полукруг (U), чаша (R) и треугольник (A). Каждая фигура
 * служит двум направлениям в двух положениях: 4 × 2 = 8 деталей, по одной на категорию услуг.
 * Пропорции взяты из знака: вырез K на 63 % ширины, у U половина высоты прямая, у R дуга и ножка.
 */
export const SHAPES = {
  k: "M0 0H100L63 50L100 100H0Z",
  u: "M0 0H100V50A50 50 0 0 1 0 50Z",
  r: "M0 0H52A48 43 0 0 1 84.7 74.6L100 100H0Z",
  a: "M50 0L100 100H0Z",
} as const;

type Shape = keyof typeof SHAPES;

/** Положение детали: поворот вокруг центра или зеркало */
export const PIECES: Record<CategoryId, { shape: Shape; t?: string }> = {
  smm: { shape: "u", t: "rotate(180 50 50)" }, // купол: о вас узнали
  pr: { shape: "r", t: "matrix(-1 0 0 1 100 0)" }, // чаша в зеркале, как реплика: о вас говорят
  events: { shape: "a" }, // треугольник, как сцена или шатёр
  brand: { shape: "k" }, // сама буква знака: вас узнают
  sales: { shape: "a", t: "rotate(180 50 50)" }, // перевёрнутый треугольник: воронка продаж
  digital: { shape: "u" }, // чаша, как корзина: есть где покупать
  team: { shape: "k", t: "rotate(90 50 50)" }, // блок с вырезом снизу, как ворота: есть кому работать
  invest: { shape: "r", t: "matrix(1 0 0 -1 0 100)" }, // чаша вверх ногами, кривая роста: чтобы расти
};

export function Piece({ cat, className, title }: { cat: CategoryId; className?: string; title?: string }) {
  const p = PIECES[cat];
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill="currentColor"
      data-piece={cat}
    >
      <path d={SHAPES[p.shape]} transform={p.t} />
    </svg>
  );
}
