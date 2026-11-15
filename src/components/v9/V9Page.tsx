import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CATEGORIES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
  PORTFOLIO_HREF,
  PRINCIPLES,
  RESPONSE_TIME,
  REVIEWS,
  STATS,
  STEPS,
  TEAM,
  UI,
  dt,
  htmlLang,
  type Lang,
} from "@/content/kurak";
import { SECTIONS, V9 } from "@/content/v9";
import { KURAK_TAGLINE, KurakLogo } from "@/components/brand/KurakLogo";
import { Fill } from "../Fill";
import { Header, LangSwitch } from "./Header";
import { Bundles, OpenCategory, ServiceCards } from "./Services";
import { Reveal } from "./Reveal";
import { LeadForm } from "./LeadForm";
import { MobileBar } from "./MobileBar";
import { KMark, Shape } from "./Shape";
import s from "./V9.module.css";

const CASE_TONE = [s.case1, s.case2, s.case3, s.case4];
const CASE_SHAPE = [1, 3, 0, 2];
const SHORT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.short]));

/** Число букв самого длинного слова: CSS подгоняет по нему кегль широкого капса (--n в V9.module.css) */
const fit = (t: string) => ({ "--n": Math.max(...t.split(/\s+/).map((w) => w.length)) }) as React.CSSProperties;

/**
 * Вариант 9: подача креативного агентства. Гигантский вордмарк KURAK, утверждение красным,
 * кремовый эллипс на скролле, «МЫ ДЕЛАЕМ» тёмными карточками, обложки кейсов из геометрии логотипа,
 * бегущая строка цифр, команда, клиенты-пузыри, принципы, заявка и подвал с «ГЛАВНАЯ ↑».
 */
