import { Fill } from "@/components/Fill";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import {
  BRAND_TEXT,
  CASES,
  CATEGORIES,
  CLIENT_LOGOS,
  PRINCIPLES,
  REVIEWS,
  STATS,
  TEAM,
  UI,
  dt,
  type Lang,
} from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto, teamPhoto } from "@/content/photos";
import { V10 } from "@/content/v10";
import { wool } from "./wool";
import s from "./V10.module.css";

const cssVar = (name: string, value: string) => ({ [name]: value }) as React.CSSProperties;
const catShort = (cat: CategoryId, lang: Lang) => CATEGORIES.find((c) => c.id === cat)?.short[lang] ?? cat;

/* ------------------------------------------------------------------ */
/* Как делают чий                                                       */
/* ------------------------------------------------------------------ */

function ArtMark() {
  return (
    <svg viewBox="0 0 72 150" className={s.craftArt} aria-hidden="true" focusable="false">
      <rect x="31" y="4" width="10" height="142" rx="5" className={s.artReed} />
      {[22, 40, 58, 76, 94, 112].map((y) => (
        <rect key={y} x="29" y={y} width="14" height="2" rx="1" className={s.artInk} />
      ))}
      <path d="M56 18 L46 86" className={s.artLine} />
      <ellipse cx="56.6" cy="14" rx="1.8" ry="4" transform="rotate(8 56.6 14)" className={s.artLine} />
    </svg>
  );
}

function ArtWrap() {
  return (
    <svg viewBox="0 0 72 150" className={s.craftArt} aria-hidden="true" focusable="false">
      <rect x="31" y="4" width="10" height="142" rx="5" className={s.artReed} />
      <rect x="29" y="22" width="14" height="30" rx="4" className={s.artW1} />
      <rect x="29" y="52" width="14" height="34" rx="2" className={s.artRed} />
      <rect x="29" y="86" width="14" height="22" rx="4" className={s.artW2} />
      <rect x="29" y="22" width="14" height="86" rx="4" className={s.artWrap} />
      <path d="M43 108 C 56 112, 58 126, 50 140" className={s.artLine} />
    </svg>
  );
}

function ArtWeave() {
  // семь стеблей: вместе дают ромб
  const rows = [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 1, 2, 2, 2, 1, 0],
    [1, 2, 2, 3, 2, 2, 1],
    [0, 1, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  const cls = [s.artPanel, s.artW3, s.artRed, s.artW1];
  return (
    <svg viewBox="0 0 72 150" className={s.craftArt} aria-hidden="true" focusable="false">
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={3 + i * 9.6} y="4" width="8" height="142" rx="4" className={s.artReed} />
          <rect x={3 + i * 9.6} y="26" width="8" height="98" rx="2" className={s.artPanel} />
          {rows.map((r, j) =>
            r[i] ? <rect key={j} x={3 + i * 9.6} y={40 + j * 10} width="8" height="10" className={cls[r[i]!]} /> : null,
          )}
          <rect x={3 + i * 9.6} y="26" width="8" height="98" className={s.artWrap} />
        </g>
      ))}
      <rect x="0" y="22" width="72" height="3" rx="1.5" className={s.artInk} />
      <rect x="0" y="125" width="72" height="3" rx="1.5" className={s.artInk} />
    </svg>
  );
}

