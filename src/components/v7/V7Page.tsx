import Link from "next/link";
import { Fragment } from "react";
import { KurakLogo, KURAK_TAGLINE } from "@/components/brand/KurakLogo";
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
  LANGS,
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
  serviceName,
  variantPath,
  type Case,
  type Lang,
  type T,
} from "@/content/kurak";
import { V7, countLabel, type PillHead } from "@/content/v7";
import { SITE } from "@/content/site";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto } from "@/content/photos";
import { PhotoSlot } from "../brand/PhotoSlot";
import { Fill } from "../Fill";
import { ArrowRight, ArrowUpRight, ArtCycle, ArtDefs, ArtDigital, ArtEvents, ArtPlane, ArtSales, BadgeMark, Spark, type ShapeId } from "./Art";
import { AddButton, BundleButton, CategoryPicked, MobileBar, Opener } from "./Interactive";
import { Logo3D } from "./Logo3D";
import { Portrait, lowerFirst } from "./Portrait";
import { ServiceCloud } from "./ServiceCloud";
import { V7Form } from "./V7Form";
import { V7Header } from "./V7Header";
import h from "./V7Hero.module.css";
import s from "./V7.module.css";

/** Заголовок с одним словом в наклонённой тёмной таблетке, как «мы [лучшие]» на референсе */
function PillTitle({ head, lang, id, className, tone = "dark" }: { head: PillHead; lang: Lang; id: string; className?: string; tone?: "dark" | "red" }) {
  const [a, b, c] = head[lang];
  return (
    <h2 id={id} className={`${s.pillTitle} ${className ?? ""}`}>
      {a ? <>{a} </> : null}
      <span className={s.tiltPill} data-tone={tone}>
        {b}
      </span>
      {c ? <> {c}</> : null}
    </h2>
  );
}