export function V9Page({ lang }: { lang: Lang }) {
  const c = CHANNELS.filter((x) => x.id !== "phone");
  const phone = CHANNELS.find((x) => x.id === "phone")!;

  return (
    <div lang={htmlLang(lang)} className={s.page} id="top">
      <Header lang={lang} />

      <main id="main">
        {/* Первый экран: вордмарк на всю ширину */}
        <section className={`${s.wrap} ${s.hero}`} aria-labelledby="v9-h1">
          <h1 id="v9-h1" className={s.heroTitle}>
            <KurakLogo className={s.wordmark} title={BRAND_TEXT.name[lang]} />
            <span className={s.caption}>{V9.caption[lang]}</span>
          </h1>
          <div className={s.heroFoot}>
            <p className={s.promise}>{BRAND_TEXT.promise[lang]}</p>
            <div className={s.heroActions}>
              <a href="#form" className={`${s.btn} ${s.btnL}`}>
                {UI.discuss[lang]}
              </a>
              <a href={PORTFOLIO_HREF} className={s.textLink}>
                {UI.portfolio[lang]}
              </a>
            </div>
          </div>
        </section>

        {/* Утверждение красным в правых двух третях */}
        <section id="about" className={`${s.wrap} ${s.statement}`} aria-label={V9.nav.about[lang]}>
          <p className={s.aside}>{V9.statementAside[lang]}</p>
          <p className={s.statementText}>{V9.statement[lang]}</p>
        </section>

        {/* Эллипс крема заливает экран */}
        <Reveal labelledBy="v9-quilt">
          <h2 id="v9-quilt" className={s.quilt} style={fit(V9.quilt[lang])}>
            {V9.quilt[lang]}
          </h2>
          <p className={s.quiltNote}>{BRAND_TEXT.nameStory[lang]}</p>
        </Reveal>

        {/* МЫ ДЕЛАЕМ */}
        <section id="services" className={`${s.wrap} ${s.services}`} aria-labelledby="v9-services">
          <div className={s.secHead}>
            <h2 id="v9-services" className={s.mega} style={fit(V9.servicesTitle[lang])}>
              {V9.servicesTitle[lang]}
            </h2>
            <p className={s.secLede}>{V9.servicesLede[lang]}</p>
          </div>
          <ServiceCards lang={lang} />

          {/* Промо-баннер: ивенты и тои */}
          <aside className={s.promo} aria-labelledby="v9-promo">
            <div className={s.promoCopy}>
              <span className={s.pill}>{V9.promoLabel[lang]}</span>
              <h3 id="v9-promo" className={s.promoTitle} style={fit(V9.promoTitle[lang])}>
                {V9.promoTitle[lang]}
              </h3>
              <p className={s.promoText}>{V9.promoText[lang]}</p>
              <OpenCategory id="events" className={`${s.btn} ${s.promoBtn}`}>
                {V9.promoCta[lang]}
              </OpenCategory>
            </div>
            <div className={s.ring} aria-hidden="true">
              <svg viewBox="0 0 200 200" className={s.ringText} style={{ "--ring-fs": lang === "ru" ? "9.5px" : "12px" } as React.CSSProperties}>
                <defs>
                  <path id={`v9-ring-${lang}`} d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
                </defs>
                <text>
                  <textPath href={`#v9-ring-${lang}`} textLength="527" lengthAdjust="spacing">
                    {V9.promoRing[lang].repeat(lang === "ru" ? 2 : 1)}
                  </textPath>
                </text>
              </svg>
            </div>
            <p className={s.ringNum}>
              <span className={s.ringBig}>5</span>
              <span className={s.ringLabel}>{V9.promoYears[lang]}</span>
            </p>
          </aside>

          <div className={s.bundles}>
            <div className={s.bundlesHead}>
              <h3 className={s.h3caps} style={fit(V9.bundlesTitle[lang])}>
                {V9.bundlesTitle[lang]}
              </h3>
              <p className={s.secLede}>{V9.bundlesLede[lang]}</p>
            </div>
            <Bundles lang={lang} />
          </div>
        </section>

        {/* Кейсы: плитки во всю ширину без зазоров */}
        <section id="cases" className={s.cases} aria-labelledby="v9-cases">
          <div className={`${s.wrap} ${s.secHead}`}>
            <h2 id="v9-cases" className={s.mega} style={fit(V9.casesTitle[lang])}>
              {V9.casesTitle[lang]}
            </h2>
            <p className={s.secLede}>
              {UI.nda[lang]} {UI.draftNote[lang]}
            </p>
          </div>
          <ul className={s.caseGrid}>
            {CASES.map((k, i) => (
              <li key={k.id} className={`${s.case} ${CASE_TONE[i % 4]}`} style={{ "--n": k.result.value[lang].length } as React.CSSProperties}>
                <div className={s.caseTop}>
                  <p className={s.caseClient}>{k.client[lang]}</p>
                  <p className={s.caseTags}>{k.categories.map((id) => SHORT[id]?.[lang]).join(", ")}</p>
                </div>
                <Shape i={CASE_SHAPE[i % 4] ?? i} className={s.caseShape} />
                <h3 className={s.caseHead}>
                  <Fill value={dt(k.result, lang)} className={s.caseNum} />
                  <span className={s.caseLabel}>{k.resultLabel[lang]}</span>
                </h3>
                <dl className={s.caseText}>
                  <div>
                    <dt>{V9.task[lang]}</dt>
                    <dd>{k.task[lang]}</dd>
                  </div>
                  <div>
                    <dt>{V9.did[lang]}</dt>
                    <dd>{k.did[lang]}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        {/* Крем: бегущая строка цифр */}
        <section className={s.stats} aria-labelledby="v9-stats">
          <div className={`${s.wrap} ${s.statsTop}`}>
            <h2 id="v9-stats" className="visually-hidden">
              {V9.statsLabel[lang]}
            </h2>
            <a href={PORTFOLIO_HREF} className={s.textLinkDark}>
              {UI.portfolio[lang]}
            </a>
          </div>
          <div className={s.marquee}>
            <div className={s.track}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={s.marqueeList} aria-hidden={copy ? true : undefined}>
                  {STATS.map((x, i) => (
                    <li key={i} className={s.stat}>
                      <Fill value={dt(x.value, lang)} className={s.statNum} />
                      <span className={s.statLabel}>{x.label[lang]}</span>
                      <span className={s.statSep} aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className={`${s.wrap} ${s.statsFoot}`}>
            <p className={s.statsNote}>{UI.draftNote[lang]}</p>
            <a href="#team" className={`${s.btn} ${s.btnDark} ${s.btnL}`}>
              {V9.toTeam[lang]}
            </a>
          </div>
        </section>

        {/* Команда */}
        <section id="team" className={`${s.wrap} ${s.team}`} aria-labelledby="v9-team">
          <div className={s.secHead}>
            <h2 id="v9-team" className={s.mega} style={fit(V9.teamTitle[lang])}>
              {V9.teamTitle[lang]}
            </h2>
            <p className={s.secLede}>{V9.teamLede[lang]}</p>
          </div>
          <ul className={s.people}>
            {TEAM.map((p, i) => {
              const cat = CATEGORIES.find((x) => x.id === p.category);
              const glyph = p.name.draft ? cat?.short[lang] ?? "" : p.name.value[lang].slice(0, 1);
              return (
                <li key={p.id} className={s.person}>
                  <div className={s.portrait} data-slot={`team-${p.id}`} aria-hidden="true">
                    <Shape i={i + 1} className={s.portraitShape} />
                    <span className={`${s.initial} ${p.name.draft ? s.initialSm : ""}`}>{glyph}</span>
                  </div>
                  <h3 className={s.personName}>
                    <Fill value={dt(p.name, lang)} />
                  </h3>
                  <p className={s.personRole}>{p.role[lang]}</p>
                  {p.exp && (
                    <p className={s.personExp}>
                      <Fill value={dt(p.exp, lang)} />
                    </p>
                  )}
                  <p className={s.personLine}>{p.line[lang]}</p>
                </li>
              );
            })}
          </ul>
          <div className={s.teamFoot}>
            <p>{BRAND_TEXT.partners[lang]}</p>
            <p className={s.muted}>{V9.portraitNote[lang]}</p>
          </div>
        </section>

        {/* Клиенты: мыльные пузыри + отзывы */}
        <section className={`${s.wrap} ${s.clients}`} aria-labelledby="v9-clients">
          <h2 id="v9-clients" className={s.mega} style={fit(V9.clientsTitle[lang])}>
            {V9.clientsTitle[lang]}
          </h2>
          <div className={s.clientsGrid}>
            <ul className={s.bubbles}>
              {CLIENT_LOGOS.map((x, i) => (
                <li key={i} className={`${s.bubble} ${s[`b${i + 1}`]}`}>
                  <Fill value={dt(x, lang)} className={s.bubbleText} />
                </li>
              ))}
            </ul>
            <p className={s.clientsText}>{V9.clientsText[lang]}</p>
          </div>

          <h2 className={`${s.h3caps} ${s.reviewsTitle}`} style={fit(V9.reviewsTitle[lang])}>
            {V9.reviewsTitle[lang]}
          </h2>
          <ul className={s.reviews}>
            {REVIEWS.map((r, i) => (
              <li key={i} className={s.review}>
                <blockquote className={s.quote}>
                  <p>{r.text[lang]}</p>
                </blockquote>
                <p className={s.who}>
                  <Fill value={dt(r.who, lang)} />
                  <span className={s.whoRole}>{r.role[lang]}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Крем: как работаем */}
        <section className={s.process} aria-labelledby="v9-process">
          <div className={s.wrap}>
            <h2 id="v9-process" className={s.mega} style={fit(V9.processTitle[lang])}>
              {V9.processTitle[lang]}
            </h2>
            <ul className={s.principles}>
              {PRINCIPLES.map((p, i) => (
                <li key={i} className={s.principle}>
                  <h3 className={s.principleTitle}>{p.title[lang]}</h3>
                  <p className={s.principleText}>{p.text[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Заявка */}
        <section id="form" className={`${s.wrap} ${s.formSec}`} aria-labelledby="v9-form">
          <h2 id="v9-form" className={s.mega} style={fit(V9.formTitle[lang])}>
            {V9.formTitle[lang]}
          </h2>
          <div className={s.formGrid}>
            <div className={s.stepsCol}>
              <h3 className={s.stepsTitle}>{V9.stepsTitle[lang]}</h3>
              <ol className={s.steps}>
                {STEPS.map((st, i) => (
                  <li key={i} className={s.step}>
                    <span className={s.stepNum} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={s.stepTitle}>{st.title[lang]}</span>
                    <span className={s.stepText}>
                      {i === 0 ? (
                        <>
                          <Fill value={dt(RESPONSE_TIME, lang)} /> {st.text[lang]}
                        </>
                      ) : (
                        st.text[lang]
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <LeadForm lang={lang} />
          </div>
        </section>
      </main>

      {/* Подвал */}
      <footer id="contacts" className={s.footer}>
        <div className={s.wrap}>
          <div className={s.footCenter}>
            <KMark className={s.footMark} />
            <p className={s.footPhone}>
              {phone.href ? <a href={phone.href}>{phone.value.value}</a> : <Fill value={phone.value} />}
            </p>
            <p className={s.footLine}>
              <Fill value={EMAIL} />
            </p>
            <p className={s.footLine}>
              {UI.address[lang]}: <Fill value={ADDRESS} />
            </p>
            <p className={s.footLine}>
              <Fill note={V9.map.ru}>{V9.map[lang]}</Fill>
            </p>
            <ul className={s.socials}>
              {c.map((x) =>
                x.href ? (
                  <li key={x.id}>
                    <a href={x.href} className={s.social}>
                      {x.label[lang]}
                    </a>
                  </li>
                ) : (
                  <li key={x.id} className={s.social}>
                    <Fill note={x.value.note}>{x.label[lang]}</Fill>
                  </li>
                ),
              )}
            </ul>
            <LangSwitch lang={lang} className={s.footLang} />
          </div>

          <a href="#top" className={s.bigTop} aria-label={UI.toTop[lang]} style={{ "--em": lang === "ru" ? 11.5 : 14.7 } as React.CSSProperties}>
            {V9.toTop[lang]} <span aria-hidden="true">↑</span>
          </a>
          <nav aria-label={V9.footerNav[lang]}>
            <ul className={s.footNav}>
              {SECTIONS.map((x) => (
                <li key={x.key}>
                  <a href={x.href} className={s.navLink}>
                    {V9.nav[x.key][lang]}
                  </a>
                </li>
              ))}
              <li>
                <a href="#form" className={s.navLink}>
                  {UI.discuss[lang]}
                </a>
              </li>
            </ul>
          </nav>
          <div className={s.copy}>
            <span>© {new Date().getFullYear()} {V9.rights[lang]}</span>
            <span className={s.tagline}>{KURAK_TAGLINE}</span>
          </div>
        </div>
      </footer>

      <MobileBar lang={lang} />
    </div>
  );
}
