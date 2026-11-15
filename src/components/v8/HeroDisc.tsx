import { CATEGORIES, type Lang } from "@/content/kurak";
import { V8 } from "@/content/v8";
import { Glyph } from "./Art";
import s from "./V8.module.css";

/**
 * Первый экран: круг-курак из восьми лоскутов, по лоскуту на направление.
 * Как пицца из половинок, только из услуг: каждый лоскут ведёт в свой раздел меню.
 * При загрузке лоскуты один раз «сшиваются» к центру (единственная анимация без действия человека).
 */
const C = 200;
const R = 188;
const R_IN = 66;
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [+(C + r * Math.cos(a)).toFixed(2), +(C + r * Math.sin(a)).toFixed(2)] as const;
};

const BASE = ["f-red", "f-sun", "f-pink", "f-coral", "f-butter", "f-sky", "f-mint", "f-rim"];

const ICONS: React.ReactNode[] = [
  <path key="smm" d="M0 9C-11 2-10-7-4-7c2 0 3.5 1.5 4 3 .5-1.5 2-3 4-3 6 0 7 9-4 16z" className="f-red" />,
  <g key="pr">
    <path d="M-11-3h5L7-10V10L-6 3h-5z" className="f-red" />
    <path d="M-6 4l2 6" className="s-red" strokeWidth="3" />
  </g>,
  <g key="ev">
    <ellipse cx="0" cy="-3" rx="7.5" ry="9.5" className="f-red" />
    <path d="M0 6.5q-3 4 1 7" className="s-red" strokeWidth="2" />
  </g>,
  <Glyph key="br" i={0} x={-8.5} y={-10.5} s={0.2} c="f-red" />,
  <path key="sa" d="M-11-8h22L3 2v8l-6-3V2z" className="f-red" />,
  <g key="di">
    <rect x="-11" y="-8" width="22" height="16" rx="3" className="s-red" strokeWidth="2.5" />
    <path d="M-11-3h22" className="s-red" strokeWidth="2.5" />
  </g>,
  <g key="te">
    <circle cx="0" cy="-5" r="4.5" className="f-red" />
    <path d="M-8.5 9a8.5 7.5 0 0 1 17 0z" className="f-red" />
  </g>,
  <g key="in">
    <rect x="-10" y="1" width="5" height="8" rx="1" className="f-red" />
    <rect x="-2.5" y="-4" width="5" height="13" rx="1" className="f-red" />
    <rect x="5" y="-9" width="5" height="18" rx="1" className="f-red" />
  </g>,
];

function Patterns() {
  return (
    <defs>
      <pattern id="v8p-0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="11" cy="11" r="3.2" className="f-white" opacity="0.55" />
      </pattern>
      <pattern id="v8p-1" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="7" height="18" className="f-coral" opacity="0.55" />
      </pattern>
      <pattern id="v8p-2" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M13 6l7 13H6z" className="f-red" opacity="0.4" />
      </pattern>
      <pattern id="v8p-3" width="26" height="24" patternUnits="userSpaceOnUse">
        <path d="M5 7h16a8 8 0 0 1-16 0z" className="f-white" opacity="0.5" />
      </pattern>
      <pattern id="v8p-4" width="22" height="16" patternUnits="userSpaceOnUse">
        <path d="M3 11l8-6 8 6" className="s-red" strokeWidth="2.6" opacity="0.45" />
      </pattern>
      <pattern id="v8p-5" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 .5h20M.5 0v20" className="s-white" strokeWidth="2" opacity="0.7" />
      </pattern>
      <pattern id="v8p-6" width="26" height="26" patternUnits="userSpaceOnUse">
        <Glyph i={0} x={6} y={5} s={0.16} c="f-white" />
      </pattern>
      <pattern id="v8p-7" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="3" height="14" className="f-red" opacity="0.35" />
      </pattern>
    </defs>
  );
}

export function HeroDisc({ lang }: { lang: Lang }) {
  return (
    <figure className={s.disc}>
      <svg viewBox="0 0 400 400" className={s.discSvg} role="group" aria-label={V8.hero.discLabel[lang]}>
        <Patterns />
        {CATEGORIES.map((cat, i) => {
          const a0 = -112.5 + i * 45;
          const a1 = a0 + 45;
          const mid = a0 + 22.5;
          const [x0, y0] = pt(a0, R);
          const [x1, y1] = pt(a1, R);
          const [i0x, i0y] = pt(a0, R_IN);
          const [i1x, i1y] = pt(a1, R_IN);
          const d = `M${i0x} ${i0y}L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${i1x} ${i1y}A${R_IN} ${R_IN} 0 0 0 ${i0x} ${i0y}Z`;
          const [bx, by] = pt(mid, 128);
          const rad = (mid * Math.PI) / 180;
          return (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              className={s.sector}
              aria-label={`${cat.short[lang]}: ${cat.goal[lang]}`}
              style={{ "--dx": Math.cos(rad).toFixed(3), "--dy": Math.sin(rad).toFixed(3), "--i": i } as React.CSSProperties}
            >
              <title>{`${cat.short[lang]}: ${cat.goal[lang]}`}</title>
              <path d={d} className={`${BASE[i]} ${s.patch}`} />
              <path d={d} fill={`url(#v8p-${i})`} className={s.patchPattern} />
              <g transform={`translate(${bx} ${by})`}>
                <circle r="25" className="f-white" />
                {ICONS[i]}
              </g>
            </a>
          );
        })}
        <circle cx={C} cy={C} r={R - 12} className={`s-white ${s.stitch}`} strokeWidth="3" strokeDasharray="1 10" />
        <circle cx={C} cy={C} r={R_IN - 4} className="f-white" />
        <Glyph i={0} x={174} y={169} s={0.62} c="f-red" />
      </svg>
      <figcaption className={s.discCap}>{V8.hero.menuLine[lang]}</figcaption>
    </figure>
  );
}
