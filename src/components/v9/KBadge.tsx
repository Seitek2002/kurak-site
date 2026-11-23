import type { CategoryId } from "@/content/services";

/**
 * Курак-значки варианта 9: маленькие квадратные лоскуты, по одному на направление.
 * Узоры из треугольников и ромбов, как в курак-шитье и в геометрии знака KURAK (треугольник A, срез K).
 * Основа лоскута всегда красная, марена или песок, поэтому значок виден и на чёрном, и на креме.
 * Цвета: классы kb-* в src/app/v9/v9.css (токены --v9-kb-*). Значки декоративные (aria-hidden).
 */
export type BadgeId = CategoryId;

export const BADGE_ORDER: BadgeId[] = ["smm", "pr", "events", "brand", "sales", "digital", "team", "invest"];

function Motif({ id }: { id: BadgeId }) {
  switch (id) {
    case "smm": // «Чтобы о вас узнали»: летящие гуси, два треугольника вверх
      return (
        <>
          <rect className="kb-sand" width="24" height="24" />
          <polygon className="kb-red" points="0,12 12,0 24,12" />
          <polygon className="kb-deep" points="0,24 12,12 24,24" />
        </>
      );
    case "pr": // «Чтобы о вас говорили»: песочные часы с ромбом в центре
      return (
        <>
          <rect className="kb-red" width="24" height="24" />
          <polygon className="kb-paper" points="0,0 24,0 12,12" />
          <polygon className="kb-paper" points="0,24 24,24 12,12" />
          <polygon className="kb-deep" points="12,7 17,12 12,17 7,12" />
        </>
      );
    case "events": // «Чтобы вас увидели вживую»: треугольник A, сцена
      return (
        <>
          <rect className="kb-deep" width="24" height="24" />
          <polygon className="kb-sand" points="12,2.5 22.5,21.5 1.5,21.5" />
          <polygon className="kb-red" points="12,11 17,21.5 7,21.5" />
        </>
      );
    case "brand": // «Чтобы вас узнавали»: ромб в квадрате
      return (
        <>
          <rect className="kb-red" width="24" height="24" />
          <polygon className="kb-paper" points="12,2 22,12 12,22 2,12" />
          <polygon className="kb-deep" points="12,7 17,12 12,17 7,12" />
        </>
      );
    case "sales": // «Чтобы покупали»: вертушка из четырёх треугольников
      return (
        <>
          <rect className="kb-sand" width="24" height="24" />
          <polygon className="kb-red" points="0,0 12,0 12,12" />
          <polygon className="kb-deep" points="24,0 24,12 12,12" />
          <polygon className="kb-red" points="24,24 12,24 12,12" />
          <polygon className="kb-deep" points="0,24 0,12 12,12" />
        </>
      );
    case "digital": // «Чтобы было где покупать»: клетки экрана, две из них разрезаны по диагонали
      return (
        <>
          <rect className="kb-deep" width="24" height="24" />
          <rect className="kb-red" width="12" height="12" />
          <rect className="kb-red" x="12" y="12" width="12" height="12" />
          <polygon className="kb-paper" points="12,0 24,0 12,12" />
          <polygon className="kb-sand" points="24,0 24,12 12,12" />
          <polygon className="kb-sand" points="0,12 12,12 0,24" />
          <polygon className="kb-paper" points="12,12 12,24 0,24" />
        </>
      );
    case "team": // «Чтобы было кому работать»: диагональная полоса, два лоскута сшиты одним швом
      return (
        <>
          <rect className="kb-red" width="24" height="24" />
          <polygon className="kb-sand" points="0,0 17,0 0,17" />
          <polygon className="kb-deep" points="17,0 24,0 0,24 0,17" />
        </>
      );
    case "invest": // «Чтобы расти»: шеврон вверх над треугольником
      return (
        <>
          <rect className="kb-sand" width="24" height="24" />
          <polygon className="kb-red" points="0,24 12,13 24,24" />
          <polygon className="kb-deep" points="0,13 12,2 24,13 24,19 12,8 0,19" />
        </>
      );
  }
}

/** Значок-лоскут направления. stitched: пунктирный стежок по краю, для значков от 32 px. */
export function KBadge({ id, className, stitched }: { id: BadgeId; className?: string; stitched?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={["kb", className].filter(Boolean).join(" ")} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      <Motif id={id} />
      {stitched && <rect className="kb-stitch" x="1.6" y="1.6" width="20.8" height="20.8" shapeRendering="geometricPrecision" />}
    </svg>
  );
}

/** Мини-курак: восемь лоскутов направлений, сшитых в один блок (4 × 2 или 8 в ряд) */
export function MiniQuilt({ className, cols = 4 }: { className?: string; cols?: 4 | 8 }) {
  const rows = BADGE_ORDER.length / cols;
  return (
    <svg viewBox={`0 0 ${cols * 24} ${rows * 24}`} className={["kb", className].filter(Boolean).join(" ")} aria-hidden="true" focusable="false" shapeRendering="crispEdges">
      {BADGE_ORDER.map((id, i) => (
        <g key={id} transform={`translate(${(i % cols) * 24} ${Math.floor(i / cols) * 24})`}>
          <Motif id={id} />
        </g>
      ))}
      <rect className="kb-stitch" x="1.6" y="1.6" width={cols * 24 - 3.2} height={rows * 24 - 3.2} shapeRendering="geometricPrecision" />
    </svg>
  );
}
