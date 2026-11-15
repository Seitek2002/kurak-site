import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
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
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto, teamPhoto } from "@/content/photos";
import { V12 } from "@/content/v12";
import { KurakLogo, KURAK_TAGLINE } from "@/components/brand/KurakLogo";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { Fill } from "../Fill";
import { Contact } from "./Contact";
import { Glyph } from "./Glyph";
import { Header, LangSwitch } from "./Header";
import { Hero } from "./Hero";
import { MobileBar } from "./MobileBar";
import { Routes } from "./Routes";
import { SmoothScroll } from "./SmoothScroll";
import { Ways } from "./Ways";
import s from "./V12.module.css";

/** «Руководитель SMM» → «руководитель SMM»: строчная только первая буква */
const lcFirst = (x: string) => (/^[A-ZА-ЯЁ]{2}/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1));

/** Флажок K из знака KURAK: источник вести */
function Flag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 120" className={className} aria-hidden="true" focusable="false">
      <path d="M6 4V116" className={s.flagPole} />
      <path d="M6 6H88L58 49L88 92H6Z" className={s.flagCloth} />
    </svg>
  );
}

/**
 * Вариант 12 «Жарчы». Агентство как глашатай: у вас есть что сказать, Курак делает так, чтобы весть услышали,
 * передали дальше и пришли к вам. Каждый блок выведен из этого образа.
 */
