import { Fill } from "@/components/Fill";
import { KurakLogo, KURAK_PATHS, KURAK_TAGLINE } from "@/components/brand/KurakLogo";
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
  type Person,
} from "@/content/kurak";
import { CASE_MAIN, V4 } from "@/content/v4";
import { Piece } from "./Piece";
import { Header } from "./Header";
import { ServiceMenu } from "./ServiceMenu";
import { LivePoster, BriefPoster } from "./Poster";
import { Bundles } from "./Bundles";
import { BriefForm } from "./BriefForm";
import { MobileBar } from "./MobileBar";
import { LangSwitch } from "./LangSwitch";
import s from "./V4.module.css";

/** Откуда въезжает каждая фигура знака при сборке на первом экране */
const ASSEMBLE = [
  "translate(-34%, -72%) rotate(-90deg)",
  "translate(0, 78%) rotate(180deg)",
  "translate(18%, -86%) rotate(90deg)",
  "translate(0, 64%) rotate(-120deg)",
  "translate(32%, -70%) rotate(90deg)",
];

/** Вспомогательные линии построения знака: базовая, верхняя, средняя, окружности U и R, ось A */
function MarkGuides() {
  return (
    <g className={s.markGuides} fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
      <line x1="-6" x2="449" y1="0" y2="0" vectorEffect="non-scaling-stroke" />
      <line x1="-6" x2="449" y1="6.5" y2="6.5" vectorEffect="non-scaling-stroke" />
      <line x1="-6" x2="449" y1="49.75" y2="49.75" vectorEffect="non-scaling-stroke" />
      <line x1="-6" x2="449" y1="93" y2="93" vectorEffect="non-scaling-stroke" />
      <circle cx="130.5" cy="50.5" r="42.5" vectorEffect="non-scaling-stroke" />
      <circle cx="219.5" cy="43.5" r="37" vectorEffect="non-scaling-stroke" />
      <line x1="305.5" x2="305.5" y1="-6" y2="99" vectorEffect="non-scaling-stroke" />
      <line x1="52" x2="52" y1="-6" y2="99" vectorEffect="non-scaling-stroke" />
      <line x1="413" x2="413" y1="-6" y2="99" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

function Hero({ lang }: { lang: Lang }) {
  return (
    <section className={s.hero} aria-labelledby="v4-hero-title">
      <div className={`v4-wrap ${s.heroGrid}`}>
        <div className={s.mark}>
          <svg viewBox="-6 -6 455 105" aria-hidden="true" focusable="false">
            <g fill="currentColor">
              {KURAK_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  className={s.markPiece}
                  style={{ ["--from" as string]: ASSEMBLE[i], ["--i" as string]: i }}
                />
              ))}
            </g>
            <MarkGuides />
          </svg>
        </div>
        <h1 id="v4-hero-title" className={s.heroTitle}>
          {V4.hero.title[lang]}
        </h1>
        <div className={s.heroSide}>
          <p className={s.heroSub}>{V4.hero.sub[lang]}</p>
          <div className={s.heroActions}>
            <a className="v4-btn" href="#brief">
              {UI.discuss[lang]}
            </a>
            <a className={`v4-link ${s.heroPdf}`} href={PORTFOLIO_HREF}>
              {UI.portfolio[lang]}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ lang }: { lang: Lang }) {
  return (
    <section id="services" className={s.services} aria-labelledby="v4-services-title">
      <div className="v4-wrap">
        <header className={s.head}>
          <h2 id="v4-services-title" className={s.h2}>
            {V4.services.title[lang]}
          </h2>
          <p className={s.intro}>{V4.services.intro[lang]}</p>
        </header>
        <div className={s.svcGrid}>
          <ServiceMenu lang={lang} />
          <LivePoster lang={lang} />
        </div>
        <Bundles lang={lang} />
      </div>
    </section>
  );
}

