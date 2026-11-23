import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CATEGORIES,
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
import { CASE_TOPIC, PHOTOS, SECTIONS, V9 } from "@/content/v9";
import { KURAK_TAGLINE, KurakLogo } from "@/components/brand/KurakLogo";
import { Fill } from "../Fill";
import { PhotoSlot } from "../brand/PhotoSlot";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto, teamPhoto } from "@/content/photos";
import { Header, LangSwitch } from "./Header";
import { Bundles, OpenCategory, ServiceCards } from "./Services";
import { Reveal } from "./Reveal";
import { LeadForm } from "./LeadForm";
import { MobileBar } from "./MobileBar";
import { KMark } from "./Shape";
import { BADGE_ORDER, KBadge, MiniQuilt, type BadgeId } from "./KBadge";
import { Ribbon } from "./Ribbon";
import { Contacts } from "./Contacts";
import { PortfolioShare } from "./PortfolioShare";
import { Photo } from "./Photo";
import s from "./V9.module.css";

const CASE_TONE = [s.case1, s.case2, s.case3, s.case4];
const SHORT = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.short]));
/** Лоскуты-разделители для бегущей строки цифр: на креме и на чернилах видны все */
const STAT_BADGES: BadgeId[] = ["brand", "smm", "events", "sales"];

/** «Руководитель SMM» → «руководитель SMM» для подписи «Фото: …»; аббревиатуры не трогаем */
const lowerFirst = (t: string) => (t.length > 1 && t[1] === t[1]!.toLowerCase() ? t[0]!.toLowerCase() + t.slice(1) : t);

/**
 * Число букв самого длинного слова: CSS подгоняет по нему кегль заголовка (--n в V9.module.css).
 * extra: запас в буквах, если после слова стоит курак-значок.
 */
const fit = (t: string, extra = 0) => ({ "--n": Math.max(...t.split(/\s+/).map((w) => w.length)) + extra }) as React.CSSProperties;

/** Заголовок секции: Kurak Display строчными, в конце маленький курак-значок */
function SecTitle({ id, text, badge, className }: { id?: string; text: string; badge: BadgeId; className?: string }) {
  // Значок держится за последнее слово, чтобы не уйти одной строкой вниз
  const words = text.split(" ");
  const last = words.pop()!;
  const head = words.join(" ");
  return (
    <h2 id={id} className={className ?? s.mega} style={fit(text, 1)}>
      {head ? `${head} ` : ""}
      <span className={s.nowrap}>
        {last}
        <KBadge id={badge} className={s.titleBadge} />
      </span>
    </h2>
  );
}

/**
 * Вариант 9: подача креативного агентства. Первый экран: вордмарк KURAK во всю ширину, «кто мы» и что делаем,
 * заявка, контакты, портфолио и красная лента ценностей. Дальше утверждение, фото-вставка, контрастный эллипс,
 * «Мы делаем» с курак-значками, кейсы (фото по теме + лоскут цвета), бегущая строка цифр, команда, фото-вставка,
 * клиенты и отзывы, принципы, заявка и подвал с атрибуцией фото и «Главная ↑». Тёмный и светлый режимы.
 */
