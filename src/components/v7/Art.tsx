import { KURAK_PATHS } from "@/components/brand/KurakLogo";

/**
 * Графика варианта 7: всё собрано из пяти фигур логотипа KURAK (блок с V-вырезом, полукруг, чаша R,
 * треугольник A). Цвета только через токены: stop-color и fill берут var(--v7-*).
 */

/* Фигуры логотипа, сдвинутые в начало координат: из них собираются иллюстрации и портреты */
export const SHAPE = {
  /** Блок с V-вырезом справа (буква K), 82 × 86.5 */
  k: { d: KURAK_PATHS[0], x: 0, y: 6.5, w: 82, h: 86.5 },
  /** Полукруг (буква U), 85 × 86.5 */
  u: { d: KURAK_PATHS[1], x: 88, y: 6.5, w: 85, h: 86.5 },
  /** Чаша (буква R), 74 × 86.5 */
  r: { d: KURAK_PATHS[2], x: 181, y: 6.5, w: 74, h: 86.5 },
  /** Треугольник (буква A), 108 × 93 */
  a: { d: KURAK_PATHS[3], x: 251.5, y: 0, w: 108, h: 93 },
} as const;
export type ShapeId = keyof typeof SHAPE;

const stop = (offset: string, token: string, opacity?: number) => (
  <stop offset={offset} style={{ stopColor: `var(${token})`, stopOpacity: opacity ?? 1 }} />
);

/** Общие градиенты «глянца» для всей страницы: объём фигурам даёт свет сверху слева */
export function ArtDefs() {
  const glossy = (id: string, glint: string, base: string, shade: string) => (
    <radialGradient id={id} cx="0.3" cy="0.22" r="0.95" fx="0.26" fy="0.16">
      {stop("0", glint)}
      {stop("0.42", base)}
      {stop("1", shade)}
    </radialGradient>
  );
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {glossy("v7g-red", "--v7-red-glint", "--v7-red", "--v7-red-side")}
        {glossy("v7g-cream", "--v7-paper", "--v7-cream", "--v7-cream-deep")}
        {glossy("v7g-saffron", "--v7-paper", "--v7-saffron", "--v7-espresso")}
        {glossy("v7g-cobalt", "--v7-on-dark-3", "--v7-cobalt", "--v7-graphite-deep")}
        {glossy("v7g-teal", "--v7-on-dark-3", "--v7-teal", "--v7-graphite-deep")}
        {glossy("v7g-graphite", "--v7-graphite-line", "--v7-graphite-up", "--v7-graphite-deep")}
        <linearGradient id="v7g-shine" x1="0" y1="0" x2="0" y2="1">
          {stop("0", "--v7-gloss")}
          {stop("0.5", "--v7-gloss-0")}
        </linearGradient>
      </defs>
    </svg>
  );
}

type Fill = "red" | "cream" | "saffron" | "cobalt" | "teal" | "graphite";
const g = (f: Fill) => `url(#v7g-${f})`;

/** Фигура логотипа в нужном месте: x, y — левый верхний угол, s — масштаб, rot — поворот вокруг центра */
export function Shape({ id, x, y, s = 1, rot = 0, fill, shine = true, className }: { id: ShapeId; x: number; y: number; s?: number; rot?: number; fill: Fill; shine?: boolean; className?: string }) {
  const sh = SHAPE[id];
  const cx = (sh.w * s) / 2;
  const cy = (sh.h * s) / 2;
  const t = `translate(${x} ${y}) rotate(${rot} ${cx} ${cy}) scale(${s}) translate(${-sh.x} ${-sh.y})`;
  return (
    <g transform={t} className={className}>
      <path d={sh.d} fill={g(fill)} />
      {shine ? <path d={sh.d} fill="url(#v7g-shine)" opacity="0.5" /> : null}
    </g>
  );
}

/** Четырёхлучевая искра, декор как на референсе */
export function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 0C12.7 6.4 17.6 11.3 24 12C17.6 12.7 12.7 17.6 12 24C11.3 17.6 6.4 12.7 0 12C6.4 11.3 11.3 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Стрелка ↗ для круглых кнопок и строк-ссылок */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M8.5 7H17V15.5" />
    </svg>
  );
}

/** Стрелка → для таблеток */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12H20M14 6L20 12L14 18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Иллюстрации к белым карточкам: персонажи из геометрии логотипа        */
/* ------------------------------------------------------------------ */

const eyes = (x: number, y: number, gap = 16, r = 5) => (
  <g style={{ fill: "var(--v7-ink)" }}>
    <circle cx={x} cy={y} r={r} />
    <circle cx={x + gap} cy={y} r={r} />
    <circle cx={x + 1.6} cy={y - 1.8} r={r * 0.32} style={{ fill: "var(--v7-paper)" }} />
    <circle cx={x + gap + 1.6} cy={y - 1.8} r={r * 0.32} style={{ fill: "var(--v7-paper)" }} />
  </g>
);

