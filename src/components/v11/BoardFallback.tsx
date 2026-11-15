import s from "./BoardFallback.module.css";

/**
 * Доска без JavaScript: та же раскладка сверху (два ряда по девять лунок, по девять коргоолов, два казана).
 * С работающим скриптом её заменяет холст.
 */
export function BoardFallback({ className }: { className?: string }) {
  const holes = [];
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 9; i++) {
      const cx = 60 + i * 100;
      const cy = row === 0 ? 70 : 290;
      holes.push(
        <g key={`${row}-${i}`}>
          <circle cx={cx} cy={cy} r={40} className={s.hole} />
          {Array.from({ length: 9 }, (_, k) => (
            <circle key={k} cx={cx - 16 + (k % 3) * 16} cy={cy - 16 + Math.floor(k / 3) * 16} r={6.5} className={s.stone} />
          ))}
        </g>,
      );
    }
  return (
    <svg viewBox="-20 -10 940 380" className={[s.svg, className].filter(Boolean).join(" ")} aria-hidden="true" focusable="false">
      <rect x={-10} y={0} width={920} height={360} rx={40} className={s.slab} />
      <rect x={30} y={146} width={360} height={68} rx={34} className={s.hole} />
      <rect x={510} y={146} width={360} height={68} rx={34} className={s.hole} />
      {holes}
    </svg>
  );
}
