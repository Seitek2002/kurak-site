import {
  ADDRESS,
  BRAND_TEXT,
  BUNDLES,
  CASES,
  CATEGORIES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
  FAQ,
  PORTFOLIO_HREF,
  PRINCIPLES,
  RESPONSE_TIME,
  REVIEWS,
  SERVICE_BY_ID,
  STATS,
  STEPS,
  TEAM,
  UI,
  dt,
  htmlLang,
  type Lang,
} from "@/content/kurak";
import {
  V6_CASES,
  V6_COMPARE,
  V6_FAQ,
  V6_FOOTER,
  V6_HERO,
  V6_NAV,
  V6_PLAN,
  V6_REQUEST,
  V6_REVIEWS,
  V6_SERVICES,
  V6_TEAM,
  V6_UI,
} from "@/content/v6";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto, teamPhoto } from "@/content/photos";
import { Fill } from "../Fill";
import { AddToggle, BundleButton, PickedCount } from "./AddToggle";
import { CalcHero } from "./CalcHero";
import { CalcResult } from "./CalcResult";
import { IconPlus } from "./Icons";
import { MobileBar } from "./MobileBar";
import { Portrait } from "./Portrait";
import { LangSwitch, V6Header } from "./V6Header";
import { V6Bill, V6Form } from "./V6Request";
import s from "./V6.module.css";

/** Пока PDF нет, «Портфолио» ведёт к кейсам этой страницы */
const PORTFOLIO = PORTFOLIO_HREF.startsWith("#") ? "#keisy" : PORTFOLIO_HREF;
/** «Руководитель SMM» → «руководитель SMM», но «SMM жетекчиси» остаётся как есть */
const lcFirst = (x: string) => (/^\p{Lu}\p{Ll}/u.test(x) ? x.charAt(0).toLocaleLowerCase("ru") + x.slice(1) : x);
/** Фигура логотипа для портрета каждого руководителя */
const GLYPH: Record<string, number> = { oksana: 0, bibinur: 1, nurchik: 2, "smm-lead": 3, "pr-lead": 4 };

/** Неразрывный дефис: «иш‑чаралар» и «один‑два» не рвутся на конце строки */
const nbh = (x: string) => x.replace(/(\p{L})-(\p{L})/gu, "$1‑$2");
/** Пропс для элемента-черновика: пунктирная рамка и подсказка, пока агентство не подтвердило содержание */
const draftProps = (draft: boolean, note: string) =>
  draft ? { "data-fill": note, title: `Образец, ждёт настоящих данных: ${note}` } : {};

/** Черновой блок: пунктирная рамка, пока агентство не подтвердило содержание */
function DraftBlock({ draft, note, className, children }: { draft: boolean; note: string; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[draft ? "v6-draft" : "", className].filter(Boolean).join(" ")}
      title={draft ? `Образец, ждёт настоящих данных: ${note}` : undefined}
      data-fill={draft ? note : undefined}
    >
      {children}
    </div>
  );
}

/**
 * Вариант 6 «Эсеп»: страница продаёт через расчёт. Сначала посетитель считает, сколько денег уходит
 * с потерянными обращениями, потом видит, что это закрывает, сравнение, кейсы, людей и ответы на «но».
 * Одна разметка для русской и кыргызской страниц, язык приходит пропсом.
 */
