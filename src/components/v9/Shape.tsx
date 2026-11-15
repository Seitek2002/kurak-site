import { KURAK_PATHS } from "@/components/brand/KurakLogo";

/** Рамки пяти фигур логотипа: K, U, R, A, K. Каждая фигура рисуется отдельно, без искажений. */
const BOXES = ["0 6.5 82 86.5", "88 6.5 85 86.5", "181 6.5 74 86.5", "251.5 0 108 93", "361 6.5 82 86.5"] as const;

/** Одна фигура из геометрии логотипа: блок с V-вырезом, полукруг, чаша, треугольник. Цвет = currentColor. */
export function Shape({ i, className }: { i: number; className?: string }) {
  const k = ((i % 5) + 5) % 5;
  return (
    <svg viewBox={BOXES[k]} className={className} aria-hidden="true" focusable="false" fill="currentColor" preserveAspectRatio="xMidYMid meet">
      <path d={KURAK_PATHS[k]} />
    </svg>
  );
}

/** Знак шапки и подвала: первая буква K логотипа */
export function KMark({ className }: { className?: string }) {
  return <Shape i={0} className={className} />;
}
