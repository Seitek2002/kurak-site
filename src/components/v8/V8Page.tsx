import Link from "next/link";
import { KurakLogo } from "@/components/brand/KurakLogo";
import { Fill } from "@/components/Fill";
import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CATEGORIES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
  FAQ,
  FORM,
  LANGS,
  PORTFOLIO_HREF,
  PRINCIPLES,
  RESPONSE_TIME,
  REVIEWS,
  STATS,
  STEPS,
  TEAM,
  UI,
  VALUES,
  dt,
  htmlLang,
  variantPath,
  type Lang,
} from "@/content/kurak";
import { V8 } from "@/content/v8";
import { ServiceArt, Glyph } from "./Art";
import { AboutArt } from "./AboutArt";
import { Cart } from "./Cart";
import { HeroDisc } from "./HeroDisc";
import { IconInstagram, IconPhone, IconTelegram, IconUp, IconWhatsApp } from "./Icons";
import { LeadForm } from "./LeadForm";
import { Menu } from "./Menu";
import { figure } from "./People";
import { V8Header } from "./V8Header";
import s from "./V8.module.css";

/** Картинка-тарелка к кейсу: услуга, которая сделала результат */
const CASE_ART: Record<string, string> = { coffee: "smm-target", forum: "ev-forum", clinic: "sa-crm", food: "br-identity" };
/** Порядок персонажей в общей сцене: менеджер в центре */
const SCENE = ["nurchik", "bibinur", "oksana", "smm-lead", "pr-lead"];
const ICON: Record<string, () => React.ReactElement> = { whatsapp: IconWhatsApp, telegram: IconTelegram, instagram: IconInstagram, phone: IconPhone };

/** Гирлянда из треугольников (буква A логотипа) над сценой команды: праздник, как на тоях и открытиях */
function Garland() {
  const flags = Array.from({ length: 17 }, (_, k) => {
    const t = (k + 0.5) / 17;
    const x = 1000 * t;
    const y = 8 + 2 * (1 - t) * t * 70;
    return { x, y, c: ["f-red", "f-sun", "f-pink", "f-coral"][k % 4] };
  });
  return (
    <svg viewBox="0 0 1000 110" preserveAspectRatio="none" className={s.garland} aria-hidden="true" focusable="false">
      <path d="M0 8Q500 148 1000 8" className="s-ink" strokeWidth="2" opacity="0.5" vectorEffect="non-scaling-stroke" />
      {flags.map((f) => (
        <path key={f.x} d={`M${f.x - 18} ${f.y}h36l-18 34z`} className={f.c} />
      ))}
    </svg>
  );
}

/**
 * Вариант 8 «Меню»: подача Додо Пиццы на языке Курака.
 * Порядок: «Мы — Курак» → меню с лентой категорий и комбо → о нас → команда в 2D → цифры → кейсы → отзывы →
 * как работаем → вопросы → заявка → подвал. Одна разметка для двух языков.
 */
