import {
  ADDRESS,
  BRAND_TEXT,
  CASES,
  CHANNELS,
  CLIENT_LOGOS,
  EMAIL,
  PRINCIPLES,
  REVIEWS,
  STATS,
  TEAM,
  UI,
  dt,
  type Lang,
} from "@/content/kurak";
import { V11 } from "@/content/v11";
import { SLOT_TEXT, casePhoto, clientLogo, reviewPhoto, teamPhoto } from "@/content/photos";
import { PhotoSlot } from "../brand/PhotoSlot";
import { KurakLogo, KURAK_TAGLINE } from "../brand/KurakLogo";
import { Fill } from "../Fill";
import { Contact } from "./Contact";
import { Debuts } from "./Debuts";
import { HOLES, HOLE_INDEX, holesOf, lcFirst, type HoleId } from "./data";
import { Header, LangSwitch, MobileBar, StyleSwitch } from "./Header";
import { Hero } from "./Hero";
import { Holes } from "./Holes";
import { Shell } from "./Shell";
import { Strip } from "./Strip";
import s from "./V11.module.css";

/** Вариант 11 «Тогуз коргоол»: страница целиком. Секции серверные, интерактив в островах. */
export function V11Page({ lang }: { lang: Lang }) {
  return (
    <Shell lang={lang}>
      <Header lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <Holes lang={lang} />
        <Debuts lang={lang} />
        <Games lang={lang} />
        <Score lang={lang} />
        <Rules lang={lang} />
        <Players lang={lang} />
        <Clients lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
      <MobileBar lang={lang} />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Кейсы: разобранные партии                                           */
/* ------------------------------------------------------------------ */
function Games({ lang }: { lang: Lang }) {
  return (
    <section id="games" className={s.games} aria-labelledby="v11-games-title">
      <div className="v11-wrap">
        <header className={s.head}>
          <h2 id="v11-games-title" className="v11-h2">
            {V11.games.title[lang]}
          </h2>
          <p className="v11-lead">
            {UI.nda[lang]} {UI.draftNote[lang]}
          </p>
        </header>
        <ul className={s.gameList}>
          {CASES.map((c) => {
            const lit = HOLES.map((h) => c.categories.includes(h.id as never));
            const names = c.categories.map((id) => HOLES[HOLE_INDEX[id as HoleId]]?.short[lang]).filter(Boolean);
            return (
              <li key={c.id}>
                <article className={s.game} aria-labelledby={`v11-game-${c.id}`}>
                  <div className={s.gamePhoto}>
                    <PhotoSlot kind="scene" src={casePhoto(c.id)} label={`${SLOT_TEXT.project[lang]}: ${c.client[lang]}`} />
                  </div>
                  <div className={s.gameBody}>
                    <p className={s.gameClient}>{c.client[lang]}</p>
                    <h3 id={`v11-game-${c.id}`} className={s.gameHead}>
                      <span className={`${s.gameResult} num`}>
                        <Fill value={dt(c.result, lang)} />
                      </span>
                      <span className={s.gameResultLabel}>{c.resultLabel[lang]}</span>
                    </h3>
                    <dl className={s.gameDl}>
                      <div>
                        <dt>{V11.games.position[lang]}</dt>
                        <dd>{c.task[lang]}</dd>
                      </div>
                      <div>
                        <dt>{V11.games.moves[lang]}</dt>
                        <dd>{c.did[lang]}</dd>
                      </div>
                      <div>
                        <dt>{V11.games.holes[lang]}</dt>
                        <dd className={s.gameHoles}>
                          <Strip lit={lit} size="xs" className={s.gameStrip} />
                          <span>{names.join(", ")}</span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Цифры: казан Курака                                                 */
/* ------------------------------------------------------------------ */
function Score({ lang }: { lang: Lang }) {
  return (
    <section className={`${s.score} v11-surface`} aria-labelledby="v11-score-title">
      <div className="v11-wrap">
        <h2 id="v11-score-title" className={s.scoreTitle}>
          {V11.score.title[lang]}
        </h2>
        <ul className={s.kazan}>
          {STATS.map((st) => (
            <li key={st.label.ru} className={s.kazanCell}>
              <span className={`${s.kazanNum} num`}>
                <Fill value={dt(st.value, lang)} />
              </span>
              <span className={s.kazanLabel}>{st.label[lang]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Принципы: правила игры Курака рядом с правилами тогуз коргоол       */
/* ------------------------------------------------------------------ */
function Rules({ lang }: { lang: Lang }) {
  return (
    <section id="rules" className={s.rules} aria-labelledby="v11-rules-title">
      <div className={`v11-wrap ${s.rulesIn}`}>
        <div className={s.rulesMain}>
          <h2 id="v11-rules-title" className="v11-h2">
            {V11.rules.title[lang]}
          </h2>
          <ol className={s.ruleList}>
            {PRINCIPLES.map((p, i) => (
              <li key={p.title.ru} className={s.rule}>
                <p className={s.ruleNo}>
                  {V11.rules.rule[lang]} {i + 1}
                </p>
                <h3 className={s.ruleTitle}>{p.title[lang]}</h3>
                <p className={s.ruleText}>{p.text[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className={s.gameRules} aria-labelledby="v11-game-rules">
          <h3 id="v11-game-rules" className={s.gameRulesTitle}>
            {V11.rules.gameTitle[lang]}
          </h3>
          <ol className={s.gameRuleList}>
            {V11.rules.game.map((g, i) => (
              <li key={i}>{g[lang]}</li>
            ))}
          </ol>
          <p className={s.gameRulesNote}>{V11.rules.note[lang]}</p>
          <p className={s.gameRulesSource}>{V11.rules.source[lang]}</p>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Команда: игроки                                                     */
/* ------------------------------------------------------------------ */
function Players({ lang }: { lang: Lang }) {
  return (
    <section id="players" className={s.players} aria-labelledby="v11-players-title">
      <div className="v11-wrap">
        <header className={s.head}>
          <h2 id="v11-players-title" className="v11-h2">
            {V11.players.title[lang]}
          </h2>
          <p className="v11-lead">{V11.players.lead[lang]}</p>
        </header>
        <ul className={s.playerList}>
          {TEAM.map((p) => {
            const holes = holesOf(p.id);
            const lit = HOLES.map((_, i) => holes.includes(i));
            const photoLabel = `${SLOT_TEXT.portrait[lang]}: ${p.name.draft ? lcFirst(p.role[lang]) : p.name.value[lang]}`;
            return (
              <li key={p.id} className={s.player}>
                <div className={s.portrait}>
                  <PhotoSlot kind="person" src={teamPhoto(p.id)} label={photoLabel} className={s.portraitSlot} />
                </div>
                <h3 className={s.playerName}>
                  <Fill value={dt(p.name, lang)} />
                </h3>
                <p className={s.playerRole}>{p.role[lang]}</p>
                {p.exp ? (
                  <p className={s.playerExp}>
                    <Fill value={dt(p.exp, lang)} />
                  </p>
                ) : null}
                <p className={s.playerLine}>{p.line[lang]}</p>
                <div className={s.playerHoles}>
                  <p className={s.playerHolesLabel}>{V11.players.holes[lang]}</p>
                  <Strip lit={lit} size="xs" />
                  <p className={s.playerHolesNames}>{holes.map((i) => HOLES[i]?.short[lang]).join(", ")}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className={s.partners}>{BRAND_TEXT.partners[lang]}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Клиенты и отзывы                                                    */
/* ------------------------------------------------------------------ */
function Clients({ lang }: { lang: Lang }) {
  return (
    <section id="clients" className={s.clients} aria-labelledby="v11-clients-title">
      <div className="v11-wrap">
        <header className={s.head}>
          <h2 id="v11-clients-title" className="v11-h2">
            {V11.clients.title[lang]}
          </h2>
          <p className="v11-lead">{V11.clients.lead[lang]}</p>
        </header>
        <ul className={s.logos}>
          {CLIENT_LOGOS.map((_, i) => (
            <li key={i} className={s.logoWell}>
              <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client[lang]} className={s.logoSlot} />
            </li>
          ))}
        </ul>
        <h3 className={s.reviewsTitle}>{V11.clients.reviews[lang]}</h3>
        <ul className={s.reviews}>
          {REVIEWS.map((r, i) => (
            <li key={i}>
              <figure className={s.review}>
                <blockquote className={s.quote}>
                  <p>{r.text[lang]}</p>
                </blockquote>
                <figcaption className={s.author}>
                  <span className={s.avatar}>
                    <PhotoSlot kind="person" hideLabel src={reviewPhoto(i)} label={SLOT_TEXT.author[lang]} />
                  </span>
                  <span>
                    <Fill value={dt(r.who, lang)} />
                    <span className={s.authorRole}>{r.role[lang]}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Подвал                                                              */
/* ------------------------------------------------------------------ */
function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className={`${s.footer} v11-surface`}>
      <div className="v11-wrap">
        <div className={s.footTop}>
          <a href="#main" className={s.footLogo} aria-label={`KURAK, ${UI.toTop[lang]}`}>
            <KurakLogo />
            <span className={s.footTag} aria-hidden="true">
              {KURAK_TAGLINE}
            </span>
          </a>
          <p className={s.footLine}>{V11.footer.line[lang]}</p>
        </div>
        <div className={s.footGrid}>
          <div>
            <p className={s.footLabel}>{UI.nav.contacts[lang]}</p>
            <ul className={s.footList}>
              {CHANNELS.map((c) => (
                <li key={c.id}>
                  <span className={s.footKey}>{c.label[lang]}</span>
                  {c.value.draft ? <Fill value={c.value} /> : <a className="v11-link" href={c.href}>{c.value.value}</a>}
                </li>
              ))}
              <li>
                <span className={s.footKey}>Email</span>
                <Fill value={EMAIL} />
              </li>
            </ul>
          </div>
          <div>
            <p className={s.footLabel}>{UI.address[lang]}</p>
            <p>
              <Fill value={ADDRESS} />
            </p>
            <p className={s.footCity}>{BRAND_TEXT.oneLine[lang]}</p>
          </div>
          <div className={s.footTools}>
            <StyleSwitch lang={lang} />
            <LangSwitch lang={lang} />
            <a href="#main" className="v11-link">
              {UI.toTop[lang]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
