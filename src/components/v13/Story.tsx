import { CATEGORIES, type Lang } from "@/content/kurak";
import { PATCH_ORDER, V13_STORY } from "@/content/v13";
import { KURAK_PATHS } from "../brand/KurakLogo";
import { Patch, STRIP, patId } from "./Patch";
import { StoryScene } from "./StoryScene";
import s from "./Story.module.css";

const H = 93;

/**
 * Лоскутная история (концепт варианта 2 в цветах логотипа). Секция закрепляется, и пока человек листает,
 * восемь лоскутов-направлений по одному встают в полосу, а из полосы проступает знак KURAK.
 * Без скрипта и при «уменьшить движение» знак уже сшит, список направлений виден целиком.
 */
export function Story({ lang }: { lang: Lang }) {
  const cats = PATCH_ORDER.map((id) => CATEGORIES.find((c) => c.id === id)!);
  return (
    <section id="istoriya" className={s.section} aria-labelledby="istoriya-title">
      <StoryScene target="istoriya" />
      <div className={`v13-container ${s.stage}`} data-stage>
        <div className={s.head}>
          <h2 id="istoriya-title" className={`v13-h2 ${s.title}`}>
            {V13_STORY.title[lang]}
          </h2>
        </div>

        <div className={s.signWrap}>
          <svg viewBox={`0 0 443 ${H}`} className={s.sign} role="img" aria-label={V13_STORY.signLabel[lang]} data-sign-svg>
            <defs>
              <clipPath id="v13-sign-clip">
                {KURAK_PATHS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </clipPath>
            </defs>
            {/* россыпь лоскутов и уже пришитые: пришитые лежат поверх россыпи */}
            <g className={s.ghost} data-ghost>
              <g>
                {PATCH_ORDER.map((cat, i) => (
                  <rect key={cat} data-strip={i} x={i * STRIP} y="0" width={STRIP} height={H} fill={`url(#${patId(cat)})`} />
                ))}
              </g>
              <g>
                {PATCH_ORDER.map((cat, i) => (
                  <rect key={cat} data-placed={i} x={i * STRIP} y="0" width={STRIP} height={H} fill={`url(#${patId(cat)})`} />
                ))}
              </g>
            </g>
            <g clipPath="url(#v13-sign-clip)" className={s.signLayer} data-sign>
              {PATCH_ORDER.map((cat, i) => (
                <rect key={cat} x={i * STRIP} y="0" width={STRIP} height={H} fill={`url(#${patId(cat)})`} />
              ))}
              {PATCH_ORDER.slice(1).map((cat, i) => (
                <line key={cat} className={s.seam} x1={(i + 1) * STRIP} x2={(i + 1) * STRIP} y1="0" y2={H} />
              ))}
            </g>
          </svg>
        </div>

        <ol className={s.goals} data-goals>
          {cats.map((c, i) => (
            <li key={c.id} data-goal-i={i} className={s.goalItem}>
              {/* каждое направление ведёт к своему разделу меню и раскрывает его */}
              <a href={`#cat-${c.id}`} className={s.goal}>
                <Patch kind={c.id} className={s.swatch} />
                <span className={s.num}>{c.n}</span>
                <span className={s.goalText}>{c.goal[lang]}</span>
                <span className={s.short}>{c.short[lang]}</span>
              </a>
            </li>
          ))}
        </ol>

        <p className={s.finale} data-finale>
          {V13_STORY.finale[lang]}
        </p>
      </div>
    </section>
  );
}
