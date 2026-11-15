import { KURAK_PATHS } from "../brand/KurakLogo";

/**
 * Графический язык варианта 5: пять фигур логотипа (K, U, R, A, K) по отдельности
 * и два бордюра из их геометрии: «тиштер» (зубцы, как край шырдака) и золотая зигзаг-нить.
 * Фигуры берутся из KURAK_PATHS без искажений: viewBox обрезан по каждой фигуре.
 */
const BOXES = ["0 6.5 82 86.5", "88 6.5 85 86.5", "181 6.5 74 86.5", "251.5 0 108 93", "361 6.5 82 86.5"] as const;

export function Shape({ i, turn = 0, className }: { i: number; turn?: number; className?: string }) {
  const k = ((i % 5) + 5) % 5;
  return (
    <svg
      viewBox={BOXES[k]}
      className={className}
      style={turn ? { rotate: `${turn}deg` } : undefined}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={KURAK_PATHS[k]} />
    </svg>
  );
}

/** Зубцы: ряд треугольников остриём вниз. Цвет = currentColor, ставится на стык двух секций */
export function Teeth({ id, className, size = 28 }: { id: string; className?: string; size?: number }) {
  const h = size / 2;
  return (
    <svg className={className} width="100%" height={h} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width={size} height={h} patternUnits="userSpaceOnUse">
          <path d={`M0 0H${size}L${size / 2} ${h}Z`} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height={h} fill={`url(#${id})`} />
    </svg>
  );
}

/** Золотая нить: тонкий зигзаг, бордюр рамок и разделитель */
export function Thread({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} width="100%" height="10" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="16" height="10" patternUnits="userSpaceOnUse">
          <path d="M0 9.5L8 0.5L16 9.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="10" fill={`url(#${id})`} />
    </svg>
  );
}

export function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconClose() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
