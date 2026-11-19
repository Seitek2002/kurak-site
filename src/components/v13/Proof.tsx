import { CASES, CATEGORIES, CLIENT_LOGOS, REVIEWS, STATS, UI, dt, type Lang } from "@/content/kurak";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto } from "@/content/photos";
import { CASE_REVIEW, V13_PROOF } from "@/content/v13";
import { Fill } from "../Fill";
import { PhotoSlot } from "../brand/PhotoSlot";
import { Patch } from "./Patch";
import s from "./Proof.module.css";

/**
 * Кейсы с результатом цифрой в заголовке, цифры агентства, отзывы и логотипы клиентов.
 * Всё это пока образцы из kurak.ts: цифры и имена в пунктире, фото и логотипы в плейсхолдерах.
 */
export function Proof({ lang }: { lang: Lang }) {
  return (
    <section id="keisy" className={`v13-section ${s.section}`} aria-labelledby="keisy-title">
      <div className="v13-container">
        <div className={s.head}>
          <h2 id="keisy-title" className="v13-h2">
            {V13_PROOF.title[lang]}
          </h2>
          <p className={s.note}>
            {UI.nda[lang]} {UI.draftNote[lang]}
          </p>
        </div>

        <ol className={s.cases}>
          {CASES.map((c) => (
            <li key={c.id} className={s.case}>
              <article className={s.caseInner} aria-labelledby={`case-${c.id}`}>
                <PhotoSlot src={casePhoto(c.id)} label={`${SLOT_TEXT.project[lang]}: ${c.client[lang]}`} kind="scene" className={s.photo} />
                <h3 id={`case-${c.id}`} className={s.result}>
                  <span className={s.resultFig}>
                    <Fill value={dt(c.result, lang)} />
                  </span>
                  <span className={s.resultLabel}>{c.resultLabel[lang]}</span>
                </h3>
                <p className={s.client}>
                  <span className={s.cats} aria-hidden="true">
                    {c.categories.map((cat) => (
                      <Patch key={cat} kind={cat} className={s.catPatch} />
                    ))}
                  </span>
                  {c.client[lang]}
                  <span className="visually-hidden">: {c.categories.map((cat) => CATEGORIES.find((x) => x.id === cat)?.short[lang]).join(", ")}</span>
                </p>
                <dl className={s.story}>
                  <div>
                    <dt>{V13_PROOF.task[lang]}</dt>
                    <dd>{c.task[lang]}</dd>
                  </div>
                  <div>
                    <dt>{V13_PROOF.did[lang]}</dt>
                    <dd>{c.did[lang]}</dd>
                  </div>
                </dl>
                {CASE_REVIEW[c.id] !== undefined && <Quote i={CASE_REVIEW[c.id]!} lang={lang} />}
              </article>
            </li>
          ))}
        </ol>

        <dl className={s.stats}>
          {STATS.map((st) => (
            <div key={st.label.ru} className={s.stat}>
              <dt className={s.statLabel}>{st.label[lang]}</dt>
              <dd className={s.statFig}>
                <Fill value={dt(st.value, lang)} />
              </dd>
            </div>
          ))}
        </dl>

        <div className={s.clients}>
          <h3 className={s.clientsTitle}>{V13_PROOF.clientsTitle[lang]}</h3>
          <figure className={s.logos}>
            <ul className={s.logoRow}>
              {CLIENT_LOGOS.map((l, i) => (
                <li key={i} className={s.logo}>
                  <PhotoSlot src={clientLogo(i)} label={l.value[lang]} kind="logo" className={s.logoSlot} />
                </li>
              ))}
            </ul>
            <figcaption className={s.logosCap}>{V13_PROOF.logos[lang]}</figcaption>
          </figure>
          <div className={s.otherQuotes}>
            {REVIEWS.map((_, i) => (Object.values(CASE_REVIEW).includes(i) ? null : <Quote key={i} i={i} lang={lang} />))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Отзыв-образец: текст в пунктирной рамке, автор и его фото пока плейсхолдеры */
function Quote({ i, lang }: { i: number; lang: Lang }) {
  const r = REVIEWS[i];
  if (!r) return null;
  return (
    <figure className={s.figure}>
      <blockquote className={s.text} data-fill="образец отзыва" title="Образец, ждёт настоящих данных: отзыв клиента">
        <p>{r.text[lang]}</p>
      </blockquote>
      <figcaption className={s.who}>
        <PhotoSlot src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} kind="person" hideLabel className={s.avatar} />
        <span className={s.whoText}>
          <span className={s.name}>
            <Fill value={dt(r.who, lang)} />
          </span>
          <span className={s.role}>{r.role[lang]}</span>
        </span>
      </figcaption>
    </figure>
  );
}