export function V12Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)} className={s.page} id="top">
      <SmoothScroll />
      <Header lang={lang} />

      <main id="main">
        <Hero lang={lang} />

        {/* Кто такой жарчы и при чём тут Курак */}
        <section className={s.herald} aria-labelledby="v12-herald">
          <div className={`${s.wrap} ${s.heraldGrid}`}>
            <div className={s.heraldWord}>
              <h2 id="v12-herald" className={s.word}>
                {V12.herald.word[lang]}
              </h2>
              <svg viewBox="0 0 80 160" className={s.wordCall} aria-hidden="true" focusable="false">
                <path d="M10 50A40 40 0 0 1 10 110" />
                <path d="M28 28A64 64 0 0 1 28 132" />
                <path d="M46 6A88 88 0 0 1 46 154" />
              </svg>
            </div>
            <div className={s.heraldFacts}>
              <p className={s.gloss}>{V12.herald.gloss[lang]}</p>
              <p className={s.facts}>{V12.herald.facts[lang]}</p>
              <p className={s.source}>{V12.herald.source[lang]}</p>
            </div>
          </div>

          <div className={`${s.wrap} ${s.heraldMain}`}>
            <p className={`${s.display} ${s.statement}`}>{V12.herald.statement[lang]}</p>
            <div className={s.heraldCols}>
              <p className={s.lede}>{V12.herald.text[lang]}</p>
              <p className={s.cycle}>
                <span className={s.cycleLead}>{V12.herald.cycleLead[lang]}</span> {BRAND_TEXT.cycle[lang]}
              </p>
            </div>
            <ul className={s.stats} aria-label={V12.herald.statsLabel[lang]}>
              {STATS.map((x) => (
                <li key={x.label.ru} className={s.stat}>
                  <span className={s.statNum}>
                    <Fill value={dt(x.value, lang)} />
                  </span>
                  <span className={s.statLabel}>{x.label[lang]}</span>
                </li>
              ))}
            </ul>
            <p className={s.statsNote}>{UI.draftNote[lang]}</p>
            <figure className={s.proverb}>
              <blockquote lang="ky">
                <p>{V12.herald.proverb.ky}</p>
              </blockquote>
              <figcaption>{V12.herald.proverbNote[lang]}</figcaption>
            </figure>
          </div>
        </section>

        {/* Восемь способов, которыми идёт весть */}
        <section id="ways" className={s.waysSec} aria-labelledby="v12-ways">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 id="v12-ways" className={`${s.display} ${s.h2}`}>
                {V12.ways.title[lang]}
              </h2>
              <p className={s.lede}>{V12.ways.lede[lang]}</p>
            </div>
            <Ways lang={lang} />
          </div>
        </section>

        {/* Пакеты: маршруты вести */}
        <section className={s.routesSec} aria-labelledby="v12-routes">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 id="v12-routes" className={`${s.display} ${s.h2}`}>
                {V12.routes.title[lang]}
              </h2>
              <p className={s.lede}>{V12.routes.lede[lang]}</p>
            </div>
            <Routes lang={lang} />
          </div>
        </section>

        {/* Кейсы: как далеко дошла весть */}
        <section id="cases" className={s.casesSec} aria-labelledby="v12-cases">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 id="v12-cases" className={`${s.display} ${s.h2}`}>
                {V12.cases.title[lang]}
              </h2>
              <p className={s.lede}>
                {UI.nda[lang]} {UI.draftNote[lang]}
              </p>
            </div>
            <ul className={s.cases}>
              {CASES.map((k) => (
                <li key={k.id}>
                  <article className={s.case} aria-labelledby={`v12-case-${k.id}`}>
                    <div className={s.casePhoto}>
                      <PhotoSlot kind="scene" src={casePhoto(k.id)} label={SLOT_TEXT.project[lang]} className={s.caseSlot} />
                    </div>
                    <div className={s.caseBody}>
                      <h3 id={`v12-case-${k.id}`} className={s.caseHead}>
                        <span className={s.caseNum}>
                          <Fill value={dt(k.result, lang)} />
                        </span>
                        <span className={s.caseLabel}>{k.resultLabel[lang]}</span>
                      </h3>
                      <p className={s.caseClient}>{k.client[lang]}</p>
                      <dl className={s.caseDl}>
                        <div>
                          <dt>{V12.cases.task[lang]}</dt>
                          <dd>{k.task[lang]}</dd>
                        </div>
                        <div>
                          <dt>{V12.cases.did[lang]}</dt>
                          <dd>{k.did[lang]}</dd>
                        </div>
                      </dl>
                      <ul className={s.caseWays} aria-label={V12.cases.ways[lang]}>
                        {k.categories.map((cat) => (
                          <li key={cat}>
                            <Glyph id={cat} className={s.caseGlyph} />
                            {V12.ways.list[cat].name[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Принципы: как говорит жарчы. Заголовок отдаётся эхом */}
        <section className={s.princSec} aria-labelledby="v12-princ">
          <div className={s.wrap}>
            <h2 id="v12-princ" className={`${s.display} ${s.h2}`}>
              {V12.principles.title[lang]}
            </h2>
            <ul className={s.princ}>
              {PRINCIPLES.map((p) => (
                <li key={p.title.ru} className={s.pr} data-reveal>
                  <h3 className={s.prTitle}>
                    {p.title[lang]}
                    <span className={s.prEcho} aria-hidden="true">
                      {p.title[lang]}
                    </span>
                    <span className={`${s.prEcho} ${s.prEcho2}`} aria-hidden="true">
                      {p.title[lang]}
                    </span>
                  </h3>
                  <p className={s.prText}>{p.text[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Команда: жарчы Курака */}
        <section id="team" className={s.teamSec} aria-labelledby="v12-team">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 id="v12-team" className={`${s.display} ${s.h2}`}>
                {V12.team.title[lang]}
              </h2>
              <p className={s.lede}>{V12.team.lede[lang]}</p>
            </div>
            <ul className={s.team}>
              {TEAM.map((p) => {
                const label = `${SLOT_TEXT.portrait[lang]}: ${p.name.draft ? lcFirst(p.role[lang]) : p.name.value[lang]}`;
                return (
                  <li key={p.id} className={s.person}>
                    <div className={s.rod} aria-hidden="true" />
                    <div className={s.banner}>
                      <PhotoSlot kind="person" src={teamPhoto(p.id)} label={label} className={s.bannerSlot} />
                      {!teamPhoto(p.id) && (
                        <svg viewBox="0 0 100 130" preserveAspectRatio="none" className={s.bannerEdge} aria-hidden="true" focusable="false">
                          <path d="M1 1H99V129L50 108L1 129Z" vectorEffect="non-scaling-stroke" />
                        </svg>
                      )}
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
                    <p className={s.personWay}>
                      <Glyph id={p.category} className={s.personGlyph} />
                      <span>
                        {V12.team.leadsWay[lang]}: {V12.ways.list[p.category].name[lang]}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
          </div>
        </section>

        {/* Клиенты и отзывы: сүйүнчү, ответные вести */}
        <section className={s.revSec} aria-labelledby="v12-rev">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 id="v12-rev" className={`${s.display} ${s.h2}`}>
                {V12.reviews.title[lang]}
              </h2>
              <p className={s.lede}>{V12.reviews.lede[lang]}</p>
            </div>
            <div className={s.revGrid}>
              <Flag className={s.revFlag} />
              <ul className={s.reviews}>
                {REVIEWS.map((r, i) => (
                  <li key={i} className={s.review}>
                    <figure>
                      <blockquote className={s.quote}>
                        <p>{r.text[lang]}</p>
                      </blockquote>
                      <figcaption className={s.who}>
                        <PhotoSlot kind="person" hideLabel src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} className={s.whoSlot} />
                        <span>
                          <Fill value={dt(r.who, lang)} />
                          <span className={s.whoRole}>{r.role[lang]}</span>
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
            <p className={s.revNote}>{UI.draftNote[lang]}</p>
            <div className={s.logos}>
              <p className={s.logosLabel}>{V12.reviews.logos[lang]}</p>
              <ul className={s.logoRow}>
                {CLIENT_LOGOS.map((_, i) => (
                  <li key={i} className={s.logo}>
                    <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.logoSlot} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Заявка: жар салабыз */}
        <section id="contact" className={s.contactSec} aria-labelledby="v12-contact">
          <div className={`${s.wrap} ${s.contactGrid}`}>
            <div className={s.contactIntro}>
              <h2 id="v12-contact" className={`${s.display} ${s.contactTitle}`}>
                {V12.contact.title[lang]}
              </h2>
              <p className={s.lede}>{V12.contact.lede[lang]}</p>
              <div className={s.steps}>
                <h3 className={s.stepsTitle}>{V12.contact.stepsTitle[lang]}</h3>
                <ol>
                  {STEPS.map((x, i) => (
                    <li key={x.title.ru} className={s.step}>
                      <span className={s.stepDot} aria-hidden="true">
                        {i + 1}
                      </span>
                      <span>
                        <strong className={s.stepTitle}>
                          {x.title[lang]}
                          {i === 0 && (
                            <>
                              {" "}
                              <Fill value={dt(RESPONSE_TIME, lang)} />
                            </>
                          )}
                        </strong>
                        <span className={s.stepText}>{x.text[lang]}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <Contact lang={lang} />
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`${s.wrap} ${s.footGrid}`}>
          <div className={s.footBrand}>
            <KurakLogo className={s.footLogo} title={BRAND_TEXT.name[lang]} />
            <p className={s.footTag} aria-hidden="true">
              {KURAK_TAGLINE}
            </p>
            <p className={s.footOne}>{BRAND_TEXT.oneLine[lang]}.</p>
            <p className={s.footStory}>{BRAND_TEXT.nameStory[lang]}</p>
          </div>
          <div className={s.footCol}>
            <h2 className={s.footH}>{V12.footer.contacts[lang]}</h2>
            <ul className={s.footList}>
              {CHANNELS.map((c) => (
                <li key={c.id}>
                  <span className={s.footKey}>{c.label[lang]}</span>
                  {c.href ? (
                    <a href={c.href} className={s.footLink}>
                      <Fill value={c.value} />
                    </a>
                  ) : (
                    <Fill value={c.value} />
                  )}
                </li>
              ))}
              <li>
                <span className={s.footKey}>E-mail</span>
                <Fill value={EMAIL} />
              </li>
              <li>
                <span className={s.footKey}>{UI.address[lang]}</span>
                <Fill value={ADDRESS} />
              </li>
            </ul>
          </div>
          <div className={s.footCol}>
            <LangSwitch lang={lang} className={s.footLang} />
            <a href="#top" className={s.footTop}>
              {V12.footer.toTop[lang]}
            </a>
            <p className={s.footPartners}>{BRAND_TEXT.partners[lang]}</p>
          </div>
        </div>
      </footer>

      <MobileBar lang={lang} />
    </div>
  );
}