/** Бегущая лента на всю ширину. Первая копия читается, остальные для бесшовной петли скрыты от чтения. */
function Ribbon({ text, tone }: { text: T[Lang]; tone: "red" | "cream" }) {
  const items = text.split("|");
  const run = (hidden: boolean, key: number) => (
    <div className={s.ribbonRun} aria-hidden={hidden || undefined} key={key}>
      {[...items, ...items].map((t, i) => (
        <Fragment key={i}>
          <span className={s.ribbonText} aria-hidden={i >= items.length || undefined}>
            {t}
          </span>
          <Spark className={s.ribbonSpark} />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={s.ribbon} data-tone={tone}>
      <div className={s.ribbonTrack}>
        {run(false, 0)}
        {run(true, 1)}
      </div>
    </div>
  );
}

/**
 * Плитка кейса: цветной квадрат «бренда клиента» как оправа, в нём место под фото проекта (casePhoto),
 * поверх наклейка с названием клиента. Под плиткой результат цифрой и круглая кнопка-стрелка
 */
const CASE_LOOK: Record<string, { tone: string; shape: ShapeId }> = {
  coffee: { tone: "espresso", shape: "u" },
  forum: { tone: "cobalt", shape: "a" },
  clinic: { tone: "teal", shape: "k" },
  food: { tone: "saffron", shape: "r" },
};

function CaseTile({ c, lang }: { c: Case; lang: Lang }) {
  const look = CASE_LOOK[c.id] ?? { tone: "cobalt", shape: "k" as ShapeId };
  return (
    <li className={s.case}>
      <div className={s.tile} data-tone={look.tone}>
        <PhotoSlot kind="scene" src={casePhoto(c.id)} label={SLOT_TEXT.project[lang]} className={s.tilePhoto} />
        <p className={s.tileName}>
          <BadgeMark id={look.shape} className={s.tileMark} />
          {c.client[lang]}
        </p>
      </div>
      <h3 className={s.caseTitle}>
        <Fill value={dt(c.result, lang)} className={s.caseFig} /> {c.resultLabel[lang]}
      </h3>
      <details className={s.caseMore}>
        <summary className={`v7-arrow ${s.caseArrow}`} aria-label={`${V7.work.caseMore[lang]}: ${c.client[lang]}`}>
          <ArrowUpRight className="v7-arrow-icon" />
        </summary>
        <dl className={s.caseBody}>
          <dt>{V7.work.task[lang]}</dt>
          <dd>{c.task[lang]}</dd>
          <dt>{V7.work.did[lang]}</dt>
          <dd>{c.did[lang]}</dd>
        </dl>
      </details>
    </li>
  );
}

/** Белая карточка с иллюстрацией сбоку, чередуются слева и справа */
function Feature({ i, lang, art }: { i: number; lang: Lang; art: React.ReactNode }) {
  const card = V7.work.cards[i]!;
  const side = i % 2 === 0 ? "right" : "left";
  return (
    <div className={s.feature} data-side={side}>
      <div className={s.featureArt}>
        {art}
        <span className={s.featureBadge} aria-hidden="true">
          <Spark />
        </span>
      </div>
      <article className={s.featureCard}>
        <h3 className={s.featureTitle}>{card.title[lang]}</h3>
        <p className={s.featureText}>{card.text[lang]}</p>
        {card.cat ? (
          <a href={`#usluga-${card.cat}`} data-v7-open={card.cat} className={s.featureLink}>
            {V7.work.openInMenu[lang]}
            <ArrowRight className={s.featureLinkIcon} />
          </a>
        ) : (
          <a href="#nabory" className={s.featureLink}>
            {V7.services.bundlesTitle[lang]}
            <ArrowRight className={s.featureLinkIcon} />
          </a>
        )}
      </article>
    </div>
  );
}

/** Строка-ссылка на всю ширину между двумя тонкими линиями */
function RowLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a href={href} className="v7-row-link" {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      <span>{children}</span>
      <ArrowUpRight className="v7-row-link-icon" />
    </a>
  );
}

/** Цвет аватара в чате: кружок под фото автора отзыва (reviewPhoto) и цвет его имени */
const AVATAR_TONE = ["espresso", "cobalt", "teal"] as const;

/** Кто ведёт направление: по категории, иначе по имени руководителя */
const leadOf = (c: (typeof CATEGORIES)[number]) => TEAM.find((p) => p.category === c.id) ?? TEAM.find((p) => !p.name.draft && p.name.value.ru === c.lead.name);
const portraitLabel = (name: string | null, role: string, lang: Lang) => `${SLOT_TEXT.portrait[lang]}: ${name ?? lowerFirst(role)}`;

/**
 * Вариант 7 «Студия». Одна разметка для русской и кыргызской страниц.
 * Порядок по пути клиента из концепции: первый экран, что делаем, меню услуг, отзывы, кейсы и цифры,
 * команда, как работаем, вопросы и заявка, подвал.
 */
export function V7Page({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const hasPdf = !PORTFOLIO_HREF.startsWith("#");

  return (
    <div lang={htmlLang(lang)} className={s.page}>
      <ArtDefs />
      <Opener />
      <V7Header lang={lang} />

      <main id="main">
        {/* ============ 1. Первый экран: объёмный KURAK и две стеклянные карточки поверх ============ */}
        <section className={h.hero} aria-labelledby="v7-h1">
          <div className={h.glows} aria-hidden="true" />
          <div className={h.inner}>
            <div className={h.copy}>
              <h1 id="v7-h1" className={h.title}>
                {BRAND_TEXT.oneLine[lang]}
              </h1>
              <p className={h.promise}>{BRAND_TEXT.promise[lang]}</p>
            </div>

            <div className={h.stage}>
              <Spark className={`${h.spark} ${h.spark1}`} />
              <Spark className={`${h.spark} ${h.spark2}`} />
              <Spark className={`${h.spark} ${h.spark3}`} />
              <Logo3D title="KURAK" className={h.logo} />

              <div className={h.cards}>
                <div className={`${h.card} ${h.cardA}`}>
                  <span className={h.badge} data-tone="cream">
                    <BadgeMark id="a" className={h.badgeMark} />
                  </span>
                  <p className={h.cardTitle}>{V7.hero.cycleTitle[lang]}</p>
                  <ul className={h.pills}>
                    {V7.hero.cyclePills.map((p) => (
                      <li key={p.cat}>
                        <a href={`#usluga-${p.cat}`} data-v7-open={p.cat} className={h.pill}>
                          <span>{p.text[lang]}</span>
                          <ArrowRight className={h.pillArrow} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div id="v7-hero-cta" className={`${h.card} ${h.cardB}`}>
                  <span className={h.badge} data-tone="red">
                    <BadgeMark id="u" className={h.badgeMark} />
                  </span>
                  <p className={h.cardTitle}>{V7.hero.teamTitle[lang]}</p>
                  <a href="#zayavka" className={`${h.pill} ${h.pillSolid}`}>
                    <span>{UI.discuss[lang]}</span>
                    <ArrowRight className={h.pillArrow} />
                  </a>
                  <a href={PORTFOLIO_HREF} className={h.textLink} {...(hasPdf ? { target: "_blank", rel: "noopener" } : {})}>
                    {UI.portfolio[lang]}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 2. Светлая секция: огромное утверждение и меню услуг ============ */}
        <div className={s.light}>
          <section className={s.statementWrap} aria-labelledby="v7-what">
            <h2 id="v7-what" className="visually-hidden">
              {UI.nav.about[lang]}
            </h2>
            <p className={s.statement}>
              <span className={s.stLead}>{V7.statement.lead[lang]}</span>{" "}
              {V7.statement.parts[lang].map((part, i) =>
                typeof part === "string" ? (
                  <Fragment key={i}>
                    {part.split(/(\s+)/).map((w, j) =>
                      /^\s+$/.test(w) || !w ? (
                        w
                      ) : (
                        <span key={j} className={s.stWord}>
                          {w}
                        </span>
                      ),
                    )}
                  </Fragment>
                ) : (
                  <a key={i} href={`#usluga-${part.cat}`} data-v7-open={part.cat} className={s.stLink}>
                    {part.text}
                  </a>
                ),
              )}
            </p>
            <p className={s.statementAfter} data-reveal>
              {V7.statement.after[lang]} {BRAND_TEXT.nameStory[lang]}
            </p>
          </section>

          <section id="uslugi" className={s.services} aria-labelledby="v7-services">
            <div className={s.wrap}>
              <div className={s.secHead}>
                <h2 id="v7-services" className={s.h2}>
                  {V7.services.title[lang]}
                </h2>
                <p className={s.lede}>{V7.services.lede[lang]}</p>
              </div>

              <div className={s.menu}>
                {CATEGORIES.map((c) => {
                  const lead = c.lead;
                  return (
                    <details key={c.id} id={`usluga-${c.id}`} name="v7-menu" className={s.cat}>
                      <summary className={s.catHead}>
                        <h3 className={s.catGoal}>{c.goal[lang]}</h3>
                        <span className={s.catMeta}>
                          <span className={s.catTag}>{c.short[lang]}</span>
                          <span className={s.catCount}>{countLabel(c.services.length, lang)}</span>
                          <CategoryPicked ids={c.services.map((x) => x.id)} lang={lang} className={s.catPicked} />
                        </span>
                        <span className={s.catIcon} aria-hidden="true" />
                      </summary>
                      <div className={s.catBody}>
                        <div className={s.catLead}>
                          <Portrait category={c.id} personId={leadOf(c)?.id} label={portraitLabel(lead.name ? (leadOf(c)?.name.value[lang] ?? lead.name) : null, lead.role[lang], lang)} size="s" />
                          <p className={s.catLeadText}>
                            <span className={s.catLeadLabel}>{UI.leads[lang]}</span>
                            <b className={s.catLeadName}>
                              {lead.name ?? <Fill value={{ value: V7.services.nameSoon[lang], draft: true, note: "имя руководителя" }} />}
                            </b>
                            <span>{lead.role[lang]}</span>
                          </p>
                        </div>
                        <ul className={s.svcList}>
                          {c.services.map((sv) => (
                            <li key={sv.id} className={s.svc}>
                              <h4 className={s.svcTitle}>{sv.title[lang]}</h4>
                              <p className={s.svcAsk}>
                                <span className={s.svcLabel}>{UI.withTask[lang]}</span>
                                {sv.ask[lang]}
                              </p>
                              <p className={s.svcLabel}>{UI.includes[lang]}</p>
                              <ul className={s.svcIncl}>
                                {sv.includes.map((x, k) => (
                                  <li key={k}>{x[lang]}</li>
                                ))}
                              </ul>
                              <AddButton id={sv.id} lang={lang} className="v7-add" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  );
                })}
              </div>

              <div id="nabory" className={s.bundles}>
                <div className={s.bundlesHead}>
                  <h3 className={s.h3}>{V7.services.bundlesTitle[lang]}</h3>
                  <p className={s.ledeSmall}>{V7.services.bundlesLede[lang]}</p>
                </div>
                <ul className={s.bundleList}>
                  {BUNDLES.map((b, i) => (
                    <li key={b.id} className={s.bundle} data-tone={["red", "cobalt", "teal"][i]}>
                      <h4 className={s.bundleTitle}>{b.title[lang]}</h4>
                      <p className={s.bundleLine}>{b.line[lang]}</p>
                      <ul className={s.bundleItems}>
                        {b.services.map((id) => (
                          <li key={id}>{serviceName(id, lang)}</li>
                        ))}
                      </ul>
                      <BundleButton ids={b.services} lang={lang} className={`v7-add ${s.bundleBtn}`} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* ============ 3. Огромная красная панель: окно WhatsApp с отзывами ============ */}
        <section id="otzyvy" className={s.redSection} aria-labelledby="v7-reviews">
          <div className={s.redPanel}>
            <div className={s.redHead}>
              <PillTitle head={V7.reviews.head} lang={lang} id="v7-reviews" className={s.redTitle} />
              <Spark className={s.redSpark} />
            </div>

            <div className={s.wa}>
              <div className={s.waBar}>
                <span className={s.waDots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={s.waApp}>{V7.reviews.window[lang]}</span>
              </div>
              <div className={s.waChat}>
                <span className={s.waAvatar} data-tone="red" aria-hidden="true">
                  <BadgeMark id="k" className={s.waAvatarMark} />
                </span>
                <span className={s.waChatName}>{V7.reviews.chat[lang]}</span>
              </div>
              <ol className={s.waScroll} tabIndex={0} aria-label={UI.nav.reviews[lang]}>
                <li className={s.waSystem}>{UI.draftNote[lang]}</li>
                {REVIEWS.map((r, i) => {
                  const tone = AVATAR_TONE[i % AVATAR_TONE.length]!;
                  return (
                    <li key={i} className={s.msg}>
                      <div className={s.waAvatar} data-tone={tone}>
                        <PhotoSlot kind="person" src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} hideLabel className={s.waAvatarPhoto} />
                      </div>
                      <div className={s.bubble}>
                        <p className={s.msgWho} data-tone={tone}>
                          <Fill value={dt(r.who, lang)} />, {r.role[lang]}
                        </p>
                        <p className={s.msgText}>{r.text[lang]}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className={s.waInput} aria-hidden="true">
                <span className={s.waField}>{V7.reviews.typing[lang]}</span>
                <span className={s.waMic} />
              </div>
            </div>

            <div className={s.logos}>
              <ul className={s.logoList}>
                {CLIENT_LOGOS.map((_, i) => (
                  <li key={i} className={s.logoSlot}>
                    <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.logoPhoto} />
                  </li>
                ))}
              </ul>
              <p className={s.logosNote}>{V7.reviews.logos[lang]}</p>
            </div>

            <RowLink href="#zayavka">{V7.reviews.cta[lang]}</RowLink>
          </div>
        </section>

        {/* ============ 4. Тёмная секция: белые карточки, цифры и плитки кейсов ============ */}
        <section id="cases" className={s.work} aria-labelledby="v7-work">
          <div className={s.workGhost} aria-hidden="true">
            <KurakLogo className={s.workGhostLogo} />
            <KurakLogo className={s.workGhostLogo} />
          </div>
          <div className={s.workGlows} aria-hidden="true" />
          <div className={s.wrap}>
            <PillTitle head={V7.work.head} lang={lang} id="v7-work" className={s.workTitle} tone="red" />

            <Feature i={0} lang={lang} art={<ArtCycle className={s.art} />} />

            <dl className={s.stats} aria-label={V7.work.statsLabel[lang]}>
              {STATS.map((st, i) => (
                <div key={i} className={s.stat}>
                  <dt className={s.statLabel}>{st.label[lang]}</dt>
                  <dd className={s.statValue}>
                    <Fill value={dt(st.value, lang)} />
                  </dd>
                </div>
              ))}
            </dl>

            <ul className={s.tiles}>
              {CASES.slice(0, 3).map((c) => (
                <CaseTile key={c.id} c={c} lang={lang} />
              ))}
            </ul>

            <Feature i={1} lang={lang} art={<ArtEvents className={s.art} />} />

            <ul className={s.tiles}>
              {CASES.slice(3).map((c) => (
                <CaseTile key={c.id} c={c} lang={lang} />
              ))}
              <li className={s.ndaTile}>
                <p className={s.ndaBig} aria-hidden="true">
                  NDA
                </p>
                <h3 className={s.ndaTitle}>{V7.work.ndaTitle[lang]}</h3>
                <p className={s.ndaText}>{UI.nda[lang]}</p>
                <p className={s.ndaText}>{UI.draftNote[lang]}</p>
              </li>
            </ul>

            <Feature i={2} lang={lang} art={<ArtSales className={s.art} />} />
            <Feature i={3} lang={lang} art={<ArtDigital className={s.art} />} />

            <RowLink href={PORTFOLIO_HREF} external={hasPdf}>
              {V7.work.portfolio[lang]}
            </RowLink>
          </div>
        </section>

        <Ribbon text={V7.ribbons.values[lang]} tone="red" />

        {/* ============ 5. Команда: портреты в цветных оправах (места под фото) ============ */}
        <section id="komanda" className={s.team} aria-labelledby="v7-team">
          <div className={s.wrap}>
            <div className={s.secHead} data-tone="dark">
              <h2 id="v7-team" className={s.h2}>
                {V7.team.title[lang]}
              </h2>
              <p className={s.lede}>{V7.team.lede[lang]}</p>
            </div>
            <ul className={s.people}>
              {TEAM.map((p) => {
                const name = dt(p.name, lang);
                return (
                  <li key={p.id} className={s.person}>
                    <Portrait category={p.category} personId={p.id} label={portraitLabel(p.name.draft ? null : name.value, p.role[lang], lang)} />
                    <h3 className={s.personName}>
                      <Fill value={name} />
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
            <p className={s.partners}>
              <Spark className={s.partnersSpark} />
              {BRAND_TEXT.partners[lang]}
            </p>
          </div>
        </section>

        <Ribbon text={V7.ribbons.langs[lang]} tone="cream" />

        {/* ============ 6. Как работаем: принципы на размытых карточках, Telegram-канал ============ */}
        <section id="kak-rabotaem" className={s.how} aria-labelledby="v7-how">
          <div className={s.howGlows} aria-hidden="true" />
          <div className={s.wrap}>
            <h2 id="v7-how" className={`${s.h2} ${s.howTitle}`}>
              {V7.principles.title[lang]}
            </h2>
            <ul className={s.principles}>
              {PRINCIPLES.map((p, i) => (
                <li key={i} className={s.principle}>
                  <Spark className={s.principleSpark} />
                  <h3 className={s.principleTitle}>{p.title[lang]}</h3>
                  <p className={s.principleText}>{p.text[lang]}</p>
                </li>
              ))}
            </ul>

            <div className={s.channel}>
              <ArtPlane className={s.channelArt} />
              <div className={s.channelCard}>
                <h3 className={s.featureTitle}>
                  <Fill value={dt(V7.channel.title, lang)} />
                </h3>
                <p className={s.featureText}>{V7.channel.text[lang]}</p>
                {SITE.contacts.telegramHref ? (
                  <a href={SITE.contacts.telegramHref} className={s.featureLink} target="_blank" rel="noopener">
                    {V7.channel.open[lang]}
                    <ArrowUpRight className={s.featureLinkIcon} />
                  </a>
                ) : (
                  <p className={s.channelStatus}>
                    <Fill value={dt(V7.channel.status, lang)} />
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ 7. Вопросы и заявка ============ */}
        <section id="voprosy" className={s.ask} aria-labelledby="v7-faq">
          <div className={s.wrap}>
            <div className={s.askHead}>
              <PillTitle head={V7.faq.head} lang={lang} id="v7-faq" className={s.askTitle} tone="red" />
              <p className={s.askLede}>{V7.faq.lede[lang]}</p>
              <ol className={s.steps}>
                {STEPS.map((st, i) => (
                  <li key={i} className={s.step}>
                    <span className={s.stepNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={s.stepTitle}>{st.title[lang]}</span>
                    <span className={s.stepText}>
                      {i === 0 ? (
                        <>
                          <Fill value={dt(RESPONSE_TIME, lang)} />, {st.text[lang]}
                        </>
                      ) : (
                        st.text[lang]
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className={s.askGrid}>
              <div id="zayavka" className={s.formCard}>
                <Spark className={s.formSpark} />
                <V7Form lang={lang} />
              </div>
              <div className={s.faq}>
                <h3 className={s.faqTitle}>{V7.faq.questions[lang]}</h3>
                {FAQ.map((f, i) => (
                  <details key={i} className={s.faqItem}>
                    <summary className={s.faqQ}>
                      <span>{f.q[lang]}</span>
                      <span className={s.faqIcon} aria-hidden="true" />
                    </summary>
                    <p className={s.faqA}>{f.a[lang]}</p>
                  </details>
                ))}
              </div>
            </div>

            <ServiceCloud lang={lang} label={V7.faq.cloud[lang]} />
          </div>
        </section>
      </main>

      {/* ============ Подвал: цветной, колонки ссылок, соцсети со стрелками ============ */}
      <footer id="kontakty" className={s.footer}>
        <div className={`${s.wrap} ${s.footGrid}`}>
          <div className={s.footBrand}>
            <KurakLogo className={s.footLogo} title="KURAK" />
            <p className={s.footTagline}>{KURAK_TAGLINE}</p>
            <p className={s.footOne}>{BRAND_TEXT.oneLine[lang]}</p>
          </div>
          <nav className={s.footCol} aria-labelledby="v7-f-clients">
            <p id="v7-f-clients" className={s.footHead}>
              {V7.footer.clients[lang]}
            </p>
            <ul>
              <li>
                <a href="#uslugi">{UI.nav.services[lang]}</a>
              </li>
              <li>
                <a href="#cases">{UI.nav.cases[lang]}</a>
              </li>
              <li>
                <a href="#komanda">{UI.nav.team[lang]}</a>
              </li>
              <li>
                <a href="#kak-rabotaem">{UI.nav.process[lang]}</a>
              </li>
              <li>
                <a href="#voprosy">{UI.nav.faq[lang]}</a>
              </li>
            </ul>
          </nav>
          <div className={s.footCol}>
            <p className={s.footHead}>{V7.footer.contact[lang]}</p>
            <ul>
              {CHANNELS.map((ch) => (
                <li key={ch.id} className={s.footChannel}>
                  {ch.href ? (
                    <a href={ch.href} target={ch.id === "phone" ? undefined : "_blank"} rel="noopener" className={s.footSocial}>
                      {ch.label[lang]}
                      <ArrowUpRight className={s.footArrow} />
                    </a>
                  ) : (
                    <span className={s.footSocial}>
                      {ch.label[lang]}
                      <ArrowUpRight className={s.footArrow} />
                    </span>
                  )}
                  <Fill value={ch.value} className={s.footValue} />
                </li>
              ))}
            </ul>
          </div>
          <div className={s.footCol}>
            <p className={s.footHead}>{V7.footer.where[lang]}</p>
            <address className={s.footAddr}>
              <Fill value={ADDRESS} />
              <br />
              <Fill value={EMAIL} />
            </address>
            <nav aria-label={UI.langLabel[lang]} className={s.footLang}>
              {LANGS.map((l) => (
                <Link key={l.id} href={variantPath(7, l.id)} hrefLang={htmlLang(l.id)} lang={htmlLang(l.id)} aria-current={l.id === lang ? "page" : undefined} prefetch={false}>
                  {l.full}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className={`${s.wrap} ${s.footBottom}`}>
          <p>
            © {V7.footer.rights[lang]}, {year}
          </p>
          <p>{UI.draftNote[lang]}</p>
        </div>
      </footer>

      <MobileBar lang={lang} className={s.mobileBar} countClass={s.mobileCount} />
    </div>
  );
}