export function V9Page({ lang }: { lang: Lang }) {
  const socials = CHANNELS.filter((x) => x.id === "instagram");
  const phone = CHANNELS.find((x) => x.id === "phone")!;
  const used = [...new Set([...CASES.filter((k) => !casePhoto(k.id) && CASE_TOPIC[k.id]).map((k) => CASE_TOPIC[k.id]!), "print" as const, "camera" as const])];

  return (
    <div lang={htmlLang(lang)} className={s.page} id="top">
      <Header lang={lang} />

      <main id="main">
        {/* Первый экран: знак во всю ширину, кто мы и что делаем, заявка, контакты, портфолио, лента ценностей */}
        <section className={s.hero} aria-labelledby="v9-h1">
          <div className={`${s.wrap} ${s.heroWrap}`}>
            <p className={s.heroMark}>
              <KurakLogo className={s.wordmark} title={BRAND_TEXT.name[lang]} />
            </p>
            <div className={s.heroMain}>
              <h1 id="v9-h1" className={s.heroTitle}>
                {V9.heroTitle[lang]}
              </h1>
              <p className={s.lede}>{BRAND_TEXT.promise[lang]}</p>
              <ul className={s.dirs} aria-label={V9.dirsLabel[lang]}>
                {CATEGORIES.map((c) => (
                  <li key={c.id} className={s.dir}>
                    <KBadge id={c.id} className={s.dirBadge} />
                    {c.short[lang]}
                  </li>
                ))}
              </ul>
              <div className={s.heroCta}>
                <a href="#form" id="v9-hero-cta" className={`${s.btn} ${s.btnRed} ${s.btnL}`}>
                  {UI.apply[lang]}
                </a>
              </div>
            </div>
            <div className={s.heroSide}>
              <h2 className={s.sideTitle}>{V9.contactsTitle[lang]}</h2>
              <Contacts lang={lang} />
              <PortfolioShare lang={lang} />
            </div>
          </div>
          <Ribbon lang={lang} />
        </section>

        {/* Утверждение красным в правых двух третях */}
        <section id="about" className={`${s.wrap} ${s.statement}`} aria-label={V9.nav.about[lang]}>
          <p className={s.aside}>{V9.statementAside[lang]}</p>
          <p className={s.statementText}>{V9.statement[lang]}</p>
        </section>

        {/* Фото-вставка: ручная работа */}
        <figure className={s.band}>
          <Photo id="print" lang={lang} className={s.bandImg} />
          <figcaption className={s.bandCap}>
            {V9.photoBy[lang]}: {PHOTOS.print.author}, {PHOTOS.print.license}
          </figcaption>
        </figure>

        {/* Контрастный эллипс заливает экран */}
        <Reveal labelledBy="v9-quilt">
          <MiniQuilt className={s.quiltMark} />
          <h2 id="v9-quilt" className={s.quilt} style={fit(V9.quilt[lang])}>
            {V9.quilt[lang]}
          </h2>
          <p className={s.quiltNote}>{BRAND_TEXT.nameStory[lang]}</p>
        </Reveal>

        {/* Мы делаем */}
        <section id="services" className={`${s.wrap} ${s.services}`} aria-labelledby="v9-services">
          <div className={`${s.secHead} ${s.servicesHead}`}>
            <h2 id="v9-services" className={s.mega} style={fit(V9.servicesTitle[lang])}>
              {V9.servicesTitle[lang]}
            </h2>
            <MiniQuilt className={s.servicesQuilt} />
            <p className={s.secLede}>{V9.servicesLede[lang]}</p>
          </div>
          <ServiceCards lang={lang} />

          {/* Промо-баннер: ивенты и тои */}
          <aside className={s.promo} aria-labelledby="v9-promo">
            <div className={s.promoCopy}>
              <span className={s.pill}>
                <KBadge id="events" />
                {V9.promoLabel[lang]}
              </span>
              <h3 id="v9-promo" className={s.promoTitle} style={fit(V9.promoTitle[lang])}>
                {V9.promoTitle[lang]}
              </h3>
              <p className={s.promoText}>{V9.promoText[lang]}</p>
              <OpenCategory id="events" className={`${s.btn} ${s.promoBtn}`}>
                {V9.promoCta[lang]}
              </OpenCategory>
            </div>
            <div className={s.ring} aria-hidden="true">
              <svg viewBox="0 0 200 200" className={s.ringText} style={{ "--ring-fs": lang === "ru" ? "9px" : "11.5px" } as React.CSSProperties}>
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
              <h3 className={s.h3big} style={fit(V9.bundlesTitle[lang])}>
                {V9.bundlesTitle[lang]}
              </h3>
              <p className={s.secLede}>{V9.bundlesLede[lang]}</p>
            </div>
            <Bundles lang={lang} />
          </div>
        </section>

        {/* Кейсы: фото по теме и лоскут глубокого цвета, сшитые швом с курак-значком */}
        <section id="cases" className={s.cases} aria-labelledby="v9-cases">
          <div className={`${s.wrap} ${s.secHead}`}>
            <SecTitle id="v9-cases" text={V9.casesTitle[lang]} badge="sales" />
            <p className={s.secLede}>
              {UI.nda[lang]} {UI.draftNote[lang]}
            </p>
          </div>
          <ul className={s.caseGrid}>
            {CASES.map((k, i) => {
              const real = casePhoto(k.id);
              const topic = CASE_TOPIC[k.id];
              return (
                <li key={k.id} className={`${s.case} ${CASE_TONE[i % 4]}`} style={{ "--n": k.result.value[lang].length } as React.CSSProperties}>
                  <div className={s.casePic}>
                    {real || !topic ? (
                      <PhotoSlot kind="scene" src={real} label={SLOT_TEXT.project[lang]} className={real ? s.casePicImg : s.casePicSlot} />
                    ) : (
                      <>
                        <Photo id={topic} lang={lang} className={s.casePicImg} />
                        <span className={s.picNote}>{V9.topicPhoto[lang]}</span>
                      </>
                    )}
                  </div>
                  <div className={s.caseBody}>
                    <KBadge id={k.categories[0] ?? "brand"} className={s.caseSeamBadge} stitched />
                    <div className={s.caseTop}>
                      <p className={s.caseClient}>{k.client[lang]}</p>
                      <ul className={s.caseTags} aria-label={V9.nav.services[lang]}>
                        {k.categories.map((id) => (
                          <li key={id}>
                            <KBadge id={id} />
                            {SHORT[id]?.[lang]}
                          </li>
                        ))}
                      </ul>
                    </div>
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
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Контрастная секция: бегущая строка цифр */}
        <section className={s.stats} aria-labelledby="v9-stats">
          <div className={`${s.wrap} ${s.statsTop}`}>
            <h2 id="v9-stats" className="visually-hidden">
              {V9.statsLabel[lang]}
            </h2>
          </div>
          <div className={s.marquee}>
            <div className={s.track}>
              {[0, 1].map((copy) => (
                <ul key={copy} className={s.marqueeList} aria-hidden={copy ? true : undefined}>
                  {STATS.map((x, i) => (
                    <li key={i} className={s.stat}>
                      <Fill value={dt(x.value, lang)} className={s.statNum} />
                      <span className={s.statLabel}>{x.label[lang]}</span>
                      <KBadge id={STAT_BADGES[i % STAT_BADGES.length]!} className={s.statSep} />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className={`${s.wrap} ${s.statsFoot}`}>
            <p className={s.statsNote}>{UI.draftNote[lang]}</p>
            <a href="#team" className={`${s.btn} ${s.btnInv} ${s.btnL}`}>
              {V9.toTeam[lang]}
            </a>
          </div>
        </section>

        {/* Команда */}
        <section id="team" className={`${s.wrap} ${s.team}`} aria-labelledby="v9-team">
          <div className={s.secHead}>
            <SecTitle id="v9-team" text={V9.teamTitle[lang]} badge="team" />
            <p className={s.secLede}>{V9.teamLede[lang]}</p>
          </div>
          <ul className={s.people}>
            {TEAM.map((p) => {
              const label = `${SLOT_TEXT.portrait[lang]}: ${p.name.draft ? lowerFirst(p.role[lang]) : p.name.value[lang]}`;
              return (
                <li key={p.id} className={s.person}>
                  <div className={s.portrait} data-slot={`team-${p.id}`}>
                    <PhotoSlot kind="person" src={teamPhoto(p.id)} label={label} className={s.portraitPhoto} />
                    <KBadge id={p.category} className={s.portraitBadge} stitched />
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

        {/* Фото-вставка: съёмка */}
        <figure className={s.band}>
          <Photo id="camera" lang={lang} className={s.bandImg} />
          <figcaption className={s.bandCap}>
            {V9.photoBy[lang]}: {PHOTOS.camera.author}, {PHOTOS.camera.license}
          </figcaption>
        </figure>

        {/* Клиенты: пузыри + отзывы */}
        <section className={`${s.wrap} ${s.clients}`} aria-labelledby="v9-clients">
          <SecTitle id="v9-clients" text={V9.clientsTitle[lang]} badge="pr" />
          <div className={s.clientsGrid}>
            <ul className={s.bubbles}>
              {CLIENT_LOGOS.map((_, i) => (
                <li key={i} className={`${s.bubble} ${s[`b${i + 1}`]}`}>
                  <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.bubbleLogo} />
                </li>
              ))}
            </ul>
            <p className={s.clientsText}>{V9.clientsText[lang]}</p>
          </div>

          <h2 className={`${s.h3big} ${s.reviewsTitle}`} style={fit(V9.reviewsTitle[lang])}>
            {V9.reviewsTitle[lang]}
          </h2>
          <ul className={s.reviews}>
            {REVIEWS.map((r, i) => (
              <li key={i} className={s.review}>
                <blockquote className={s.quote}>
                  <p>{r.text[lang]}</p>
                </blockquote>
                <div className={s.who}>
                  <div className={s.whoPhoto}>
                    <PhotoSlot kind="person" src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} hideLabel className={s.whoSlot} />
                  </div>
                  <p className={s.whoText}>
                    <Fill value={dt(r.who, lang)} />
                    <span className={s.whoRole}>{r.role[lang]}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Контрастная секция: как работаем */}
        <section className={s.process} aria-labelledby="v9-process">
          <div className={s.wrap}>
            <SecTitle id="v9-process" text={V9.processTitle[lang]} badge="invest" />
            <ul className={s.principles}>
              {PRINCIPLES.map((p, i) => (
                <li key={i} className={s.principle}>
                  <h3 className={s.principleTitle}>
                    <KBadge id={BADGE_ORDER[(i * 3) % BADGE_ORDER.length]!} />
                    <span>{p.title[lang]}</span>
                  </h3>
                  <p className={s.principleText}>{p.text[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Заявка */}
        <section id="form" className={`${s.wrap} ${s.formSec}`} aria-labelledby="v9-form">
          <SecTitle id="v9-form" text={V9.formTitle[lang]} badge="brand" />
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
              <Contacts lang={lang} className={s.stepsContacts} />
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
            <Contacts lang={lang} ids={["whatsapp", "telegram"]} className={s.footContacts} />
            <ul className={s.socials}>
              {socials.map((x) =>
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
            <PortfolioShare lang={lang} className={s.footPf} />
            <LangSwitch lang={lang} className={s.footLang} />
          </div>

          <a href="#top" className={s.bigTop} aria-label={UI.toTop[lang]} style={{ "--em": lang === "ru" ? 6.4 : 7.9 } as React.CSSProperties}>
            {V9.toTop[lang]}
            <svg viewBox="0 0 80 100" className={s.bigTopArrow} aria-hidden="true" focusable="false">
              <polygon points="40,0 80,46 54,46 54,100 26,100 26,46 0,46" fill="currentColor" />
            </svg>
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
                  {UI.apply[lang]}
                </a>
              </li>
            </ul>
          </nav>
          <p className={s.credits}>
            {V9.credits[lang]}{" "}
            {used.map((id, i) => (
              <span key={id}>
                {PHOTOS[id].topic[lang]}: <a href={PHOTOS[id].page}>{PHOTOS[id].author}</a> ({PHOTOS[id].license}){i < used.length - 1 ? "; " : "."}
              </span>
            ))}
          </p>
          <div className={s.copy}>
            <span>
              © {new Date().getFullYear()} {V9.rights[lang]}
            </span>
            <span className={s.tagline}>{KURAK_TAGLINE}</span>
          </div>
        </div>
      </footer>

      <MobileBar lang={lang} />
    </div>
  );
}