const stitch = (d: string, token = "--v7-cream") => (
  <path d={d} fill="none" style={{ stroke: `var(${token})` }} strokeWidth="2.4" strokeDasharray="7 6" strokeLinecap="round" />
);

/** Полный цикл: лоскуты-фигуры сшиты в одну башенку, сверху пришивают ещё одну. Иголка с ниткой. */
export function ArtCycle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="128" cy="244" rx="78" ry="9" style={{ fill: "var(--v7-shadow)" }} />
      <Shape id="k" x={78} y={160} s={1} fill="red" />
      {stitch("M80 160H158")}
      <Shape id="u" x={72} y={78} s={1.08} rot={0} fill="cream" />
      {eyes(104, 104, 26, 6)}
      <path d="M106 128q8 8 20 0" fill="none" style={{ stroke: "var(--v7-ink)" }} strokeWidth="3" strokeLinecap="round" />
      {stitch("M74 80H166")}
      <Shape id="a" x={86} y={14} s={0.64} rot={-8} fill="saffron" />
      {/* Летящая чаша R, которую пришивают ниткой */}
      <Shape id="r" x={186} y={44} s={0.58} rot={18} fill="cobalt" />
      <path d="M204 92C214 132 198 160 166 170" fill="none" style={{ stroke: "var(--v7-cream)" }} strokeWidth="2" strokeDasharray="5 6" />
      {/* Иголка */}
      <g transform="rotate(-38 40 70)">
        <rect x="14" y="66" width="70" height="7" rx="3.5" style={{ fill: "var(--v7-on-dark-2)" }} />
        <path d="M84 66L100 69.5L84 73Z" style={{ fill: "var(--v7-on-dark-2)" }} />
        <rect x="20" y="68" width="12" height="3" rx="1.5" style={{ fill: "var(--v7-graphite)" }} />
      </g>
      <path d="M30 96C18 140 40 170 78 176" fill="none" style={{ stroke: "var(--v7-red)" }} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/** Ивенты и тои: юрта. Купол-полукруг и стены с треугольным входом (треугольник A), тундук, флажки, конфетти */
export function ArtEvents({ className }: { className?: string }) {
  const flags: [number, number, Fill][] = [
    [22, 70, "red"],
    [52, 86, "saffron"],
    [84, 97, "cream"],
    [118, 101, "cobalt"],
    [152, 99, "red"],
    [186, 91, "saffron"],
    [216, 77, "cream"],
  ];
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="130" cy="232" rx="104" ry="10" style={{ fill: "var(--v7-shadow)" }} />
      {/* Гирлянда флажков-треугольников */}
      <path d="M6 58Q130 128 254 58" fill="none" style={{ stroke: "var(--v7-on-dark-2)" }} strokeWidth="2" />
      {flags.map(([x, y, f], i) => (
        <Shape key={i} id="a" x={x} y={y - 4} s={0.2} rot={180} fill={f} shine={false} />
      ))}
      {/* Стены: блок с треугольным входом */}
      <path d="M40 160H220V224H152L130 182L108 224H40Z" fill={g("red")} />
      <path d="M40 160H220V224H152L130 182L108 224H40Z" fill="url(#v7g-shine)" opacity="0.35" />
      {/* Узор стены: строчка */}
      <path d="M48 172H212" fill="none" style={{ stroke: "var(--v7-cream)" }} strokeWidth="2.4" strokeDasharray="7 6" strokeLinecap="round" />
      {/* Купол: полукруг, как чаша U вверх дном */}
      <path d="M30 162A100 74 0 0 1 230 162Z" fill={g("cream")} />
      <path d="M52 158A80 56 0 0 1 208 158" fill="none" style={{ stroke: "var(--v7-red)" }} strokeWidth="3" strokeDasharray="9 7" strokeLinecap="round" />
      <path d="M86 156Q96 116 130 92M174 156Q164 116 130 92M130 156V96" fill="none" style={{ stroke: "var(--v7-cream-deep)" }} strokeWidth="2.4" strokeLinecap="round" />
      {/* Тундук */}
      <circle cx="130" cy="88" r="15" style={{ fill: "var(--v7-red)" }} />
      <path d="M117 88H143M130 75V101M121 79L139 97M139 79L121 97" style={{ stroke: "var(--v7-cream)" }} strokeWidth="2.4" strokeLinecap="round" />
      {/* Вход */}
      <path d="M108 224L130 182L152 224Z" style={{ fill: "var(--v7-graphite-deep)" }} />
      {/* Конфетти */}
      <circle cx="24" cy="132" r="5" style={{ fill: "var(--v7-saffron)" }} />
      <circle cx="240" cy="122" r="6" style={{ fill: "var(--v7-red)" }} />
      <rect x="228" y="182" width="10" height="10" rx="2" transform="rotate(24 233 187)" style={{ fill: "var(--v7-cream)" }} />
      <rect x="14" y="190" width="9" height="9" rx="2" transform="rotate(-18 18 194)" style={{ fill: "var(--v7-cobalt)" }} />
    </svg>
  );
}