export function V6Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)} className={s.page}>
      <V6Header lang={lang} />

      <main id="main">
        {/* 1. Первый экран: заголовок, расчёт одной строкой, под итогом отличие и одна кнопка */}
        <section id="raschet" className={s.hero} aria-labelledby="v6-title">
          <div className={`container ${s.heroGrid}`}>
            <h1 id="v6-title" className={s.h1}>
              {V6_HERO.title[lang]}
            </h1>
            <div className={s.heroCalc}>
              <CalcHero lang={lang} />
            </div>
            <div className={s.heroFoot}>
              <p className={s.lede}>{nbh(BRAND_TEXT.promise[lang])}</p>
              <div className={s.heroActions}>
                <a id="v6-hero-cta" href="#zayavka" className="v6-btn">
                  {UI.discuss[lang]}
                </a>
                <a href={PORTFOLIO} className="v6-link">
                  {UI.portfolio[lang]}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Продолжение расчёта: год, график, диагноз, перенос в заявку */}
        <section className={s.results} aria-labelledby="calc-title">
          <div className="container">
            <CalcResult lang={lang} />
          </div>
        </section>

        {/* 3. Услуги: восемь задач клиента, раскрываются в состав работ */}
        <section id="uslugi" className={s.section} aria-labelledby="svc-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="svc-title" className={s.h2}>
                {V6_SERVICES.title[lang]}
              </h2>
              <p className={s.headLede}>{V6_SERVICES.lede[lang]}</p>
            </div>
            <ol className={s.svcList}>
              {CATEGORIES.map((c) => {
                const ids = c.services.map((x) => x.id);
                return (
                  <li key={c.id} className={s.svcItem}>
                    <details className={s.svc}>
                      <summary className={s.svcSum}>
                        <span className={`${s.svcN} v6-num`}>{c.n}</span>
                        <h3 className={s.svcGoal}>{c.goal[lang]}</h3>
                        <span className={s.svcShort}>{c.short[lang]}</span>
                        <span className={s.svcLead}>
                          {UI.leads[lang]}: {c.lead.name ? `${c.lead.name}, ${lcFirst(c.lead.role[lang])}` : lcFirst(c.lead.role[lang])}
                        </span>
                        <span className={s.svcCount}>
                          <span>{V6_UI.services(c.services.length)[lang]}</span>
                          <PickedCount ids={ids} lang={lang} className={s.svcPicked} />
                        </span>
                        <span className={s.svcIcon} aria-hidden="true">
                          <IconPlus />
                        </span>
                      </summary>
                      <div className={s.svcBody} style={{ "--cols": c.services.length === 3 ? 3 : Math.min(2, c.services.length) } as React.CSSProperties}>
                        {c.services.map((sv) => (
                          <article key={sv.id} className={s.svcCard}>
                            <h4 className={s.h4}>{sv.title[lang]}</h4>
                            <p className={s.svcAsk}>
                              <span className={s.small}>{UI.withTask[lang]}</span>
                              <span>«{sv.ask[lang]}»</span>
                            </p>
                            <div>
                              <p className={s.small}>{UI.includes[lang]}</p>
                              <ul className={s.ticks}>
                                {sv.includes.map((x, i) => (
                                  <li key={i}>{x[lang]}</li>
                                ))}
                              </ul>
                            </div>
                            <AddToggle id={sv.id} lang={lang} className={s.svcAdd} />
                          </article>
                        ))}
                      </div>
                    </details>
                  </li>
                );
              })}
            </ol>

            <div className={s.bundles}>
              <div className={s.bundlesHead}>
                <h3 className={s.h3}>{V6_SERVICES.bundlesTitle[lang]}</h3>
                <p className={s.muted}>{V6_SERVICES.bundlesLede[lang]}</p>
              </div>
              <ul className={s.bundleList}>
                {BUNDLES.map((b) => {
                  const cats = CATEGORIES.filter((c) => b.services.some((id) => SERVICE_BY_ID[id]?.category.id === c.id));
                  return (
                    <li key={b.id} className={s.bundle}>
                      <div className={s.bundleName}>
                        <h4 className={s.h4}>{b.title[lang]}</h4>
                        <p className={s.small}>{b.line[lang]}</p>
                      </div>
                      <p className={s.bundleSum} title={b.services.map((id) => SERVICE_BY_ID[id]?.service.title[lang]).join(", ")}>
                        <span className={s.bundleEq} aria-hidden="true">
                          =
                        </span>
                        {cats.map((c, i) => (
                          <span key={c.id} className={s.bundleTerm}>
                            {i > 0 && (
                              <span className={s.bundleOp} aria-hidden="true">
                                +
                              </span>
                            )}
                            <span className="v6-num">{c.n}</span> {c.short[lang]}
                          </span>
                        ))}
                        <span className={s.bundleCount}>{V6_UI.services(b.services.length)[lang]}</span>
                      </p>
                      <BundleButton ids={b.services} add={V6_SERVICES.addBundle[lang]} done={V6_SERVICES.bundleIn[lang]} className={s.bundleBtn} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Сравнение: фрилансер, штатный маркетолог, Курак. Без цен */}
        <section id="sravnenie" className={s.section} aria-labelledby="cmp-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="cmp-title" className={s.h2}>
                {V6_COMPARE.title[lang]}
              </h2>
              <p className={s.headLede}>{V6_COMPARE.lede[lang]}</p>
            </div>
            <table className={s.cmp} aria-labelledby="cmp-title">
              <thead>
                <tr>
                  <th scope="col" className={s.cmpQ}>
                    <span className="visually-hidden">{V6_COMPARE.question[lang]}</span>
                  </th>
                  {V6_COMPARE.cols.map((c, i) => (
                    <th key={i} scope="col" className={i === 2 ? s.cmpUs : undefined}>
                      {c[lang]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {V6_COMPARE.rows.map((r, ri) => (
                  <tr key={ri}>
                    <th scope="row" className={s.cmpQ}>
                      {r.q[lang]}
                    </th>
                    {r.a.map((a, i) => (
                      <td key={i} className={i === 2 ? s.cmpUs : undefined} data-label={V6_COMPARE.cols[i]![lang]}>
                        {a[lang]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={s.rules}>
              <h3 className={s.h3}>{V6_COMPARE.principlesTitle[lang]}</h3>
              <ul className={s.ruleList}>
                {PRINCIPLES.map((p, i) => (
                  <li key={i} className={s.rule} title={p.text[lang]}>
                    {p.title[lang]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Кейсы: было, что сделали, цифра результата в заголовке */}
        <section id="keisy" className={s.section} aria-labelledby="cases-title">
          <div className={`container ${s.casesGrid}`}>
            <div className={s.casesHead}>
              <h2 id="cases-title" className={s.h2}>
                {V6_CASES.title[lang]}
              </h2>
              <p className={s.muted}>{UI.draftNote[lang]}</p>
              <p className={s.small}>{UI.nda[lang]}</p>
            </div>
            <ol className={s.caseList}>
              {CASES.map((k) => (
                <li key={k.id} className={[s.case, k.result.draft ? `v6-draft ${s.caseDraft}` : ""].join(" ")} {...draftProps(k.result.draft, "кейс-образец")}>
                  <h3 className={s.caseHead}>
                    <span className={`${s.caseFig} v6-num`}>{k.result.value[lang]}</span>
                    <span className={s.caseLabel}>{k.resultLabel[lang]}</span>
                  </h3>
                  <div className={s.casePhoto}>
                    <PhotoSlot kind="scene" src={casePhoto(k.id)} label={SLOT_TEXT.project[lang]} className={s.caseSlot} />
                  </div>
                  <p className={s.caseClient}>{k.client[lang]}</p>
                  <dl className={s.caseRows}>
                    <div>
                      <dt className={s.small}>{V6_CASES.before[lang]}</dt>
                      <dd>{k.task[lang]}</dd>
                    </div>
                    <div>
                      <dt className={s.small}>{V6_CASES.did[lang]}</dt>
                      <dd>{k.did[lang]}</dd>
                    </div>
                  </dl>
                  <p className={s.caseTags}>{k.categories.map((id) => CATEGORIES.find((c) => c.id === id)?.short[lang]).join(", ")}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Первые 30 дней: план-образец по неделям */}
        <section id="start" className={`${s.section} ${s.well}`} aria-labelledby="plan-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="plan-title" className={s.h2}>
                {V6_PLAN.title[lang]}
              </h2>
              <p className={s.headLede}>{V6_PLAN.lede[lang]}</p>
            </div>
            <DraftBlock draft={V6_PLAN.draft} note={V6_PLAN.note} className={s.planWrap}>
              <ol className={s.plan}>
                {V6_PLAN.weeks.map((w, i) => (
                  <li key={i} className={s.week}>
                    <p className={s.weekHead}>
                      <span className={s.weekN}>{V6_PLAN.week(i + 1)[lang]}</span>
                      <span className={s.small}>{w.days[lang]}</span>
                    </p>
                    <h3 className={s.weekTitle}>{w.title[lang]}</h3>
                    <p className={s.muted}>{w.text[lang]}</p>
                  </li>
                ))}
              </ol>
            </DraftBlock>
          </div>
        </section>

        {/* 7. Команда и цифры агентства */}
        <section id="komanda" className={s.section} aria-labelledby="team-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="team-title" className={s.h2}>
                {V6_TEAM.title[lang]}
              </h2>
              <p className={s.headLede}>{V6_TEAM.lede[lang]}</p>
            </div>
            <dl className={s.stats} aria-label={V6_TEAM.statsTitle[lang]}>
              {STATS.map((st, i) => (
                <div key={i} className={s.stat}>
                  <dt className={s.statLabel}>{st.label[lang]}</dt>
                  <dd className={`${s.statFig} v6-num`}>
                    <Fill value={dt(st.value, lang)} />
                  </dd>
                </div>
              ))}
            </dl>
            <ul className={s.team}>
              {TEAM.map((p) => {
                const label = `${SLOT_TEXT.portrait[lang]}: ${p.name.draft ? lcFirst(p.role[lang]) : p.name.value[lang]}`;
                return (
                  <li key={p.id} className={s.person}>
                    <Portrait glyph={GLYPH[p.id] ?? 0} label={label} src={teamPhoto(p.id)} />
                    <div className={s.personText}>
                      <h3 className={s.personName}>
                        <Fill value={dt(p.name, lang)} note="имя" />
                      </h3>
                      <p className={s.personRole}>{p.role[lang]}</p>
                      {p.exp && (
                        <p className={s.small}>
                          <Fill value={dt(p.exp, lang)} note="опыт" />
                        </p>
                      )}
                      <p className={s.personLine}>{p.line[lang]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
          </div>
        </section>

        {/* 8. Отзывы и клиенты: всё черновики, логотипы только с разрешения */}
        <section id="otzyvy" className={s.section} aria-labelledby="rev-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="rev-title" className={s.h2}>
                {V6_REVIEWS.title[lang]}
              </h2>
              <p className={s.headLede}>{V6_REVIEWS.lede[lang]}</p>
            </div>
            <ul className={s.reviews}>
              {REVIEWS.map((r, i) => (
                <li key={i}>
                  <figure className={[s.review, r.who.draft ? `v6-draft ${s.reviewDraft}` : ""].join(" ")} {...draftProps(r.who.draft, "отзыв-образец")}>
                    <blockquote className={s.quote}>
                      <p>«{r.text[lang]}»</p>
                    </blockquote>
                    <figcaption className={s.quoteBy}>
                      <PhotoSlot kind="person" hideLabel src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} className={s.quotePhoto} />
                      <span className={s.quoteName}>{r.who.value[lang]}</span>
                      <span className={s.muted}>{r.role[lang]}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className={s.logos}>
              <p className={s.muted}>{V6_REVIEWS.logos[lang]}</p>
              <ul className={s.logoRow}>
                {CLIENT_LOGOS.map((_, i) => (
                  <li key={i} className={s.logoItem}>
                    <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.logoSlot} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 9. Возражения и вопросы */}
        <section id="voprosy" className={s.section} aria-labelledby="faq-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="faq-title" className={s.h2}>
                {V6_FAQ.title[lang]}
              </h2>
            </div>
            <div className={s.faqGrid}>
              <div>
                <h3 className={s.faqGroup}>{V6_FAQ.doubts[lang]}</h3>
                <div className={s.faqList}>
                  {V6_FAQ.objections.map((o, i) => (
                    <details key={i} className={`${s.faq} ${s.faqBig}`}>
                      <summary className={s.faqQ}>
                        <span>{o.q[lang]}</span>
                        <span className={s.faqIcon} aria-hidden="true">
                          <IconPlus />
                        </span>
                      </summary>
                      <p className={s.faqA}>{o.a[lang]}</p>
                    </details>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={s.faqGroup}>{V6_FAQ.questions[lang]}</h3>
                <div className={s.faqList}>
                  {FAQ.map((f, i) => (
                    <details key={i} className={s.faq}>
                      <summary className={s.faqQ}>
                        <span>{f.q[lang]}</span>
                        <span className={s.faqIcon} aria-hidden="true">
                          <IconPlus />
                        </span>
                      </summary>
                      <p className={s.faqA}>{f.a[lang]}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Заявка: счёт без цен слева, три поля справа */}
        <section id="zayavka" className={`${s.section} ${s.request}`} aria-labelledby="req-title">
          <div className={`container ${s.reqGrid}`}>
            <h2 id="req-title" className={`${s.h2} ${s.reqTitle}`}>
              {V6_REQUEST.title[lang]}
            </h2>
            <div className={s.reqSide}>
              <V6Bill lang={lang} />
              <div className={s.reqBlock}>
                <h3 className={s.small}>{V6_REQUEST.next[lang]}</h3>
                <ol className={s.steps}>
                  {STEPS.map((st, i) => (
                    <li key={i}>
                      <span className={s.stepTitle}>{st.title[lang]}</span>
                      <span className={s.muted}>
                        {st.text[lang]}
                        {i === 0 && (
                          <>
                            , <Fill value={dt(RESPONSE_TIME, lang)} />
                          </>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className={s.reqBlock}>
                <h3 className={s.small}>{V6_REQUEST.terms[lang]}</h3>
                <ul className={s.terms}>
                  {V6_REQUEST.risks.map((r, i) => (
                    <li key={i}>
                      <Fill value={dt(r, lang)} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={s.reqForm}>
              <V6Form lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`container ${s.footGrid}`}>
          <div className={s.footBrand}>
            <KurakLogo className={s.footLogo} title={BRAND_TEXT.name[lang]} />
            <p>{BRAND_TEXT.oneLine[lang]}</p>
            <p className={s.muted}>{BRAND_TEXT.nameStory[lang]}</p>
          </div>
          <div>
            <h2 className={s.footHead}>{V6_FOOTER.contacts[lang]}</h2>
            <dl className={s.footList}>
              {CHANNELS.map((c) => (
                <div key={c.id}>
                  <dt className={s.muted}>{c.label[lang]}</dt>
                  <dd>{c.href ? <a href={c.href}>{c.value.value}</a> : <Fill value={c.value} />}</dd>
                </div>
              ))}
              <div>
                <dt className={s.muted}>E-mail</dt>
                <dd>
                  <Fill value={EMAIL} />
                </dd>
              </div>
              <div>
                <dt className={s.muted}>{UI.address[lang]}</dt>
                <dd>
                  <Fill value={ADDRESS} />
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h2 className={s.footHead}>{V6_FOOTER.sections[lang]}</h2>
            <ul className={s.footNav}>
              {V6_NAV.map((x) => (
                <li key={x.href}>
                  <a href={x.href}>{x.label[lang]}</a>
                </li>
              ))}
              <li>
                <a href="#zayavka">{UI.discuss[lang]}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className={s.footHead}>{V6_FOOTER.lang[lang]}</h2>
            <LangSwitch lang={lang} />
          </div>
          <p className={s.footBase}>© 2026 {BRAND_TEXT.name[lang]}</p>
        </div>
      </footer>

      <MobileBar lang={lang} />
    </div>
  );
}
