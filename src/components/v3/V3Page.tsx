import Link from "next/link";
import { CASES, SITE } from "@/content/site";
import { CASES3, FAQ3, PAINS, PATH, STEPS3, TEAM3, UI, WORDS, type Lang } from "@/content/v3";
import { Mark } from "../Mark";
import { Patch } from "../Patch";
import { Fill } from "../Fill";
import { Portrait } from "../Portrait";
import { VariantSwitch, VariantLinks } from "../VariantSwitch";
import { Wizard } from "./Wizard";
import { V3Form } from "./V3Form";
import { PainButton } from "./PainButton";
import { IconPhone, IconTelegram, IconWhatsApp } from "./Icons";
import s from "./V3.module.css";

/** Вариант 3 «Кеңеш»: одна разметка для русской и кыргызской страниц, язык приходит пропсом. */
export function V3Page({ lang }: { lang: Lang }) {
  const c = SITE.contacts;
  const other: Lang = lang === "ru" ? "ky" : "ru";
  const sections = [
    { href: "#podbor", label: UI.nav.pick![lang] },
    { href: "#situacii", label: UI.nav.pains![lang] },
    { href: "#slovar", label: UI.nav.words![lang] },
    { href: "#svyaz", label: UI.nav.contact![lang] },
  ];

  return (
    <div lang={lang === "ky" ? "ky" : "ru"}>
      <header className={s.header}>
        <div className={`container ${s.headRow}`}>
          <Link href={PATH[lang]} className={s.logo} aria-label={UI.homeLabel[lang]}>
            <Mark className={s.mark} />
            <span className={s.word}>Курак</span>
          </Link>
          <nav aria-label={lang === "ru" ? "Разделы" : "Бөлүмдөр"} className={s.nav}>
            <ul>
              {sections.map((x) => (
                <li key={x.href}>
                  <a href={x.href} className={s.navLink}>{x.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.headActions}>
            <nav aria-label={UI.langLabel[lang]} className={s.lang}>
              {(["ru", "ky"] as Lang[]).map((l) => (
                <Link
                  key={l}
                  href={PATH[l]}
                  prefetch={false}
                  hrefLang={l}
                  lang={l}
                  className={s.langOpt}
                  aria-current={l === lang ? "page" : undefined}
                >
                  {UI.langName[l]}
                </Link>
              ))}
            </nav>
            <VariantSwitch tone="paper" className={s.variant} label={UI.variant[lang]} />
            <a href="#svyaz" className={`v3-btn ${s.headCta}`}>
              {UI.write[lang]}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Первый экран: заголовок и сразу первый вопрос помощника */}
        <section className={s.hero} aria-labelledby="v3-title">
          <div className={`container ${s.heroGrid}`}>
            <div className={s.heroCopy}>
              <h1 id="v3-title" className={s.heroTitle}>{UI.heroTitle[lang]}</h1>
              <p className={s.heroLede}>{UI.heroLede[lang]}</p>
              <div className={s.heroCats} aria-hidden="true">
                {(["smm", "pr", "events", "brand", "sales", "digital", "team", "invest"] as const).map((cat) => (
                  <span key={cat} data-cat={cat}>
                    <Patch cat={cat} plain />
                  </span>
                ))}
              </div>
            </div>
            <Wizard lang={lang} />
          </div>
        </section>

        {/* Знакомые ситуации */}
        <section id="situacii" className={s.section} aria-labelledby="pains-title">
          <div className="container">
            <div className={s.head}>
              <h2 id="pains-title" className={s.h2}>{UI.painsTitle[lang]}</h2>
              <p className={s.lede}>{UI.painsLede[lang]}</p>
            </div>
            <ul className={s.pains}>
              {PAINS.map((p) => (
                <li key={p.id} className={s.pain} data-cat={p.cat}>
                  <details className={s.painDetails}>
                    <summary className={s.painSummary}>
                      <span className={s.painPatch} aria-hidden="true">
                        <Patch cat={p.cat} plain />
                      </span>
                      <span className={s.painProblem}>{p.problem[lang]}</span>
                      <span className={s.painPlus} aria-hidden="true" />
                    </summary>
                    <div className={s.painBody}>
                      <p>
                        <strong>{UI.weDo[lang]}:</strong> {p.answer[lang]}
                      </p>
                      <PainButton need={p.need} label={UI.addToPlan[lang]} className={s.painLink} />
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Как начать */}
        <section className={`${s.band} on-field`} aria-labelledby="steps-title">
          <div className="container">
            <h2 id="steps-title" className={s.h2}>{UI.stepsTitle[lang]}</h2>
            <ol className={s.steps}>
              {STEPS3.map((st, i) => (
                <li key={i} className={s.stepItem}>
                  <span className={s.stepN} aria-hidden="true">{i + 1}</span>
                  <h3 className={s.stepTitle}>{st.title[lang]}</h3>
                  <p>{st.text[lang]}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Было и стало */}
        <section id="keisy" className={s.section} aria-labelledby="cases-title">
          <div className="container">
            <h2 id="cases-title" className={s.h2}>{UI.casesTitle[lang]}</h2>
            <ul className={s.cases}>
              {CASES3.map((k) => {
                const src = CASES.find((x) => x.id === k.id)!;
                return (
                  <li key={k.id} className={s.case} data-cat={k.cat}>
                    <p className={s.caseClient}>{k.client[lang]}</p>
                    <p className={s.caseResult}>
                      <Fill value={src.result} />
                      <span className={s.caseLabel}>{k.resultLabel[lang]}</span>
                    </p>
                    <dl className={s.caseStory}>
                      <div>
                        <dt>{UI.before[lang]}</dt>
                        <dd>{k.before[lang]}</dd>
                      </div>
                      <div>
                        <dt>{UI.after[lang]}</dt>
                        <dd>{k.after[lang]}</dd>
                      </div>
                    </dl>
                  </li>
                );
              })}
            </ul>
            <p className={s.note}>{UI.draftNote[lang]}</p>
          </div>
        </section>

        {/* Словарь */}
        <section id="slovar" className={`${s.section} ${s.wordsSection}`} aria-labelledby="words-title">
          <div className={`container ${s.wordsGrid}`}>
            <div className={s.head}>
              <h2 id="words-title" className={s.h2}>{UI.wordsTitle[lang]}</h2>
              <p className={s.lede}>{UI.wordsLede[lang]}</p>
            </div>
            <dl className={s.words}>
              {WORDS.map((w) => (
                <div key={w.term} className={s.wordItem}>
                  <dt>{w.term}</dt>
                  <dd>{w.text[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Команда */}
        <section className={s.section} aria-labelledby="team3-title">
          <div className="container">
            <h2 id="team3-title" className={s.h2}>{UI.teamTitle[lang]}</h2>
            <ul className={s.team}>
              {TEAM3.map((p) => (
                <li key={p.name} className={s.person}>
                  <div className={s.personPhoto}>
                    <Portrait person={{ name: { value: p.name, draft: false }, role: p.role[lang], line: "", category: p.cat }} />
                  </div>
                  <div>
                    <h3 className={s.personName}>{p.name}</h3>
                    <p className={s.personRole}>{p.role[lang]}</p>
                    {p.exp && <p className={s.personExp}>{p.exp[lang]}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <p className={s.note}>{UI.partners[lang]}</p>
          </div>
        </section>

        {/* Вопросы */}
        <section className={s.section} aria-labelledby="faq3-title">
          <div className={`container ${s.faqGrid}`}>
            <h2 id="faq3-title" className={s.h2}>{UI.faqTitle[lang]}</h2>
            <div className={s.faq}>
              {FAQ3.map((f, i) => (
                <details key={i} className={s.faqItem} name="faq3" open={i === 0}>
                  <summary className={s.faqQ}>
                    {f.q[lang]}
                    <span className={s.painPlus} aria-hidden="true" />
                  </summary>
                  <p className={s.faqA}>{f.a[lang]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Связь */}
        <section id="svyaz" className={`${s.contact} on-field`} aria-labelledby="contact-title">
          <div className={`container ${s.contactGrid}`}>
            <div className={s.contactCopy}>
              <h2 id="contact-title" className={s.h2}>{UI.contactTitle[lang]}</h2>
              <p className={s.contactLede}>{UI.contactLede[lang]}</p>
              <ul className={s.channels}>
                <li>
                  {c.whatsappHref ? (
                    <a className="v3-btn v3-btn--wa" href={c.whatsappHref} target="_blank" rel="noopener noreferrer"><IconWhatsApp />WhatsApp</a>
                  ) : (
                    <span className={s.channel}><IconWhatsApp />WhatsApp <Fill value={c.whatsapp} /></span>
                  )}
                </li>
                <li>
                  {c.telegramHref ? (
                    <a className="v3-btn v3-btn--ghost" href={c.telegramHref} target="_blank" rel="noopener noreferrer"><IconTelegram />Telegram</a>
                  ) : (
                    <span className={s.channel}><IconTelegram />Telegram <Fill value={c.telegram} /></span>
                  )}
                </li>
                <li>
                  {c.phoneHref ? (
                    <a className="v3-btn v3-btn--ghost" href={c.phoneHref}><IconPhone />{UI.call[lang]}</a>
                  ) : (
                    <span className={s.channel}><IconPhone />{UI.call[lang]} <Fill value={c.phone} /></span>
                  )}
                </li>
              </ul>
              <p className={s.address}>
                {UI.address[lang]}: <Fill value={c.address} />
              </p>
            </div>
            <div className={s.formCard}>
              <V3Form lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`container ${s.footGrid}`}>
          <div className={s.footBrand}>
            <span className={s.footLogo}>
              <Mark className={s.mark} />
              <span className={s.word}>Курак</span>
            </span>
            <p>{UI.footerAbout[lang]}</p>
          </div>
          <div>
            <h2 className={s.footH}>{UI.otherVariants[lang]}</h2>
            <ul className={s.footList}>
              <VariantLinks className="link" />
              <li>
                <Link className="link" href={PATH[other]} prefetch={false} hrefLang={other} lang={other}>
                  {other === "ky" ? "Кыргызча" : "На русском"}
                </Link>
              </li>
            </ul>
          </div>
          <p className={s.footBottom}>
            {UI.partners[lang]} © {new Date().getFullYear()} Курак
          </p>
        </div>
      </footer>

      {/* Телефон: две главные кнопки всегда под пальцем */}
      <nav className={s.mobileBar} aria-label={lang === "ru" ? "Быстрые действия" : "Тез аракеттер"}>
        <a href="#podbor" className="v3-btn">{UI.nav.pick![lang]}</a>
        <a href="#svyaz" className="v3-btn v3-btn--wa">
          <IconWhatsApp />
          {UI.write[lang]}
        </a>
      </nav>
    </div>
  );
}
