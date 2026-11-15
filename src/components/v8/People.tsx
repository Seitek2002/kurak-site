/**
 * Команда в 2D, как просит концепция: каждый человек — отдельный персонаж из простых фигур,
 * общая сцена собирается из них. Уходит человек — убираем одного персонажа, приходит — дорисовываем одного.
 * Это эскизы-заглушки: финальные 2D-иллюстрации нарисует агентство в том же принципе.
 *
 * Холст персонажа 160 × 300, голова в одной точке у всех, поэтому сцену и аватарки можно кадрировать одинаково.
 */

type Skin = "a" | "b" | "c";

function Face({ skin, glasses = false }: { skin: Skin; glasses?: boolean }) {
  return (
    <>
      <rect x="71" y="106" width="18" height="22" rx="7" className={`f-skin-${skin}`} />
      <circle cx="51" cy="88" r="6.5" className={`f-skin-${skin}`} />
      <circle cx="109" cy="88" r="6.5" className={`f-skin-${skin}`} />
      <circle cx="80" cy="84" r="30" className={`f-skin-${skin}`} />
      <circle cx="69" cy="88" r="3.4" className="f-ink" />
      <circle cx="91" cy="88" r="3.4" className="f-ink" />
      <circle cx="63" cy="98" r="5" className="f-cheek" opacity="0.55" />
      <circle cx="97" cy="98" r="5" className="f-cheek" opacity="0.55" />
      <path d="M72 100 q8 7 16 0" className="s-ink" strokeWidth="3" />
      {glasses ? <path d="M61 88 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M83 88 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M77 87 h6" className="s-ink" strokeWidth="2.6" /> : null}
    </>
  );
}

function Legs({ pants, shoes = "f-ink" }: { pants: string; shoes?: string }) {
  return (
    <>
      <path d="M68 210 L66 278 M92 210 L94 278" className={pants} strokeWidth="18" />
      <ellipse cx="60" cy="284" rx="15" ry="7.5" className={shoes} />
      <ellipse cx="100" cy="284" rx="15" ry="7.5" className={shoes} />
    </>
  );
}

const TORSO = "M46 156 Q46 126 72 124 H88 Q114 126 114 156 V222 Q114 230 106 230 H54 Q46 230 46 222 Z";

/** Оксана: проект-менеджер и маркетолог. Красный пиджак, планшет с планом */
export function Oksana() {
  return (
    <g>
      <path d="M48 84 Q46 46 80 48 Q114 46 112 84 L116 150 Q80 160 44 150 Z" className="f-hair-a" />
      <Legs pants="s-denim" />
      <path d={TORSO} className="f-red" />
      <path d="M70 124 L80 146 L90 124 Z" className="f-white" />
      <path d="M53 140 Q38 176 44 206" className="s-red" strokeWidth="16" />
      <circle cx="44" cy="210" r="8.5" className="f-skin-a" />
      <Face skin="a" />
      <path d="M50 82 Q52 52 80 52 Q108 52 110 80 Q92 74 82 60 Q70 76 50 82 Z" className="f-hair-a" />
      <g transform="rotate(-8 104 174)">
        <rect x="84" y="148" width="40" height="52" rx="6" className="f-white" />
        <rect x="96" y="144" width="16" height="8" rx="3" className="f-ink" />
        <rect x="91" y="160" width="26" height="4" rx="2" className="f-grey" />
        <rect x="91" y="169" width="20" height="4" rx="2" className="f-grey" />
        <path d="M91 182 l4 4 7-8" className="s-red" strokeWidth="3" />
      </g>
      <path d="M107 140 Q126 160 112 178" className="s-red" strokeWidth="16" />
      <circle cx="110" cy="180" r="8.5" className="f-skin-a" />
    </g>
  );
}

/** Бибинур: руководитель ивент-отдела. Платье-треугольник, как буква A логотипа, микрофон */
export function Bibinur() {
  return (
    <g>
      <path d="M70 212 L68 278 M90 212 L92 278" className="s-hair-a" strokeWidth="14" />
      <ellipse cx="62" cy="284" rx="14" ry="7" className="f-red" />
      <ellipse cx="98" cy="284" rx="14" ry="7" className="f-red" />
      <path d="M66 124 H94 Q100 124 102 130 L126 228 Q127 236 119 236 H41 Q33 236 34 228 L58 130 Q60 124 66 124 Z" className="f-sun" />
      <path d="M44 196 H116" className="s-coral" strokeWidth="5" />
      <path d="M58 140 Q42 170 48 200" className="s-sun" strokeWidth="15" />
      <circle cx="48" cy="204" r="8.5" className="f-skin-b" />
      <Face skin="b" />
      <circle cx="80" cy="44" r="15" className="f-hair-b" />
      <path d="M50 86 Q48 52 80 54 Q112 52 110 86 Q104 70 92 64 Q76 72 50 86 Z" className="f-hair-b" />
      <path d="M102 140 Q130 124 128 96" className="s-sun" strokeWidth="15" />
      <circle cx="128" cy="96" r="8.5" className="f-skin-b" />
      <rect x="124" y="70" width="9" height="26" rx="4" className="f-ink" />
      <circle cx="128.5" cy="66" r="9" className="f-grey" />
    </g>
  );
}

