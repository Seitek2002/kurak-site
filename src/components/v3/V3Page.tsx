import Link from "next/link";
import { CASES, SITE } from "@/content/site";
import { CASES3, FAQ3, PAINS, PATH, STEPS3, TEAM3, UI, WORDS, type Lang } from "@/content/v3";
import { Fill } from "../Fill";
import { VariantSwitch, VariantLinks } from "../VariantSwitch";
import { Wizard } from "./Wizard";
import { V3Form } from "./V3Form";
import { PainButton } from "./PainButton";
import { MobileBar } from "./MobileBar";
import { IconPhone, IconTelegram, IconWhatsApp } from "./Icons";
import s from "./V3.module.css";

/** Фото кейсов: библиотека Hallmark (Wikimedia Commons), через «ксерокс» темы */
const PHOTOS: Record<string, { src: string; w: number; h: number; pos?: string }> = {
  coffee: { src: "v3/espresso.jpg", w: 960, h: 1438, pos: "50% 45%" },
  clinic: { src: "v3/clinic.jpg", w: 1280, h: 853, pos: "50% 55%" },
  food: { src: "v3/macarons.jpg", w: 960, h: 640 },
};
const CREDITS = [
  { name: "Shixart1985", href: "https://commons.wikimedia.org/wiki/File:Espresso_coffee_pouring_from_retro_espresso_machine.jpg", lic: "CC BY 2.0" },
  { name: "Daniel Sone", href: "https://commons.wikimedia.org/wiki/File:Stethoscope_and_Laptop_Computer_-_Nci-vol-9713-300.jpg", lic: "Public domain" },
  { name: "Sunny Ripert", href: "https://commons.wikimedia.org/wiki/File:Arc-en-ciel_comestible.jpg", lic: "CC BY-SA 2.0" },
];

/** Наклоны объявлений на стене: не больше трёх наклонённых на экран */
const TILT = ["-1.2deg", "0deg", "0.8deg", "0deg", "-0.6deg", "0deg"];

/**
 * Вариант 3 «Кеңеш» в теме Paste-up: путь работы с Кураком четырьмя шагами на доске объявлений, словарь и вопросы как справка.
 * Одна разметка для русской и кыргызской страниц, язык приходит пропсом.
 */