/** Продажи и CRM: заявки-шарики падают в воронку-треугольник и собираются в чаше, ничего не теряется */
export function ArtSales({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="130" cy="242" rx="70" ry="8" style={{ fill: "var(--v7-shadow)" }} />
      {/* Шарики-заявки */}
      <circle cx="84" cy="22" r="11" fill={g("red")} />
      <circle cx="130" cy="12" r="9" fill={g("saffron")} />
      <circle cx="170" cy="30" r="12" fill={g("cobalt")} />
      <circle cx="112" cy="46" r="8" fill={g("teal")} />
      {/* Воронка: перевёрнутый треугольник A */}
      <Shape id="a" x={52} y={58} s={1.45} rot={180} fill="cream" />
      {stitch("M66 66H194", "--v7-red")}
      {eyes(112, 94, 26, 6)}
      <path d="M118 112q12 9 22 0" fill="none" style={{ stroke: "var(--v7-ink)" }} strokeWidth="3" strokeLinecap="round" />
      {/* Чаша U, куда падают заявки */}
      <Shape id="u" x={88} y={172} s={0.98} fill="red" />
      <circle cx="116" cy="186" r="9" fill={g("saffron")} />
      <circle cx="138" cy="183" r="10" fill={g("cobalt")} />
      <circle cx="158" cy="188" r="8" fill={g("teal")} />
      {/* Галочки «прочитано» */}
      <path d="M196 214l8 8 14-16M208 222l2 2 14-16" fill="none" style={{ stroke: "var(--v7-on-dark-2)" }} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Сайты: окно браузера, макет страницы собран из фигур, курсор-треугольник жмёт «купить» */
export function ArtDigital({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} aria-hidden="true" focusable="false">
      <ellipse cx="130" cy="236" rx="96" ry="9" style={{ fill: "var(--v7-shadow)" }} />
      <rect x="24" y="40" width="212" height="176" rx="22" fill={g("graphite")} />
      <rect x="24" y="40" width="212" height="34" rx="17" style={{ fill: "var(--v7-graphite-line)" }} />
      <circle cx="44" cy="57" r="5" style={{ fill: "var(--v7-red)" }} />
      <circle cx="60" cy="57" r="5" style={{ fill: "var(--v7-saffron)" }} />
      <circle cx="76" cy="57" r="5" style={{ fill: "var(--v7-on-dark-3)" }} />
      <rect x="40" y="88" width="180" height="112" rx="12" style={{ fill: "var(--v7-cream)" }} />
      <Shape id="k" x={52} y={100} s={0.62} fill="red" />
      <Shape id="u" x={112} y={100} s={0.62} fill="cobalt" />
      <rect x="168" y="104" width="40" height="8" rx="4" style={{ fill: "var(--v7-ink-3)" }} />
      <rect x="168" y="120" width="30" height="8" rx="4" style={{ fill: "var(--v7-ink-3)" }} />
      <rect x="52" y="166" width="96" height="22" rx="11" style={{ fill: "var(--v7-red)" }} />
      <rect x="64" y="174" width="52" height="6" rx="3" style={{ fill: "var(--v7-cream)" }} />
      {/* Курсор: треугольник A */}
      <Shape id="a" x={128} y={168} s={0.44} rot={-28} fill="saffron" />
      <path d="M118 158l-8-8M128 152v-11M106 172H95" style={{ stroke: "var(--v7-saffron)" }} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Telegram-канал: бумажный самолётик из треугольников и шов-траектория */
export function ArtPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 200" className={className} aria-hidden="true" focusable="false">
      <path d="M10 186C52 178 64 140 98 142C132 144 128 112 150 104" fill="none" style={{ stroke: "var(--v7-red)" }} strokeWidth="2.6" strokeDasharray="8 7" strokeLinecap="round" />
      {/* Верхнее крыло */}
      <path d="M70 96L246 26L130 122Z" fill={g("cream")} />
      {/* Нижний сгиб */}
      <path d="M130 122L246 26L168 168Z" fill={g("red")} />
      {/* Складка под крылом */}
      <path d="M130 122L142 150L168 168Z" style={{ fill: "var(--v7-red-shade)" }} />
      <ellipse cx="160" cy="190" rx="54" ry="6" style={{ fill: "var(--v7-shadow)" }} />
    </svg>
  );
}

/** Знак для круглого бейджа карточки на первом экране */
export function BadgeMark({ id, className }: { id: ShapeId; className?: string }) {
  const sh = SHAPE[id];
  return (
    <svg viewBox={`${sh.x} ${sh.y} ${sh.w} ${sh.h}`} className={className} aria-hidden="true" focusable="false">
      <path d={sh.d} fill="currentColor" />
    </svg>
  );
}