/** Нурчик: ведущий дизайнер. Мятное худи, очки и большой карандаш */
export function Nurchik() {
  return (
    <g>
      <Legs pants="s-hair-a" shoes="f-white" />
      <ellipse cx="80" cy="128" rx="26" ry="10" className="f-mint" />
      <path d={TORSO} className="f-mint" />
      <path d="M74 136 V158 M86 136 V158" className="s-white" strokeWidth="3" />
      <rect x="62" y="186" width="36" height="18" rx="6" className="f-white" opacity="0.4" />
      <path d="M53 142 Q40 178 46 208" className="s-mint" strokeWidth="16" />
      <circle cx="46" cy="212" r="8.5" className="f-skin-c" />
      <Face skin="c" glasses />
      <path d="M48 96 Q44 50 80 50 Q116 50 112 96 Q110 74 100 66 Q84 74 60 70 Q52 80 48 96 Z" className="f-hair-a" />
      <g transform="rotate(-38 118 150)">
        <rect x="110" y="96" width="16" height="96" rx="3" className="f-sun" />
        <rect x="110" y="96" width="16" height="12" rx="3" className="f-pink" />
        <path d="M110 192 L118 210 L126 192 Z" className="f-butter" />
        <path d="M115.5 204 L118 210 L120.5 204 Z" className="f-ink" />
      </g>
      <path d="M107 142 Q124 168 112 184" className="s-mint" strokeWidth="16" />
      <circle cx="112" cy="186" r="8.5" className="f-skin-c" />
    </g>
  );
}

/** Руководитель SMM: кудри, розовый свитер, телефон для сторис */
export function SmmLead() {
  return (
    <g>
      <Legs pants="s-denim" shoes="f-red" />
      <path d={TORSO} className="f-pink" />
      <path d="M50 200 H110" className="s-white" strokeWidth="4" opacity="0.7" />
      <path d="M107 142 Q120 176 114 206" className="s-pink" strokeWidth="16" />
      <circle cx="114" cy="210" r="8.5" className="f-skin-b" />
      <Face skin="b" />
      {[
        [56, 66, 13],
        [70, 56, 14],
        [88, 54, 14],
        [104, 64, 13],
        [110, 80, 9],
        [50, 80, 9],
        [80, 62, 12],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} className="f-hair-b" />
      ))}
      <path d="M53 140 Q30 122 36 92" className="s-pink" strokeWidth="16" />
      <circle cx="36" cy="90" r="8.5" className="f-skin-b" />
      <rect x="25" y="58" width="20" height="34" rx="5" className="f-ink" />
      <rect x="28" y="62" width="14" height="24" rx="2" className="f-sky" />
    </g>
  );
}

/** Руководитель PR: короткая стрижка, коралловый пиджак, рупор */
export function PrLead() {
  return (
    <g>
      <Legs pants="s-hair-a" />
      <path d={TORSO} className="f-coral" />
      <path d="M70 124 L80 150 L90 124 Z" className="f-white" />
      <path d="M53 142 Q40 178 46 208" className="s-coral" strokeWidth="16" />
      <circle cx="46" cy="212" r="8.5" className="f-skin-a" />
      <Face skin="a" />
      <path d="M50 84 Q46 52 76 50 Q100 44 112 66 Q114 76 110 84 Q104 66 88 64 Q70 70 50 84 Z" className="f-hair-a" />
      <path d="M107 142 Q124 160 118 176" className="s-coral" strokeWidth="16" />
      <g>
        <rect x="108" y="166" width="14" height="22" rx="5" className="f-ink" />
        <path d="M116 160 L146 144 V194 L116 180 Z" className="f-red" />
        <ellipse cx="146" cy="169" rx="6" ry="25" className="f-white" opacity="0.5" />
      </g>
      <circle cx="116" cy="178" r="8.5" className="f-skin-a" />
    </g>
  );
}

const FIGURES: Record<string, React.ReactElement> = {
  oksana: <Oksana />,
  bibinur: <Bibinur />,
  nurchik: <Nurchik />,
  "smm-lead": <SmmLead />,
  "pr-lead": <PrLead />,
};

/** Весь персонаж (для сцены) или портрет по плечи (для карточки и «Ведёт» в меню) */
/** Персонаж по id (содержимое SVG 160 × 300); незнакомый id рисует проект-менеджера */
export const figure = (id: string) => FIGURES[id] ?? FIGURES.oksana;

export function Person({ id, bust = false, className }: { id: string; bust?: boolean; className?: string }) {
  return (
    <svg viewBox={bust ? "22 26 116 116" : "0 0 160 300"} className={className} aria-hidden="true" focusable="false">
      {figure(id)}
    </svg>
  );
}