export function ChiySection({ lang }: { lang: Lang }) {
  const arts = [<ArtMark key="m" />, <ArtWrap key="w" />, <ArtWeave key="v" />];
  return (
    <section className={`${s.section} ${s.chiy}`} aria-labelledby="v10-chiy" id="chiy" style={{ paddingTop: 0 }}>
      <div className={s.fringe} aria-hidden="true" />
      <div className={s.wrap}>
        <div className={s.chiyTop}>
          <h2 id="v10-chiy" className={s.h2}>
            {V10.chiy.title[lang]}
          </h2>
          <p className={s.lede}>{V10.chiy.intro[lang]}</p>
        </div>

        <h3 className="visually-hidden">{V10.chiy.stepsLabel[lang]}</h3>
        <ol className={s.craft}>
          {V10.chiy.steps.map((st, i) => (
            <li key={st.ru} className={s.craftStep}>
              {arts[i]}
              <p className={s.craftText}>{st[lang]}</p>
            </li>
          ))}
        </ol>

        <div className={s.chiyUs}>
          <p className={s.statement}>{V10.chiy.us[lang]}</p>
          <div className={s.facts}>
            <p className={s.small}>{V10.chiy.sort[lang]}</p>
            <p className={s.small}>{V10.chiy.uses[lang]}</p>
            <p className={s.small}>{V10.chiy.sources[lang]}</p>
          </div>
        </div>

        <h3 className={s.statsTitle}>{V10.chiy.statsTitle[lang]}</h3>
        <ul className={s.stats}>
          {STATS.map((st, i) => (
            <li key={st.label.ru} className={s.stat} style={cssVar("--w", `var(--v10-w${i * 2 + 1})`)}>
              <span className={s.statNum}>
                <Fill value={dt(st.value, lang)} />
              </span>
              <span className={s.statLabel}>{st.label[lang]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Кейсы: готовые полотна                                              */
/* ------------------------------------------------------------------ */

/** Кромка полотна кейса: стебли цветов тех направлений, что работали в проекте */
const edge = (cats: CategoryId[]) => {
  const step = 100 / cats.length;
  return `linear-gradient(90deg, ${cats.map((c, i) => `${wool(c)} ${(i * step).toFixed(2)}% ${((i + 1) * step).toFixed(2)}%`).join(", ")})`;
};

export function Cases({ lang }: { lang: Lang }) {
  return (
    <section className={s.section} id="cases" aria-labelledby="v10-cases">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2 id="v10-cases" className={s.h2}>
            {V10.cases.title[lang]}
          </h2>
          <div>
            <p className={s.lede}>{UI.nda[lang]}</p>
          </div>
        </div>
        <ul className={s.cases}>
          {CASES.map((c) => (
            <li key={c.id}>
              <article className={s.case} aria-labelledby={`v10-case-${c.id}`} style={cssVar("--edge", edge(c.categories))}>
                <div className={s.caseEdge} aria-hidden="true" />
                <div className={s.casePhotoBox}>
                  <PhotoSlot kind="scene" src={casePhoto(c.id)} label={SLOT_TEXT.project[lang]} className={s.casePhoto} />
                </div>
                <div className={s.caseBody}>
                  <h3 id={`v10-case-${c.id}`} className={s.caseTitle}>
                    <span className={s.caseNum}>
                      <Fill value={dt(c.result, lang)} />
                    </span>
                    <span className={s.caseLabel}>{c.resultLabel[lang]}</span>
                  </h3>
                  <p className={s.caseClient}>{c.client[lang]}</p>
                  <dl className={s.caseDl}>
                    <div>
                      <dt>{V10.cases.task[lang]}</dt>
                      <dd>{c.task[lang]}</dd>
                    </div>
                    <div>
                      <dt>{V10.cases.did[lang]}</dt>
                      <dd>{c.did[lang]}</dd>
                    </div>
                  </dl>
                  <ul className={s.threads} aria-label={V10.cases.threads[lang]}>
                    {c.categories.map((cat) => (
                      <li key={cat} style={cssVar("--w", wool(cat))}>
                        {catShort(cat, lang)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.caseEdge} aria-hidden="true" />
              </article>
            </li>
          ))}
        </ul>
        <p className={s.note}>{UI.draftNote[lang]}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Команда: мастера на нитях своего цвета                               */
/* ------------------------------------------------------------------ */

const DROPS = ["40px", "120px", "72px", "152px", "96px"];

export function Team({ lang }: { lang: Lang }) {
  return (
    <section className={s.section} id="team" aria-labelledby="v10-team">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2 id="v10-team" className={s.h2}>
            {V10.team.title[lang]}
          </h2>
          <p className={s.lede}>{V10.team.lede[lang]}</p>
        </div>
        <div className={s.team} data-v10-team>
          <div className={s.rod} aria-hidden="true" />
          <ul className={s.people}>
            {TEAM.map((p, i) => {
              const name = dt(p.name, lang);
              const role = p.role[lang];
              const soft = /^.[a-zа-яё]/u.test(role) ? role.charAt(0).toLowerCase() + role.slice(1) : role;
              const label = `${SLOT_TEXT.portrait[lang]}: ${p.name.draft ? soft : name.value}`;
              return (
                <li
                  key={p.id}
                  className={s.person}
                  style={{ "--w": wool(p.category), "--drop": DROPS[i % DROPS.length] } as React.CSSProperties}
                >
                  <span className={s.thread} aria-hidden="true" data-v10-thread />
                  <div className={s.frame}>
                    <PhotoSlot kind="person" src={teamPhoto(p.id)} label={label} className={s.portrait} />
                  </div>
                  <h3 className={s.personName}>
                    <Fill value={name} />
                  </h3>
                  <p className={s.personRole}>{p.role[lang]}</p>
                  {p.exp ? (
                    <p className={s.personExp}>
                      <Fill value={dt(p.exp, lang)} />
                    </p>
                  ) : null}
                  <p className={s.personLine}>{p.line[lang]}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Принципы: нити, которые держат стебли вместе                         */
/* ------------------------------------------------------------------ */

const CORD_COLORS = [1, 3, 5, 6];

export function Principles({ lang }: { lang: Lang }) {
  return (
    <section className={s.section} id="principles" aria-labelledby="v10-principles">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2 id="v10-principles" className={s.h2}>
            {V10.principles.title[lang]}
          </h2>
          <p className={s.lede}>{V10.principles.lede[lang]}</p>
        </div>
        <ul className={s.field}>
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title.ru}
              className={s.cord}
              style={
                {
                  "--w": `var(--v10-w${CORD_COLORS[i % CORD_COLORS.length]})`,
                  "--side": i % 2 ? "end" : "start",
                  "--origin": i % 2 ? "right" : "left",
                } as React.CSSProperties
              }
            >
              <span className={s.cordLine} aria-hidden="true" data-v10-cord />
              <span className={`${s.stone} ${s.stoneL}`} aria-hidden="true" />
              <span className={`${s.stone} ${s.stoneR}`} aria-hidden="true" />
              <div className={s.cordCard}>
                <h3 className={s.cordTitle}>{p.title[lang]}</h3>
                <p className={s.cordText}>{p.text[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Клиенты и отзывы                                                     */
/* ------------------------------------------------------------------ */

const REVIEW_CATS: CategoryId[] = ["smm", "events", "brand"];

export function Reviews({ lang }: { lang: Lang }) {
  return (
    <section className={s.section} id="reviews" aria-labelledby="v10-reviews">
      <div className={s.wrap}>
        <div className={s.head}>
          <h2 id="v10-reviews" className={s.h2}>
            {V10.reviews.title[lang]}
          </h2>
          <p className={s.lede}>{V10.reviews.logos[lang]}</p>
        </div>
        <ul className={s.logos}>
          {CLIENT_LOGOS.map((l, i) => (
            <li key={i}>
              <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.logoCell} />
            </li>
          ))}
        </ul>
        <ul className={s.reviews}>
          {REVIEWS.map((r, i) => (
            <li key={i}>
              <figure className={s.review} style={cssVar("--w", wool(REVIEW_CATS[i % REVIEW_CATS.length]!))}>
                <span className={s.quoteMark} aria-hidden="true">
                  «
                </span>
                <blockquote className={s.quote}>
                  <p>{r.text[lang]}</p>
                </blockquote>
                <figcaption className={s.author}>
                  <span className={s.avatar}>
                    <PhotoSlot kind="person" hideLabel src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} />
                  </span>
                  <span>
                    <span className={s.authorName}>
                      <Fill value={dt(r.who, lang)} />
                    </span>
                    <span className={s.authorRole}>{r.role[lang]}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
