import type { CategoryId } from "@/content/services";

/**
 * Лоскуты варианта 13. Все в цветах логотипа: основа красная, узор из фигур знака KURAK
 * (треугольник A, чаша U, срез K, полукруг R) кремом, мареной, чернилами или песком.
 * Узоры — SVG-паттерны с единицами пользователя: полоса знака шириной 443/8 вмещает ровно три плитки,
 * поэтому швы лоскутов в знаке совпадают с краями плиток (четыре плитки на полосу). Цвета задают классы из v13.css (токены).
 */
export type PatchKind = CategoryId | "plan" | "calc";

/** Ширина полосы знака: 443 / 8 */
export const STRIP = 443 / 8;
const TILE = STRIP / 4;
const K = TILE / 20;

function Motif({ kind }: { kind: PatchKind }) {
  switch (kind) {
    case "smm": // «Чтобы о вас узнали»: летящие треугольники
      return <polygon className="v13-pc" points="0,20 10,10 20,20" />;
    case "pr": // «Чтобы о вас говорили»: чаша U, как открытое ухо
      return <path className="v13-pm" d="M5 4h10v6a5 5 0 0 1-10 0Z" />;
    case "events": // «Чтобы вас увидели вживую»: треугольник A, сцена
      return <polygon className="v13-pk" points="10,3 17,16 3,16" />;
    case "brand": // «Чтобы вас узнавали»: блок со срезом, как K
      return <polygon className="v13-pc" points="5,5 15,5 11,10 15,15 5,15" />;
    case "sales": // «Чтобы покупали»: чаша R
      return <path className="v13-pm" d="M0 0h12a12 12 0 0 1-12 12Z" />;
    case "digital": // «Чтобы было где покупать»: пиксели экрана
      return (
        <>
          <rect className="v13-ps" x="2" y="2" width="7" height="7" />
          <rect className="v13-ps" x="11" y="11" width="7" height="7" />
        </>
      );
    case "team": // «Чтобы было кому работать»: вертушка из четырёх
      return <polygon className="v13-pk" points="4,4 10,4 10,10 16,4 16,10 10,10 16,16 10,16 10,10 4,16 4,10 10,10" />;
    case "invest": // «Чтобы расти»: ступени
      return (
        <>
          <rect className="v13-pm" x="2" y="14" width="4" height="4" />
          <rect className="v13-pm" x="8" y="9" width="4" height="9" />
          <rect className="v13-pm" x="14" y="4" width="4" height="14" />
        </>
      );
    case "plan": // план из опроса: строки списка
      return (
        <>
          <rect className="v13-pr" x="3" y="4" width="14" height="2.5" />
          <rect className="v13-pr" x="3" y="9" width="9" height="2.5" />
          <rect className="v13-pr" x="3" y="14" width="12" height="2.5" />
        </>
      );
    case "calc": // расчёт: знаки умножения
      return <path className="v13-pr" d="M5 3.5 10 8.5 15 3.5 16.5 5 11.5 10 16.5 15 15 16.5 10 11.5 5 16.5 3.5 15 8.5 10 3.5 5Z" />;
  }
}

const BASE: Record<PatchKind, string> = {
  smm: "v13-pr", pr: "v13-pr", events: "v13-pr", brand: "v13-pr", sales: "v13-pr", digital: "v13-pr", team: "v13-pr", invest: "v13-pr",
  plan: "v13-ps", calc: "v13-ps",
};

const KINDS: PatchKind[] = ["smm", "pr", "events", "brand", "sales", "digital", "team", "invest", "plan", "calc"];

export const patId = (kind: PatchKind) => `v13-pat-${kind}`;

/** Определения узоров: один раз на страницу, остальные SVG ссылаются на них по id */
export function PatchDefs() {
  return (
    <svg className="v13-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        {KINDS.map((kind) => (
          <pattern key={kind} id={patId(kind)} patternUnits="userSpaceOnUse" width={TILE} height={TILE}>
            <g transform={`scale(${K})`}>
              <rect className={BASE[kind]} width="20" height="20" />
              <Motif kind={kind} />
            </g>
          </pattern>
        ))}
      </defs>
    </svg>
  );
}

/** Квадратный лоскут: 4 × 4 плитки узора. stitch — пунктирный шов по краю */
export function Patch({ kind, className, stitch }: { kind: PatchKind; className?: string; stitch?: boolean }) {
  return (
    <svg viewBox={`0 0 ${STRIP} ${STRIP}`} className={["v13-patch", className].filter(Boolean).join(" ")} aria-hidden="true" focusable="false">
      <rect width={STRIP} height={STRIP} fill={`url(#${patId(kind)})`} />
      {stitch && <rect className="v13-stitch" x="4" y="4" width={STRIP - 8} height={STRIP - 8} pathLength="100" />}
    </svg>
  );
}