function Cases({ lang }: { lang: Lang }) {
  return (
    <section id="cases" className={s.cases} aria-labelledby="v4-cases-title">
      <div className="v4-wrap">
        <header className={s.head}>
          <h2 id="v4-cases-title" className={s.h2}>
            {V4.cases.title[lang]}
          </h2>
          <p className={s.intro}>{UI.nda[lang]}</p>
        </header>
        <div className={s.caseGrid}>
          {CASES.map((c, i) => {
            const main = CASE_MAIN[c.id] ?? c.categories[0] ?? "smm";
            return (
              <article key={c.id} className={s.case} data-tone={i % 3 === 0 ? "red" : "ink"} data-main={main}>
                <Piece cat={main} className={s.caseArt} />
                <h3 className={s.caseHead}>
                  <span className={s.caseNum}>
                    <Fill value={dt(c.result, lang)} note="результат кейса" />
                  </span>
                  <span className={s.caseLabel}>{c.resultLabel[lang]}</span>
                </h3>
                <p className={s.caseClient}>{c.client[lang]}</p>
                <dl className={s.caseBody}>
                  <div>
                    <dt>{V4.cases.task[lang]}</dt>
                    <dd>{c.task[lang]}</dd>
                  </div>
                  <div>
                    <dt>{V4.cases.did[lang]}</dt>
                    <dd>{c.did[lang]}</dd>
                  </div>
                </dl>
                <ul className={s.caseDirs} aria-label={V4.cases.directions[lang]}>
                  {c.categories.map((cat) => {
                    const category = CATEGORIES.find((x) => x.id === cat);
                    return (
                      <li key={cat}>
                        <Piece cat={cat} className={s.caseDirPiece} />
                        {category?.short[lang]}
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
        <p className={s.caption}>{UI.draftNote[lang]}</p>
      </div>
    </section>
  );
}

/** Курак целиком: все восемь деталей в одном полотне, у каждой своя расцветка */
const QUILT_TONES = ["red", "ink", "well", "fill", "fill", "well", "red", "ink"] as const;

function About({ lang }: { lang: Lang }) {
  return (
    <section className={s.about} aria-labelledby="v4-about-title">
      <div className={`v4-wrap ${s.aboutGrid}`}>
        <figure className={s.quilt}>
          <div className={s.quiltGrid} aria-hidden="true">
            {CATEGORIES.map((c, i) => (
              <span key={c.id} className={s.cell} data-tone={QUILT_TONES[i]}>
                <Piece cat={c.id} />
              </span>
            ))}
          </div>
          <dl className={s.stats} aria-label={V4.about.statsLabel[lang]}>
            {STATS.map((st, i) => (
              <div key={i} className={s.stat}>
                <dt className={s.statLabel}>{st.label[lang]}</dt>
                <dd className={s.statNum}>
                  <Fill value={dt(st.value, lang)} />
                </dd>
              </div>
            ))}
          </dl>
          <figcaption className={s.caption}>{V4.about.caption[lang]}</figcaption>
        </figure>
        <div className={s.aboutText}>
          <h2 id="v4-about-title" className={s.h2}>
            {V4.about.title[lang]}
          </h2>
          <p className={s.story}>{BRAND_TEXT.nameStory[lang]}</p>
        </div>
      </div>
    </section>
  );
}

/** Портрет-заглушка: деталь направления и инициал. Заменится на 2D-рисунок (src) без смены вёрстки. */
function Plate({ person, lang, size = "m" }: { person: Person; lang: Lang; size?: "m" | "l" | "s" }) {
  const name = person.name.value[lang];
  return (
    <div className={s.plate} data-size={size} aria-hidden="true">
      <Piece cat={person.category} className={s.platePiece} />
      {person.name.draft ? <span className={s.plateBlank} /> : <span className={s.plateInitial}>{name.charAt(0)}</span>}
    </div>
  );
}

function PersonText({ person, lang, big }: { person: Person; lang: Lang; big?: boolean }) {
  return (
    <div className={s.personText}>
      <h3 className={big ? s.personNameL : s.personName}>
        <Fill value={dt(person.name, lang)} note="имя" />
      </h3>
      <p className={s.personRole}>{person.role[lang]}</p>
      {person.exp ? (
        <p className={s.personExp}>
          <Fill value={dt(person.exp, lang)} note="опыт" />
        </p>
      ) : null}
      {big ? <p className={s.personLine}>{person.line[lang]}</p> : null}
    </div>
  );
}

function Team({ lang }: { lang: Lang }) {
  const [lead, ...rest] = TEAM;
  if (!lead) return null;
  return (
    <section id="team" className={s.team} aria-labelledby="v4-team-title">
      <div className="v4-wrap">
        <header className={s.head}>
          <h2 id="v4-team-title" className={s.h2}>
            {V4.team.title[lang]}
          </h2>
          <p className={s.intro}>{V4.team.portraits[lang]}</p>
        </header>
        <div className={s.teamGrid}>
          <article className={s.teamLead}>
            <Plate person={lead} lang={lang} size="l" />
            <PersonText person={lead} lang={lang} big />
          </article>
          <ul className={s.teamRest}>
            {rest.map((p) => (
              <li key={p.id} className={s.teamItem}>
                <Plate person={p} lang={lang} />
                <PersonText person={p} lang={lang} />
              </li>
            ))}
          </ul>
        </div>
        <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
      </div>
    </section>
  );
}

function Reviews({ lang }: { lang: Lang }) {
  return (
    <section className={s.reviews} aria-labelledby="v4-reviews-title">
      <div className="v4-wrap">
        <header className={s.head}>
          <h2 id="v4-reviews-title" className={s.h2}>
            {V4.reviews.title[lang]}
          </h2>
        </header>
        <div className={s.reviewGrid}>
          {REVIEWS.map((r, i) => (
            <figure key={i} className={s.review} data-first={i === 0 || undefined}>
              <blockquote className={s.quote}>
                <p>«{r.text[lang]}»</p>
              </blockquote>
              <figcaption className={s.reviewWho}>
                <span>
                  <Fill value={dt(r.who, lang)} note="автор отзыва" />, {r.role[lang]}
                </span>
                <span className={s.reviewSample}>{V4.reviews.sample[lang]}</span>
              </figcaption>
            </figure>
          ))}
          <div className={s.clients}>
            <ul className={s.logos} aria-label={V4.reviews.logos[lang]}>
              {CLIENT_LOGOS.map((l, i) => (
                <li key={i} className={s.logo}>
                  <Fill value={dt(l, lang)} note="логотип клиента" />
                </li>
              ))}
            </ul>
            <p className={s.caption}>{V4.reviews.logos[lang]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function How({ lang }: { lang: Lang }) {
  return (
    <section id="how" className={s.how} aria-labelledby="v4-how-title">
      <div className={`v4-wrap ${s.howGrid}`}>
        <div className={s.howText}>
          <h2 id="v4-how-title" className={s.h2}>
            {V4.how.title[lang]}
          </h2>
          <ul className={s.principles}>
            {PRINCIPLES.map((p, i) => (
              <li key={i} className={s.principle}>
                <h3 className={s.principleTitle}>{p.title[lang]}</h3>
                <p className={s.principleText}>{V4.how.principles[i]?.[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
        <figure className={s.schema} aria-label={V4.how.schemaLabel[lang]}>
          <div className={s.schemaYou}>{V4.how.you[lang]}</div>
          <div className={s.schemaPm}>{V4.how.pm[lang]}</div>
          <ul className={s.schemaLeads}>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Piece cat={c.id} className={s.schemaPiece} />
                <span>{c.short[lang]}</span>
              </li>
            ))}
          </ul>
          <figcaption className={s.schemaCaption}>{V4.how.leads[lang]}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Brief({ lang }: { lang: Lang }) {
  return (
    <section id="brief" className={s.brief} aria-labelledby="v4-brief-title">
      <div className={`v4-wrap ${s.briefGrid}`}>
        <h2 id="v4-brief-title" className={`${s.h2} ${s.briefTitle}`}>
          {V4.brief.title[lang]}
        </h2>
        <BriefPoster lang={lang} />
        <BriefForm lang={lang}>
          <div className={s.steps}>
            <h3 className={s.stepsTitle}>{V4.brief.next[lang]}</h3>
            <ol className={s.stepList}>
              {STEPS.map((st, i) => (
                <li key={i} className={s.step}>
                  <span className={s.stepTitle}>{st.title[lang]}</span>
                  {i === 0 ? (
                    <span className={s.stepText}>
                      <Fill value={dt(RESPONSE_TIME, lang)} />
                    </span>
                  ) : null}
                  <span className={s.stepText}>{st.text[lang]}</span>
                </li>
              ))}
            </ol>
          </div>
        </BriefForm>
      </div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer id="contacts" className={s.footer}>
      <div className={`v4-wrap ${s.footerGrid}`}>
        <div className={s.footerMark}>
          <a href="#main" className={s.footerLogo} aria-label={UI.toTop[lang]}>
            <KurakLogo />
            <span className={s["logo-tagline"]}>{KURAK_TAGLINE}</span>
          </a>
          <p className={s.footerLine}>{BRAND_TEXT.oneLine[lang]}</p>
        </div>
        <div className={s.footerCol}>
          <h2 className={s.footerHead}>{V4.footer.contacts[lang]}</h2>
          <dl className={s.channels}>
            {CHANNELS.map((c) => (
              <div key={c.id}>
                <dt>{c.label[lang]}</dt>
                <dd>
                  {c.href ? (
                    <a className="v4-link" href={c.href}>
                      {c.value.value}
                    </a>
                  ) : (
                    <Fill value={c.value} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={s.footerCol}>
          <h2 className={s.footerHead}>{V4.footer.office[lang]}</h2>
          <p>
            <Fill value={ADDRESS} />
          </p>
          <p>
            <Fill value={EMAIL} />
          </p>
        </div>
        <div className={s.footerCol}>
          <h2 className={s.footerHead}>{V4.footer.lang[lang]}</h2>
          <LangSwitch lang={lang} />
        </div>
        <p className={s.footerFine}>
          © {new Date().getFullYear()} {V4.footer.rights[lang]}. {UI.draftNote[lang]}
        </p>
      </div>
    </footer>
  );
}

export function V4Page({ lang }: { lang: Lang }) {
  return (
    <div lang={htmlLang(lang)} className={s.page}>
      <Header lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <Services lang={lang} />
        <Cases lang={lang} />
        <About lang={lang} />
        <Team lang={lang} />
        <Reviews lang={lang} />
        <How lang={lang} />
        <Brief lang={lang} />
      </main>
      <Footer lang={lang} />
      <MobileBar lang={lang} />
    </div>
  );
}