export function V3Page({ lang }: { lang: Lang }) {
  const c = SITE.contacts;
  const other: Lang = lang === "ru" ? "ky" : "ru";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const sections = [
    { href: "#podbor", label: UI.nav.pick![lang] },
    { href: "#situacii", label: UI.nav.pains![lang] },
    { href: "#slovar", label: UI.nav.words![lang] },
    { href: "#svyaz", label: UI.nav.contact![lang] },
  ];
  const tabs = [
    { key: "wa", icon: <IconWhatsApp />, label: "WhatsApp", value: c.whatsapp, href: c.whatsappHref },
    { key: "tg", icon: <IconTelegram />, label: "Telegram", value: c.telegram, href: c.telegramHref },
    { key: "call", icon: <IconPhone />, label: UI.call[lang], value: c.phone, href: c.phoneHref },
  ];

  return (
    <div lang={lang === "ky" ? "ky" : "ru"} className={s.page}>
      {/* Плавающая таблетка: лист бумаги поверх доски */}
      <header className={s.header}>
        <div className={`container ${s.headWrap}`}>
          <div className={s.pill}>
            <Link href={PATH[lang]} className={s.logo} aria-label={UI.homeLabel[lang]}>
              Курак
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
                  <Link key={l} href={PATH[l]} prefetch={false} hrefLang={l} lang={l} className={s.langOpt} aria-current={l === lang ? "page" : undefined}>
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
        </div>
      </header>

      <main id="main">
        {/* Первый экран: афишный заголовок слева, справа сам бланк помощника; на его угол наклеен флуоресцентный лист */}
        <section className={`${s.hero} v3-fibre`} aria-labelledby="v3-title">
          <div className={`container ${s.counter}`}>
            <div className={s.heroCopy}>
              <h1 id="v3-title" className={s.heroTitle}>{UI.heroTitle[lang]}</h1>
              <p className={s.heroLede}>{UI.heroLede[lang]}</p>
              <a href="#svyaz" className={`v3-btn ${s.heroWrite}`}>{UI.write[lang]}</a>
            </div>
            <div className={s.heroDesk}>
              <p className={`v3-sheet v3-sheet--fluoro ${s.fact}`} style={{ "--r": "-3deg" } as React.CSSProperties}>
                {UI.heroNote[lang]}
              </p>
              <Wizard lang={lang} />
            </div>
          </div>
        </section>

        {/* 1. Стена объявлений: знакомые ситуации */}
        <section id="situacii" className={`${s.stage} v3-fibre`} aria-labelledby="pains-title">
          <div className="container">
            <div className={s.splitHead}>
              <h2 id="pains-title" className={s.h2}>1. {UI.painsTitle[lang]}</h2>
              <p className={s.lede}>{UI.painsLede[lang]}</p>
            </div>
            <ul className={s.wall}>
              {PAINS.map((p, i) => (
                <li
                  key={p.id}
                  className={`v3-sheet ${i === 3 ? "v3-sheet--fluoro" : ""} ${s.notice}`}
                  style={{ "--r": TILT[i] } as React.CSSProperties}
                >
                  <h3 className={s.noticeHead}>{p.problem[lang]}</h3>
                  <p className={s.noticeText}>
                    <strong>{UI.weDo[lang]}:</strong> {p.answer[lang]}
                  </p>
                  <PainButton need={p.need} label={UI.addToPlan[lang]} className={s.noticeLink} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Как начать: одно заявление в три строки */}
        <section className={s.stage} aria-labelledby="steps-title">
          <div className="container">
            <h2 id="steps-title" className={`${s.h2} ${s.stageTitle}`}>2. {UI.stepsTitle[lang]}</h2>
            <ol className={s.statement}>
              {STEPS3.map((st, i) => (
                <li key={i} className={s.statementLine}>
                  <span className={s.statementText}>{st.title[lang]}</span>
                  <span className={s.statementNote}>{st.text[lang]}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Ксерокопии: было и стало */}
        <section id="keisy" className={s.stage} aria-labelledby="cases-title">
          <div className="container">
            <h2 id="cases-title" className={`${s.h2} ${s.stageTitle}`}>3. {UI.casesTitle[lang]}</h2>
            <ul className={s.cases}>
              {CASES3.map((k, i) => {
                const src = CASES.find((x) => x.id === k.id)!;
                const ph = PHOTOS[k.id]!;
                return (
                  <li key={k.id} className={`v3-sheet ${s.case} ${i === 0 ? s.caseLead : ""}`} style={{ "--r": i === 1 ? "-0.8deg" : "0deg" } as React.CSSProperties}>
                    <figure className={s.copy} data-slot={`case-${k.id}`} data-alt={k.client[lang]}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${base}/${ph.src}`} width={ph.w} height={ph.h} alt="" loading="lazy" decoding="async" style={{ objectPosition: ph.pos }} />
                    </figure>
                    <div className={s.caseBody}>
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
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className={s.note2}>{UI.draftNote[lang]}</p>
          </div>
        </section>

        {/* 4. Люди: имена крупно, строками */}
        <section className={s.stage} aria-labelledby="team3-title">
          <div className={`container ${s.rowsGrid}`}>
            <h2 id="team3-title" className={s.h2}>4. {UI.teamTitle[lang]}</h2>
            <div>
              <ul className={s.people}>
                {TEAM3.map((p) => (
                  <li key={p.name} className={s.personRow}>
                    <h3 className={s.personName}>{p.name}</h3>
                    <p className={s.personRole}>
                      {p.role[lang]}
                      {p.exp && <span className={s.personExp}>{p.exp[lang]}</span>}
                    </p>
                  </li>
                ))}
              </ul>
              <p className={s.note2}>{UI.partners[lang]}</p>
            </div>
          </div>
        </section>

        {/* Справка без номера: напечатанный листок-словарь */}
        <section id="slovar" className={s.stage} aria-labelledby="words-title">
          <div className={`container ${s.wordsGrid}`}>
            <div className={s.wordsHead}>
              <h2 id="words-title" className={s.h2}>{UI.wordsTitle[lang]}</h2>
              <p className={s.lede}>{UI.wordsLede[lang]}</p>
            </div>
            <div className={`v3-sheet ${s.typed}`} style={{ "--r": "0.6deg" } as React.CSSProperties}>
              <dl className={s.words}>
                {WORDS.map((w) => (
                  <div key={w.term} className={s.wordRow}>
                    <dt>{w.term}</dt>
                    <dd>{w.text[lang]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Справка без номера: вопросы строками */}
        <section className={s.stage} aria-labelledby="faq3-title">
          <div className={`container ${s.rowsGrid}`}>
            <h2 id="faq3-title" className={s.h2}>{UI.faqTitle[lang]}</h2>
            <div className={s.faq}>
              {FAQ3.map((f, i) => (
                <details key={i} className={s.faqItem} name="faq3" open={i === 0}>
                  <summary className={s.faqQ}>
                    {f.q[lang]}
                    <span className={s.faqMark} aria-hidden="true" />
                  </summary>
                  <p className={s.faqA}>{f.a[lang]}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Объявление с отрывными корешками и лист обратного звонка */}
        <section id="svyaz" className={`${s.close} v3-fibre`} aria-labelledby="contact-title">
          <div className={`container ${s.closeGrid}`}>
            <div className={`v3-sheet ${s.flyer}`} style={{ "--r": "-1deg" } as React.CSSProperties}>
              <div className={s.flyerBody}>
                <h2 id="contact-title" className={s.flyerTitle}>{UI.contactTitle[lang]}</h2>
                <p className={s.flyerLede}>{UI.contactLede[lang]}</p>
                <p className={s.address}>
                  {UI.address[lang]}: <Fill value={c.address} />
                </p>
              </div>
              <ul className={s.tabs}>
                {[...tabs, ...tabs].map((t, i) => {
                  const dup = i >= tabs.length;
                  const inner = (
                    <>
                      {t.icon}
                      <span className={s.tabLabel}>{t.label}</span>
                      {t.href ? <span className={s.tabValue}>{t.value.value}</span> : <Fill value={t.value} className={s.tabValue} />}
                    </>
                  );
                  return (
                    <li key={`${t.key}-${i}`} className={`${s.tab} ${dup ? s.tabDup : ""}`} aria-hidden={dup || undefined}>
                      {t.href ? (
                        <a className={s.tabInner} href={t.href} tabIndex={dup ? -1 : undefined} target={t.key === "call" ? undefined : "_blank"} rel="noopener noreferrer">
                          {inner}
                        </a>
                      ) : (
                        <span className={s.tabInner}>{inner}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={`v3-sheet ${s.formSheet}`}>
              <V3Form lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={`container ${s.footGrid}`}>
          <p className={s.footStatement}>{UI.footerAbout[lang]}</p>
          <div className={s.footCols}>
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
            <p className={`${s.footSmall} ${s.footRow}`}>
              {UI.partners[lang]} © {new Date().getFullYear()} Курак
            </p>
            <p className={s.footSmall} data-credits lang="ru">
              Фото: {CREDITS.map((cr, i) => (
                <span key={cr.href}>
                  <a className="link" href={cr.href}>{cr.name}</a> ({cr.lic}, Wikimedia Commons){i < CREDITS.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>

      {/* Телефон: две главные кнопки всегда под пальцем */}
      <MobileBar className={s.mobileBar} label={lang === "ru" ? "Быстрые действия" : "Тез аракеттер"}>
        <a href="#podbor" className="v3-btn v3-btn--primary">{UI.nav.pick![lang]}</a>
        <a href="#svyaz" className="v3-btn">
          <IconWhatsApp />
          {UI.write[lang]}
        </a>
      </MobileBar>
    </div>
  );
}
