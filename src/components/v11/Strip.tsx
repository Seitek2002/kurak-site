import { korgoolSpots, markSpots } from "./data";
import s from "./Strip.module.css";

/**
 * Ряд из девяти лунок нашей стороны: схема для дебютов, кейсов, игроков и заявки.
 * counts: сколько коргоолов в лунке; marks: номера ходов на коргоолах (для дебютов); lit: подсвеченные лунки.
 */
export function Strip({
  counts,
  lit,
  marks,
  labels,
  size = "m",
  className,
  label,
}: {
  counts?: number[];
  lit?: boolean[];
  marks?: (number[] | undefined)[];
  labels?: string[];
  size?: "xs" | "s" | "m" | "l";
  className?: string;
  /** Текстовая альтернатива схемы; без неё схема скрыта от скринридеров */
  label?: string;
}) {
  return (
    <div
      className={[s.strip, s[size], className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const n = counts?.[i] ?? 0;
        const m = marks?.[i];
        const spots = m && m.length ? markSpots(m.length) : korgoolSpots(Math.min(n, 7));
        return (
          <span key={i} className={s.cell} data-lit={lit?.[i] || n > 0 ? "" : undefined}>
            <span className={s.pit}>
              {spots.map((p, k) => (
                <span
                  key={k}
                  className={s.k}
                  data-mark={m?.[k] !== undefined ? "" : undefined}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {m?.[k] !== undefined ? m[k] : null}
                </span>
              ))}
            </span>
            {labels ? <span className={s.name}>{labels[i]}</span> : null}
          </span>
        );
      })}
    </div>
  );
}