export function V8Page({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const how = [
    ...VALUES.map((v, k) => ({ glyph: k as 0 | 1 | 2, title: v.title, text: v.text, example: v.example })),
    { glyph: 3 as const, title: PRINCIPLES[3]!.title, text: PRINCIPLES[3]!.text, example: null },
  ];

  return (
    <div lang={htmlLang(lang)} className={s.page}>
      <V8Header lang={lang} />

      <main id="main">
        {/* 1. Первый экран: «Мы — Курак», что делаем, одна кнопка */}
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={`v8-wrap ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <h1 id="hero-title" className={s.heroTitle}>
                {V8.hero.title[lang]}
              </h1>
              <p className={s.heroOne}>{BRAND_TEXT.oneLine[lang]}.</p>
              <p className={s.heroPromise}>{BRAND_TEXT.promise[lang]}</p>
              <div className={s.heroCta} id="hero-cta">
                <a href="#zayavka" className="v8-btn v8-btn--primary v8-btn--lg">
                  {UI.discuss[lang]}
                </a>
                <a href={PORTFOLIO_HREF} className={`v8-link ${s.heroPdf}`}>
                  {UI.portfolio[lang]}
                </a>
              </div>
            </div>
            <HeroDisc lang={lang} />
          </div>
        </section>

        {/* 2. Меню услуг */}
        <Menu lang={lang} />

        {/* 3. О нас */}
        <section id="about" className={s.section} aria-labelledby="about-title">
          <div className="v8-wrap">
            <div className={s.aboutHead}>
              <h2 id="about-title" className={s.h2}>
                {V8.about.title[lang]}
              </h2>
              <p className={s.aboutStory}>{BRAND_TEXT.nameStory[lang]}</p>
            </div>
            <ul className={s.aboutGrid}>
              {V8.about.blocks.map((b) => (
                <li key={b.id} className={s.aboutCard} data-block={b.id}>
                  <AboutArt id={b.id} className={s.aboutArt} />
                  <h3 className={s.h3}>{b.title[lang]}</h3>
                  <p className={s.aboutText}>{b.text[lang]}</p>
                  {b.drafts.length > 0 ? (
                    <ul className={s.promises}>
                      {b.drafts.map((x) => (
                        <li key={x.value.ru}>
                          <Fill value={dt(x, lang)} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. Команда: персонажи по отдельности, сцена из них */}
        <section id="team" className={s.section} aria-labelledby="team-title">
          <div className="v8-wrap">
            <div className={s.splitHead}>
              <h2 id="team-title" className={s.h2}>
                {V8.team.title[lang]}
              </h2>
              <p className={s.lede}>{V8.team.lede[lang]}</p>
            </div>

            <figure className={s.scene}>
              <Garland />
              <ul className={s.cast} aria-label={V8.team.sceneLabel[lang]}>
                {SCENE.map((id) => {
                  const p = TEAM.find((x) => x.id === id)!;
                  return (
                    <li key={id} className={s.actor} data-id={id}>
                      <svg viewBox="0 0 160 300" className={s.actorSvg} aria-hidden="true" focusable="false">
                        {figure(id)}
                      </svg>
                      <span className={s.tag}>
                        <Fill value={dt(p.name, lang)} />
                      </span>
                    </li>
                  );
                })}
              </ul>
              <figcaption className={s.sceneNote}>{V8.team.artNote[lang]}</figcaption>
            </figure>

            <ul className={s.people}>
              {TEAM.map((p) => {
                return (
                  <li key={p.id} className={s.person}>
                    <span className={s.face}>
                      <svg viewBox="22 26 116 116" aria-hidden="true" focusable="false">
                        {figure(p.id)}
                      </svg>
                    </span>
                    <h3 className={s.personName}>
                      <Fill value={dt(p.name, lang)} />
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
            <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
          </div>
        </section>

        {/* 5. Цифры */}
        <section className={s.section} aria-labelledby="stats-title">
          <div className="v8-wrap">
            <h2 id="stats-title" className={s.h2}>
              {V8.stats.title[lang]}
            </h2>
            <ul className={s.stats}>
              {STATS.map((x) => (
                <li key={x.label.ru} className={s.stat}>
                  <span className={s.statNum}>
                    <Fill value={dt(x.value, lang)} />
                  </span>
                  <span className={s.statLabel}>{x.label[lang]}</span>
                </li>
              ))}
            </ul>
            <p className={s.draftNote}>{UI.draftNote[lang]}</p>
          </div>
        </section>

        {/* 6. Кейсы: результат цифрой в заголовке */}
        <section id="cases" className={s.section} aria-labelledby="cases-title">
          <div className="v8-wrap">
            <div className={s.splitHead}>
              <h2 id="cases-title" className={s.h2}>
                {V8.cases.title[lang]}
              </h2>
              <p className={s.lede}>
                {V8.cases.lede[lang]} {UI.nda[lang]}
              </p>
            </div>
            <ul className={s.cases}>
              {CASES.map((c) => (
                <li key={c.id} className={s.case}>
                  <ServiceArt id={CASE_ART[c.id] ?? "smm-target"} className={s.casePlate} />
                  <p className={s.caseClient}>{c.client[lang]}</p>
                  <h3 className={s.caseTitle}>
                    <span className={s.caseNum}>
                      <Fill value={dt(c.result, lang)} />
                    </span>{" "}
                    {c.resultLabel[lang]}
                  </h3>
                  <dl className={s.caseDl}>
                    <div>
                      <dt>{V8.cases.task[lang]}</dt>
                      <dd>{c.task[lang]}</dd>
                    </div>
                    <div>
                      <dt>{V8.cases.did[lang]}</dt>
                      <dd>{c.did[lang]}</dd>
                    </div>
                  </dl>
                  <ul className={s.caseTags}>
                    {c.categories.map((id) => {
                      const cat = CATEGORIES.find((x) => x.id === id)!;
                      return (
                        <li key={id}>
                          <a href={`#cat-${id}`}>{cat.short[lang]}</a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. Отзывы и клиенты */}
        <section id="reviews" className={s.section} aria-labelledby="reviews-title">
          <div className="v8-wrap">
            <h2 id="reviews-title" className={s.h2}>
              {V8.reviews.title[lang]}
            </h2>
            <ul className={s.reviews}>
              {REVIEWS.map((r) => (
                <li key={r.text.ru} className={s.review}>
                  <blockquote className={s.bubble}>
                    <p>{r.text[lang]}</p>
                  </blockquote>
                  <p className={s.reviewWho}>
                    <span className={s.reviewMark} aria-hidden="true">
                      <svg viewBox="0 0 40 40">
                        <circle cx="20" cy="15" r="6.5" className="f-grey" />
                        <path d="M7 36a13 12 0 0 1 26 0z" className="f-grey" />
                      </svg>
                    </span>
                    <span>
                      <strong>
                        <Fill value={dt(r.who, lang)} />
                      </strong>
                      <span className={s.reviewRole}>{r.role[lang]}</span>
                    </span>
                  </p>
                </li>
              ))}
            </ul>
            <ul className={s.logos} aria-label={V8.reviews.logos[lang]}>
              {CLIENT_LOGOS.map((x, k) => (
                <li key={k} className={s.logoSlot}>
                  <Fill value={dt(x, lang)} />
                </li>
              ))}
            </ul>
            <p className={s.draftNote}>{V8.reviews.logos[lang]}</p>
          </div>
        </section>

        {/* 8. Как работаем: четыре правила, у каждого своя фигура логотипа */}
        <section className={s.section} aria-labelledby="how-title">
          <div className="v8-wrap">
            <div className={s.splitHead}>
              <h2 id="how-title" className={s.h2}>
                {V8.how.title[lang]}
              </h2>
              <p className={s.lede}>{V8.how.lede[lang]}</p>
            </div>
            <ul className={s.how}>
              {how.map((h) => (
                <li key={h.title.ru} className={s.rule}>
                  <svg viewBox="0 0 120 100" className={s.ruleGlyph} aria-hidden="true" focusable="false">
                    <Glyph i={h.glyph} x={h.glyph === 3 ? 6 : 14} y={h.glyph === 3 ? 4 : 2} s={h.glyph === 3 ? 1 : 1.05} c="f-red" />
                  </svg>
                  <h3 className={s.h3}>{h.title[lang]}</h3>
                  <p className={s.ruleText}>{h.text[lang]}</p>
                  {h.example ? (
                    <p className={s.ruleExample}>
                      <Fill value={dt(h.example, lang)} />
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 9. Вопросы */}
        <section className={s.section} aria-labelledby="faq-title">
          <div className={`v8-wrap ${s.faqGrid}`}>
            <h2 id="faq-title" className={s.h2}>
              {V8.faq.title[lang]}
            </h2>
            <div className={s.faq}>
              {FAQ.map((f) => (
                <details key={f.q.ru} className={s.qa}>
                  <summary className={s.q}>{f.q[lang]}</summary>
                  <p className={s.a}>{f.a[lang]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Заявка */}
        <section id="zayavka" className={s.section} aria-labelledby="form-title">
          <div className="v8-wrap">
            <div className={s.order}>
              <div className={s.orderInfo}>
                <h2 id="form-title" className={s.h2}>
                  {FORM.title[lang]}
                </h2>
                <p className={s.orderLede}>{V8.form.lede[lang]}</p>
                <h3 className={s.orderSub}>{V8.form.next[lang]}</h3>
                <ol className={s.steps}>
                  {STEPS.map((st, k) => (
                    <li key={st.title.ru} className={s.step}>
                      <span className={s.stepN} aria-hidden="true">
                        {k + 1}
                      </span>
                      <span>
                        <strong className={s.stepTitle}>
                          {st.title[lang]}
                          {k === 0 ? (
                            <>
                              {" "}
                              <Fill value={dt(RESPONSE_TIME, lang)} />
                            </>
                          ) : null}
                        </strong>
                        <span className={s.stepText}>{st.text[lang]}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <h3 className={s.orderSub}>{V8.form.orWrite[lang]}</h3>
                <ul className={s.channels}>
                  {CHANNELS.map((c) => {
                    const Icon = ICON[c.id] ?? IconPhone;
                    const inner = (
                      <>
                        <span className={s.chIcon}>
                          <Icon />
                        </span>
                        <span>
                          <span className={s.chLabel}>{c.label[lang]}</span>
                          <Fill value={c.value} />
                        </span>
                      </>
                    );
                    return (
                      <li key={c.id}>
                        {c.href ? (
                          <a href={c.href} className={s.channel}>
                            {inner}
                          </a>
                        ) : (
                          <span className={s.channel}>{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={s.orderForm}>
                <LeadForm lang={lang} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Подвал как у Додо: светлый, колонки ссылок, круглые соцсети */}
      <footer id="contacts" className={s.footer}>
        <div className={`v8-wrap ${s.footGrid}`}>
          <div className={s.footBrand}>
            <KurakLogo className={s.footLogo} title={BRAND_TEXT.name[lang]} />
            <p className={s.footLine}>{V8.footer.line[lang]}</p>
            <div role="group" aria-label={UI.langLabel[lang]} className={s.footLang}>
              {LANGS.map((l) => (
                <Link
                  key={l.id}
                  href={variantPath(8, l.id)}
                  hrefLang={l.id === "ky" ? "ky" : "ru"}
                  lang={l.id === "ky" ? "ky" : "ru"}
                  aria-current={l.id === lang ? "page" : undefined}
                  prefetch={false}
                >
                  {l.full}
                </Link>
              ))}
            </div>
          </div>

          <nav aria-labelledby="f-menu" className={s.footCol}>
            <h2 id="f-menu" className={s.footHead}>
              {V8.footer.menu[lang]}
            </h2>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href={`#cat-${c.id}`}>{c.short[lang]}</a>
                </li>
              ))}
              <li>
                <a href="#cat-combo">{V8.menu.combo[lang]}</a>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="f-kurak" className={s.footCol}>
            <h2 id="f-kurak" className={s.footHead}>
              {V8.footer.kurak[lang]}
            </h2>
            <ul>
              <li>
                <a href="#about">{V8.nav.about[lang]}</a>
              </li>
              <li>
                <a href="#team">{V8.nav.team[lang]}</a>
              </li>
              <li>
                <a href="#cases">{V8.nav.cases[lang]}</a>
              </li>
              <li>
                <a href="#reviews">{UI.nav.reviews[lang]}</a>
              </li>
              <li>
                <a href={PORTFOLIO_HREF}>{UI.portfolio[lang]}</a>
              </li>
              <li>
                <a href="#zayavka">{UI.discuss[lang]}</a>
              </li>
            </ul>
          </nav>

          <div className={s.footCol}>
            <h2 className={s.footHead}>{V8.footer.contacts[lang]}</h2>
            <ul>
              {CHANNELS.filter((c) => c.id !== "instagram").map((c) => (
                <li key={c.id}>
                  <span className={s.footMuted}>{c.label[lang]}:</span> <Fill value={c.value} />
                </li>
              ))}
              <li>
                <span className={s.footMuted}>{UI.address[lang]}:</span> <Fill value={ADDRESS} />
              </li>
              <li>
                <span className={s.footMuted}>E-mail:</span> <Fill value={EMAIL} />
              </li>
            </ul>
          </div>
        </div>

        <div className={`v8-wrap ${s.footBottom}`}>
          <ul className={s.socials} aria-label={V8.footer.social[lang]}>
            {CHANNELS.filter((c) => c.id !== "phone").map((c) => {
              const Icon = ICON[c.id] ?? IconPhone;
              return (
                <li key={c.id}>
                  {c.href ? (
                    <a href={c.href} className={s.social} aria-label={c.label[lang]}>
                      <Icon />
                    </a>
                  ) : (
                    <span className={`${s.social} ${s.socialDraft}`} role="img" aria-label={`${c.label[lang]}: ${V8.form.soon[lang]}`} title={V8.form.soon[lang]}>
                      <Icon />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <p className={s.footSmall}>
            © {year} {BRAND_TEXT.name[lang]}. {V8.footer.draft[lang]}
          </p>
          <a href="#main" className={s.up}>
            <IconUp />
            {V8.footer.up[lang]}
          </a>
        </div>
      </footer>

      <Cart lang={lang} />
    </div>
  );
}
