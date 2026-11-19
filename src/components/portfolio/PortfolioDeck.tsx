import Link from "next/link";
import { Fragment, type ReactNode } from "react";
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
  FORM,
  PORTFOLIO_FILE,
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
  serviceName,
  portfolioHref,
  type Case,
  type Category,
  type Lang,
} from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { SLOT_TEXT, casePhoto, clientLogo, teamPhoto } from "@/content/photos";
import { Fill } from "../Fill";
import { KurakLogo } from "../brand/KurakLogo";
import { PhotoSlot } from "../brand/PhotoSlot";
import { LetterPatches, Patch } from "./Patch";
import { PF, SITE_LABEL, SITE_URL, servicesCount } from "./text";
import s from "./Portfolio.module.css";

type Tone = "cream" | "madder" | "red";
type PageProps = { lang: Lang; n: number; total: number };

/** «Руководитель SMM» → «руководитель SMM». Латиницу (SMM, Reels, App Store) не трогаем: это названия */
const lcFirst = (x: string) => (/^[А-ЯЁӨҮҢ][а-яёөүң]/u.test(x) ? x.charAt(0).toLocaleLowerCase("ru") + x.slice(1) : x);
/** Тексты сайта, перенесённые в PDF: «на этом сайте» → «в этом портфолио» */
const forPdf = (x: string) => x.replace("на этом сайте", "в этом портфолио").replace("ушул сайтта", "ушул портфолиодо");
/** Неразрывный пробел после коротких слов («о вас», «в одной»), чтобы предлог не висел в конце строки */
const NBSP = "\u00a0";
const ty = (x: string) => x.replace(/(?<=^|[\s(«])([А-ЯЁа-яё]{1,2})\s/gu, `$1${NBSP}`);
/** Направление услуги: по нему выбирается лоскут */
const catOf = (id: string): CategoryId => SERVICE_BY_ID[id]?.category.id ?? "smm";
const ucFirst = (x: string) => x.charAt(0).toLocaleUpperCase("ru") + x.slice(1);
const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<CategoryId, Category>;
const ALT_LANG: Record<Lang, { href: string; label: string }> = {
  ru: { href: "/portfolio/kg", label: "Кыргызча" },
  ky: { href: "/portfolio", label: "Русский" },
};

/* ------------------------------------------------------------------ */
/* Каркас страницы                                                     */
/* ------------------------------------------------------------------ */

function Page({ lang, n, total, tone = "cream", label, children, className }: PageProps & { tone?: Tone; label: string; children: ReactNode; className?: string }) {
  return (
    <section className={s.page} data-tone={tone} aria-label={label}>
      <div className={s.sheet}>
        <div className={[s.body, className].filter(Boolean).join(" ")}>{children}</div>
        <footer className={s.foot}>
          <span className={s.footBrand}>
            <KurakLogo className={s.footLogo} />
            <span>{PF.doc[lang]}</span>
            <span className={s.footNum}>
              {String(n).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>
          </span>
          <span className={s.footDemo}>{PF.demo[lang]}</span>
        </footer>
      </div>
    </section>
  );
}

function SampleTag({ children }: { children: ReactNode }) {
  return <span className={s.sample}>{children}</span>;
}

/* ------------------------------------------------------------------ */
/* 1. Обложка                                                          */
/* ------------------------------------------------------------------ */

function Cover(p: PageProps) {
  const { lang } = p;
  const quick = CHANNELS.filter((c) => c.id !== "instagram");
  return (
    <Page {...p} label={BRAND_TEXT.oneLine[lang]} className={s.cover}>
      <KurakLogo className={s.coverLogo} title="KURAK" />
      <div className={s.coverText}>
        <h1 className={s.coverTitle}>{ty(BRAND_TEXT.oneLine[lang])}</h1>
        <p className={s.coverPromise}>{ty(BRAND_TEXT.promise[lang])}</p>
      </div>
      <div className={s.coverContacts}>
        <h2 className={s.miniHead}>{PF.cover.contacts[lang]}</h2>
        <dl className={s.contactList}>
          {quick.map((c) => (
            <div key={c.id}>
              <dt>{c.label[lang]}</dt>
              <dd>{c.href ? <a href={c.href}><Fill value={c.value} /></a> : <Fill value={c.value} />}</dd>
            </div>
          ))}
          <div>
            <dt>{PF.cover.site[lang]}</dt>
            <dd>
              <a href={SITE_URL}>{SITE_LABEL}</a>
            </dd>
          </div>
        </dl>
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Кто мы                                                           */
/* ------------------------------------------------------------------ */

function Who(p: PageProps) {
  const { lang } = p;
  const cycle = BRAND_TEXT.cycle[lang].replace(/\.$/, "").split(", ");
  return (
    <Page {...p} label={PF.who.title[lang]} className={s.who}>
      <div className={s.whoMain}>
        <h2 className={s.pageTitle}>{PF.who.title[lang]}</h2>
        <p className={s.whoStatement}>{ty(BRAND_TEXT.oneLine[lang])}</p>
        <p className={s.lead}>{ty(BRAND_TEXT.promise[lang])}</p>
        <div className={s.cycle}>
          <h3 className={s.miniHead}>{PF.who.cycle[lang]}</h3>
          <ul className={s.cycleList}>
            {cycle.map((x) => (
              <li key={x}>{ucFirst(x)}</li>
            ))}
          </ul>
        </div>
      </div>
      <aside className={s.namePanel}>
        <h3 className={s.panelTitle}>{PF.who.nameTitle[lang]}</h3>
        <div role="img" aria-label={PF.who.patchesLabel[lang]} className={s.nameArt}>
          <LetterPatches className={s.letters} cellClassName={s.letter} />
          <KurakLogo className={s.nameLogo} />
        </div>
        <p className={s.nameStory}>{ty(BRAND_TEXT.nameStory[lang])}</p>
      </aside>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Цифры                                                            */
/* ------------------------------------------------------------------ */

function Stats(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} tone="madder" label={PF.stats.title[lang]} className={s.stats}>
      <div className={s.statsHead}>
        <h2 className={s.pageTitle}>{PF.stats.title[lang]}</h2>
        <p className={s.statsNote}>{ty(UI.draftNote[lang])}</p>
      </div>
      <dl className={s.statGrid}>
        {STATS.map((x) => (
          <div key={x.label.ru} className={s.stat}>
            <dt className={s.statLabel}>{x.label[lang]}</dt>
            <dd className={s.statValue}>
              <Fill value={dt(x.value, lang)} />
            </dd>
          </div>
        ))}
      </dl>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 4–5. Направления                                                    */
/* ------------------------------------------------------------------ */

function leadLine(c: Category, lang: Lang) {
  return c.lead.name ? `${c.lead.name}, ${lcFirst(c.lead.role[lang])}` : c.lead.role[lang];
}

function Directions({ cats, title, lead, note, ...p }: PageProps & { cats: Category[]; title: string; lead: string; note?: { q: string; a: string } }) {
  const { lang } = p;
  return (
    <Page {...p} label={title} className={s.dirs}>
      <div className={s.rowHead}>
        <h2 className={s.pageTitle}>{title}</h2>
        <p className={s.rowLead}>{ty(lead)}</p>
      </div>
      <div className={s.dirGrid}>
        {cats.map((c) => (
          <article key={c.id} className={s.dir}>
            <div className={s.dirHead}>
              <Patch cat={c.id} className={s.dirPatch} />
              <h3 className={s.dirGoal}>{ty(c.goal[lang])}</h3>
            </div>
            <p className={s.dirMeta}>
              <span className={s.dirShort}>{c.short[lang]}</span>
              <span>
                {UI.leads[lang]}: {leadLine(c, lang)}
              </span>
            </p>
            <ul className={s.svcList}>
              {c.services.map((x) => (
                <li key={x.id}>
                  <span className={s.svcTitle}>{ty(x.title[lang])}</span>
                  <span className={s.svcIncl}>{x.includes.map((i, k) => (k === 0 ? i[lang] : lcFirst(i[lang]))).join(", ")}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {note ? (
        <p className={s.dirNote}>
          <span className={s.dirNoteQ}>{note.q}</span>
          <span>{note.a}</span>
        </p>
      ) : null}
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Пакеты                                                           */
/* ------------------------------------------------------------------ */

function Bundles(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} label={PF.bundles.title[lang]} className={s.bundles}>
      <div className={s.rowHead}>
        <h2 className={s.pageTitle}>{PF.bundles.title[lang]}</h2>
        <p className={s.rowLead}>{ty(PF.bundles.lead[lang])}</p>
      </div>
      <div className={s.bundleGrid}>
        {BUNDLES.map((b) => (
          <article key={b.id} className={s.bundle}>
            <div className={s.bundleStrip} aria-hidden="true">
              {b.services.map((id) => (
                <Patch key={id} cat={catOf(id)} className={s.stripPatch} />
              ))}
            </div>
            <h3 className={s.bundleTitle}>{b.title[lang]}</h3>
            <p className={s.bundleLine}>{ty(b.line[lang])}</p>
            <p className={s.bundleCount}>{servicesCount(b.services.length, lang)}</p>
            <ul className={s.bundleList}>
              {b.services.map((id) => {
                return (
                  <li key={id}>
                    <Patch cat={catOf(id)} className={s.listPatch} />
                    <span>{serviceName(id, lang)}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Как работаем                                                     */
/* ------------------------------------------------------------------ */

function Process(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} label={PF.process.title[lang]} className={s.process}>
      <div className={s.processMain}>
        <h2 className={s.pageTitle}>{PF.process.title[lang]}</h2>
        <ul className={s.principles}>
          {PRINCIPLES.map((x) => (
            <li key={x.title.ru}>
              <h3 className={s.principleTitle}>{ty(x.title[lang])}</h3>
              <p className={s.principleText}>{ty(forPdf(x.text[lang]))}</p>
            </li>
          ))}
        </ul>
      </div>
      <aside className={s.stepsPanel}>
        <h3 className={s.panelTitle}>{PF.process.after[lang]}</h3>
        <ol className={s.steps}>
          {STEPS.map((x, i) => (
            <li key={x.title.ru}>
              <span className={s.stepNum} aria-hidden="true">
                {i + 1}
              </span>
              <span className={s.stepBody}>
                <span className={s.stepTitle}>{ty(x.title[lang])}</span>
                <span className={s.stepText}>{ty(x.text[lang])}</span>
                {i === 0 ? (
                  <span className={s.stepText}>
                    <Fill value={dt(RESPONSE_TIME, lang)} />
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      </aside>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 8–9. Кейсы                                                          */
/* ------------------------------------------------------------------ */

function CaseCard({ c, lang }: { c: Case; lang: Lang }) {
  return (
    <article className={s.case}>
      <div className={s.casePhotoWrap}>
        <PhotoSlot src={casePhoto(c.id)} label={`${SLOT_TEXT.project[lang]}: ${c.client[lang].toLocaleLowerCase("ru")}`} kind="scene" className={s.casePhoto} />
        <SampleTag>{PF.cases.sample[lang]}</SampleTag>
      </div>
      <h3 className={s.caseHead}>
        <span className={s.caseResult}>
          <Fill value={dt(c.result, lang)} />
        </span>
        <span className={s.caseLabel}>{ty(c.resultLabel[lang])}</span>
      </h3>
      <p className={s.caseClient}>
        <span>{c.client[lang]}</span>
        <span className={s.caseCats}>{c.categories.map((id) => CAT_BY_ID[id].short[lang]).join(", ")}</span>
      </p>
      <dl className={s.caseBody}>
        <div>
          <dt>{PF.cases.task[lang]}</dt>
          <dd>{ty(c.task[lang])}</dd>
        </div>
        <div>
          <dt>{PF.cases.did[lang]}</dt>
          <dd>{ty(c.did[lang])}</dd>
        </div>
      </dl>
    </article>
  );
}

function Cases({ list, title, ...p }: PageProps & { list: Case[]; title: string }) {
  const { lang } = p;
  return (
    <Page {...p} label={title} className={s.cases}>
      <div className={s.rowHead}>
        <h2 className={s.pageTitle}>{title}</h2>
        <p className={s.rowLead}>{UI.nda[lang]}</p>
      </div>
      <div className={s.caseGrid}>
        {list.map((c) => (
          <CaseCard key={c.id} c={c} lang={lang} />
        ))}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Команда                                                         */
/* ------------------------------------------------------------------ */

function Team(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} label={PF.team.title[lang]} className={s.team}>
      <div className={s.rowHead}>
        <h2 className={s.pageTitle}>{PF.team.title[lang]}</h2>
        <p className={s.rowLead}>{ty(PRINCIPLES[2]?.text[lang] ?? "")}</p>
      </div>
      <ul className={s.teamGrid}>
        {TEAM.map((m) => {
          const name = m.name.draft ? lcFirst(m.role[lang]) : m.name.value[lang];
          return (
            <li key={m.id} className={s.person}>
              <PhotoSlot src={teamPhoto(m.id)} label={`${SLOT_TEXT.portrait[lang]}: ${name}`} kind="person" className={s.portrait} />
              <h3 className={s.personName}>
                <Fill value={dt(m.name, lang)} />
              </h3>
              <p className={s.personRole}>{m.role[lang]}</p>
              {m.exp ? (
                <p className={s.personExp}>
                  <Fill value={dt(m.exp, lang)} />
                </p>
              ) : null}
              <p className={s.personLine}>{ty(m.line[lang])}</p>
            </li>
          );
        })}
      </ul>
      <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Клиенты и отзывы                                                */
/* ------------------------------------------------------------------ */

function Proof(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} label={PF.proof.title[lang]} className={s.proof}>
      <div className={s.rowHead}>
        <h2 className={s.pageTitle}>{PF.proof.title[lang]}</h2>
        <p className={s.rowLead}>{PF.proof.logos[lang]}</p>
      </div>
      <ul className={s.logoRow}>
        {CLIENT_LOGOS.map((x, i) => (
          <li key={i}>
            <PhotoSlot src={clientLogo(i)} label={x.value[lang]} kind="logo" className={s.logoSlot} />
          </li>
        ))}
      </ul>
      <div className={s.reviewGrid}>
        {REVIEWS.map((r, i) => (
          <figure key={i} className={s.review}>
            <SampleTag>{PF.proof.sample[lang]}</SampleTag>
            <blockquote className={s.quote}>
              <p>{ty(r.text[lang])}</p>
            </blockquote>
            <figcaption className={s.quoteWho}>
              <Fill value={dt(r.who, lang)} />
              <span>{r.role[lang]}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* 12. Контакты                                                        */
/* ------------------------------------------------------------------ */

function Contact(p: PageProps) {
  const { lang } = p;
  return (
    <Page {...p} tone="red" label={PF.contact.title[lang]} className={s.contact}>
      <div className={s.contactMain}>
        <h2 className={s.contactTitle}>{PF.contact.title[lang]}</h2>
        <p className={s.contactPromise}>{ty(FORM.promise[lang])}</p>
        <p className={s.siteLine}>
          <span className={s.siteLabel}>{PF.contact.site[lang]}</span>
          <a href={SITE_URL} className={s.siteLink}>
            {SITE_LABEL}
          </a>
        </p>
      </div>
      <dl className={s.channelGrid}>
        {CHANNELS.map((c) => (
          <div key={c.id}>
            <dt>{c.label[lang]}</dt>
            <dd>{c.href ? <a href={c.href}><Fill value={c.value} /></a> : <Fill value={c.value} />}</dd>
          </div>
        ))}
        <div>
          <dt>{PF.contact.email[lang]}</dt>
          <dd>
            <Fill value={EMAIL} />
          </dd>
        </div>
        <div>
          <dt>{UI.address[lang]}</dt>
          <dd>
            <Fill value={lang === "ky" ? { ...ADDRESS, value: ADDRESS.draft ? "Бишкек, кеңсенин дареги" : ADDRESS.value } : ADDRESS} />
          </dd>
        </div>
      </dl>
      <KurakLogo className={s.contactLogo} />
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Колода                                                              */
/* ------------------------------------------------------------------ */

export function PortfolioDeck({ lang }: { lang: Lang }) {
  const half = Math.ceil(CATEGORIES.length / 2);
  const pages: ((p: PageProps) => ReactNode)[] = [
    (p) => <Cover {...p} />,
    (p) => <Who {...p} />,
    (p) => <Stats {...p} />,
    (p) => <Directions {...p} cats={CATEGORIES.slice(0, half)} title={PF.dirs.titleA[lang]} lead={PF.dirs.leadA[lang]} />,
    (p) => <Directions {...p} cats={CATEGORIES.slice(half)} title={PF.dirs.titleB[lang]} lead={PF.dirs.leadB[lang]} note={FAQ[1] ? { q: FAQ[1].q[lang], a: FAQ[1].a[lang] } : undefined} />,
    (p) => <Bundles {...p} />,
    (p) => <Process {...p} />,
    (p) => <Cases {...p} list={CASES.slice(0, 2)} title={PF.cases.title[lang]} />,
    (p) => <Cases {...p} list={CASES.slice(2, 4)} title={PF.cases.titleMore[lang]} />,
    (p) => <Team {...p} />,
    (p) => <Proof {...p} />,
    (p) => <Contact {...p} />,
  ];
  const total = pages.length;
  const alt = ALT_LANG[lang];
  return (
    <div lang={htmlLang(lang)} className={s.root}>
      <header className={s.bar}>
        <KurakLogo className={s.barLogo} title="KURAK" />
        <p className={s.barTitle}>{PF.bar.title[lang]}</p>
        <a className={s.barPdf} href={portfolioHref(lang)} download={PORTFOLIO_FILE[lang]}>
          {PF.bar.pdf[lang]}
        </a>
        <Link className={s.barLang} href={alt.href} hrefLang={lang === "ru" ? "ky" : "ru"}>
          {alt.label}
        </Link>
      </header>
      <main id="main" className={s.deck}>
        {pages.map((render, i) => (
          <Fragment key={i}>{render({ lang, n: i + 1, total })}</Fragment>
        ))}
      </main>
    </div>
  );
}
