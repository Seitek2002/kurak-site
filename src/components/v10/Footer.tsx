import { Fill } from "@/components/Fill";
import { KURAK_PATHS, KURAK_TAGLINE } from "@/components/brand/KurakLogo";
import { ADDRESS, BRAND_TEXT, CHANNELS, EMAIL, UI, type Lang } from "@/content/kurak";
import { SECTIONS, V10 } from "@/content/v10";
import { LangSwitch } from "./Header";
import s from "./V10.module.css";

const NAV_LABEL = { services: UI.nav.services, cases: UI.nav.cases, team: UI.nav.team, contacts: UI.nav.contacts } as const;

/** Знак KURAK во всю ширину, «собранный из стеблей»: поверх фигур тонкие просветы фона */
function WovenMark({ title }: { title: string }) {
  const gaps = Array.from({ length: Math.ceil(443 / 5) }, (_, i) => i * 5 + 4);
  return (
    <svg viewBox="0 0 443 93" className={s.footMark} role="img" aria-label={title}>
      <title>{title}</title>
      {KURAK_PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
      {gaps.map((x) => (
        <rect key={x} x={x} y={0} width={1} height={93} className={s.footMarkGap} />
      ))}
    </svg>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <WovenMark title={`${KURAK_TAGLINE}: ${BRAND_TEXT.oneLine[lang]}`} />
        <div className={s.footGrid}>
          <div>
            <p className={s.footTitle}>{V10.footer.contacts[lang]}</p>
            <ul className={s.footList}>
              <li>
                <span>
                  {UI.address[lang]}: <Fill value={ADDRESS} />
                </span>
              </li>
              <li>
                <span>
                  E-mail: <Fill value={EMAIL} />
                </span>
              </li>
            </ul>
          </div>
          <div>
            <p className={s.footTitle}>{V10.footer.social[lang]}</p>
            <ul className={s.footList}>
              {CHANNELS.map((c) => (
                <li key={c.id}>
                  {c.href ? (
                    <a href={c.href}>
                      {c.label[lang]}: <Fill value={c.value} />
                    </a>
                  ) : (
                    <span>
                      {c.label[lang]}: <Fill value={c.value} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label={V10.navLabel[lang]}>
            <p className={s.footTitle}>{UI.menu[lang]}</p>
            <ul className={s.footList}>
              {SECTIONS.map((x) => (
                <li key={x.key}>
                  <a href={x.href}>{NAV_LABEL[x.key][lang]}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={s.footTitle}>{UI.langLabel[lang]}</p>
            <LangSwitch lang={lang} className={s.footLang} />
          </div>
        </div>
        <div className={s.footBottom}>
          <p>{BRAND_TEXT.partners[lang]}</p>
          <p>{UI.draftNote[lang]}</p>
          <a href="#main" className={s.textLink}>
            {V10.footer.up[lang]}
          </a>
        </div>
      </div>
    </footer>
  );
}
