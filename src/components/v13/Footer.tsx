import Link from "next/link";
import { ADDRESS, BRAND_TEXT, LANGS, UI, variantPath, type Lang } from "@/content/kurak";
import { V13_FOOTER, V13_NAV, V13_UI } from "@/content/v13";
import { Fill } from "../Fill";
import { KURAK_TAGLINE, KurakLogo } from "../brand/KurakLogo";
import { Contacts } from "./Contacts";
import { IconPin } from "./Icons";
import { PortfolioShare } from "./Share";
import s from "./Footer.module.css";

/** Подвал на тёплых чернилах: знак, контакты и адрес, портфолио с «Поделиться», разделы, язык. */
export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer id="kontakty" className={s.footer}>
      <div className={`v13-container ${s.grid}`}>
        <div className={s.brand}>
          <KurakLogo className={s.mark} title="KURAK" />
          <span className={s.tagline} aria-hidden="true">
            {KURAK_TAGLINE}
          </span>
          <p className={s.one}>{BRAND_TEXT.oneLine[lang]}</p>
        </div>

        <div className={s.col}>
          <h2 className={s.colTitle}>{UI.nav.contacts[lang]}</h2>
          <Contacts lang={lang} ids={["whatsapp", "telegram", "instagram", "phone"]} className={s.contacts} itemClass={s.contact} labelClass={s.cLabel} valueClass={s.cValue} />
          <p className={s.address}>
            <IconPin />
            <span>
              <span className={s.cLabel}>{UI.address[lang]}</span>
              <span className={s.cValue}>
                <Fill value={ADDRESS} />
              </span>
            </span>
          </p>
        </div>

        <div className={s.col}>
          <h2 className={s.colTitle}>Портфолио</h2>
          <p className={s.note}>{V13_FOOTER.portfolioNote[lang]}</p>
          <PortfolioShare lang={lang} className={s.pf} linkClass={s.pfLink} shareClass={s.share} statusClass={s.status} />
        </div>

        <nav className={s.col} aria-label={V13_UI.sections[lang]}>
          <h2 className={s.colTitle}>{V13_UI.sections[lang]}</h2>
          <ul className={s.links}>
            {V13_NAV.filter((n) => n.href !== "#kontakty").map((n) => (
              <li key={n.href}>
                <a href={n.href} className={s.link}>
                  {n.label[lang]}
                </a>
              </li>
            ))}
            <li>
              <a href="#zayavka" className={s.link}>
                {UI.apply[lang]}
              </a>
            </li>
          </ul>
        </nav>

        <div className={s.base}>
          <ul className={s.langs} aria-label={UI.langLabel[lang]}>
            {LANGS.map((l) => (
              <li key={l.id}>
                <Link href={variantPath(13, l.id)} className={s.lang} aria-current={l.id === lang ? "page" : undefined} lang={l.id === "ky" ? "ky" : "ru"}>
                  {l.full}
                </Link>
              </li>
            ))}
          </ul>
          <a href="#main" className={s.link}>
            {V13_FOOTER.top[lang]}
          </a>
        </div>
      </div>
    </footer>
  );
}
