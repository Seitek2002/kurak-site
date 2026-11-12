import type { CategoryId, Motif } from "@/content/services";
import { CATEGORY_INDEX } from "@/content/services";
import s from "./Patch.module.css";

/**
 * Лоскут: квадрат 100×100 из треугольников и полос, как в кыргызском курак-шитье.
 * Цвета берутся из --c / --c-deep родителя с data-cat, поэтому один и тот же
 * узор окрашивается в цвет направления. Пунктир по краю = стежки.
 */

type Props = {
  cat?: CategoryId;
  motif?: Motif;
  className?: string;
  /** без стежков: для мелких лоскутов в шапке */
  plain?: boolean;
  title?: string;
};

const C = s.c, D = s.d, L = s.l, K = s.k;

function shapes(m: Motif) {
  switch (m) {
    case "hourglass":
      return (
        <>
          <polygon className={C} points="0,0 100,0 50,50" />
          <polygon className={C} points="0,100 100,100 50,50" />
          <polygon className={L} points="0,0 0,100 50,50" />
          <polygon className={D} points="100,0 100,100 50,50" />
          <polygon className={K} points="50,38 62,50 50,62 38,50" />
        </>
      );
    case "diagonal":
      return (
        <>
          <rect className={L} width="100" height="100" />
          <polygon className={C} points="0,0 0,100 100,100" />
          <polygon className={D} points="0,0 16,0 100,84 100,100 84,100 0,16" />
          <polygon className={K} points="100,0 66,0 100,34" />
        </>
      );
    case "diamond":
      return (
        <>
          <rect className={D} width="100" height="100" />
          <polygon className={C} points="50,4 96,50 50,96 4,50" />
          <polygon className={L} points="50,27 73,50 50,73 27,50" />
          <rect className={K} x="44" y="44" width="12" height="12" transform="rotate(45 50 50)" />
        </>
      );
    case "geese":
      return (
        <>
          <rect className={L} width="100" height="100" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <polygon className={r === 1 ? D : C} points={`0,${r * 33.34 + 33.34} 50,${r * 33.34} 100,${r * 33.34 + 33.34}`} />
            </g>
          ))}
        </>
      );
    case "pinwheel":
      return (
        <>
          <rect className={L} width="100" height="100" />
          <polygon className={C} points="0,0 50,0 50,50" />
          <polygon className={D} points="100,0 100,50 50,50" />
          <polygon className={C} points="100,100 50,100 50,50" />
          <polygon className={D} points="0,100 0,50 50,50" />
        </>
      );
    case "strips":
      return (
        <>
          <rect className={C} width="100" height="100" />
          <rect className={D} y="20" width="100" height="14" />
          <rect className={L} y="34" width="100" height="10" />
          <rect className={K} y="56" width="100" height="6" />
          <rect className={D} y="74" width="100" height="26" />
          <polygon className={L} points="0,74 25,100 0,100" />
          <polygon className={L} points="100,74 75,100 100,100" />
        </>
      );
    case "checker":
      return (
        <>
          <rect className={C} width="100" height="100" />
          {Array.from({ length: 16 }, (_, i) => {
            const x = i % 4, y = Math.floor(i / 4);
            return (x + y) % 2 ? <rect key={i} className={D} x={x * 25} y={y * 25} width="25" height="25" /> : null;
          })}
          <polygon className={L} points="50,30 70,50 50,70 30,50" />
        </>
      );
    case "star":
      return (
        <>
          <rect className={L} width="100" height="100" />
          <rect className={C} x="33.34" y="33.34" width="33.33" height="33.33" />
          {/* восьмиконечная звезда «Огайо»: четыре квадрата из четвертушек */}
          <polygon className={D} points="33.34,0 66.67,0 50,33.34" />
          <polygon className={D} points="33.34,100 66.67,100 50,66.67" />
          <polygon className={D} points="0,33.34 0,66.67 33.34,50" />
          <polygon className={D} points="100,33.34 100,66.67 66.67,50" />
          <polygon className={C} points="33.34,0 50,33.34 33.34,33.34" />
          <polygon className={C} points="66.67,0 50,33.34 66.67,33.34" />
          <polygon className={C} points="33.34,100 50,66.67 33.34,66.67" />
          <polygon className={C} points="66.67,100 50,66.67 66.67,66.67" />
          <polygon className={C} points="0,33.34 33.34,50 33.34,33.34" />
          <polygon className={C} points="0,66.67 33.34,50 33.34,66.67" />
          <polygon className={C} points="100,33.34 66.67,50 66.67,33.34" />
          <polygon className={C} points="100,66.67 66.67,50 66.67,66.67" />
          <rect className={K} x="45" y="45" width="10" height="10" />
        </>
      );
  }
}

const MOTIFS: Motif[] = ["hourglass", "diagonal", "diamond", "geese", "pinwheel", "strips", "checker", "star"];

/** Восемь узоров описаны один раз на страницу; лоскуты ссылаются на них через <use>. */
export function PatchDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className={s.defs}>
      {MOTIFS.map((m) => (
        <symbol key={m} id={`motif-${m}`} viewBox="0 0 100 100" preserveAspectRatio="none">
          {shapes(m)}
        </symbol>
      ))}
    </svg>
  );
}

export function Patch({ cat, motif, className, plain, title }: Props) {
  const m = motif ?? (cat ? CATEGORY_INDEX[cat].motif : "hourglass");
  return (
    <svg
      viewBox="0 0 100 100"
      className={[s.patch, className].filter(Boolean).join(" ")}
      data-cat={cat}
      preserveAspectRatio="none"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable={title ? undefined : false}
    >
      <use href={`#motif-${m}`} width="100" height="100" />
      {!plain && <rect className={s.stitch} x="5" y="5" width="90" height="90" />}
    </svg>
  );
}
