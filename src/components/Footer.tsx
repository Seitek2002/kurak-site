import Link from "next/link";
import { CATEGORIES } from "@/content/services";
import { SITE } from "@/content/site";
import { Patch } from "./Patch";
import { Fill } from "./Fill";
import { Mark } from "./Mark";
import { VariantLinks } from "./VariantSwitch";
import s from "./Footer.module.css";

/** Подвал: шов из восьми лоскутов, под ним контакты и строка про партнёров. */
export function Footer() {
  const c = SITE.contacts;
  return (
    <footer className={`${s.footer} on-field`}>
      <div className={s.seam} aria-hidden="true">
        {[...CATEGORIES, ...CATEGORIES].map((k, i) => (
          <span key={`${k.id}-${i}`} data-cat={k.id}>
            <Patch cat={k.id} />
          </span>
        ))}
      </div>
      <div className={`container ${s.grid}`}>
        <div className={s.brand}>
          <Link href="/" className={s.logo} aria-label="Курак, на главную">
            <Mark className={s.mark} />
            <span className={s.word}>Курак</span>
          </Link>
          <p className={s.about}>
            Маркетинговое агентство полного цикла в&nbsp;Бишкеке. Курак по-кыргызски значит лоскутное шитьё: из разных кусков одно целое.
          </p>
        </div>

        <div className={s.col}>
          <h2 className={s.h}>Связаться</h2>
          <ul className={s.list}>
            <li>
              {c.phoneHref ? <a className="link" href={c.phoneHref}>{c.phone.value}</a> : <Fill value={c.phone} />}
            </li>
            <li>
              Telegram{" "}
              {c.telegramHref ? <a className="link" href={c.telegramHref}>{c.telegram.value}</a> : <Fill value={c.telegram} />}
            </li>
            <li>
              Instagram{" "}
              {c.instagramHref ? <a className="link" href={c.instagramHref}>{c.instagram.value}</a> : <Fill value={c.instagram} />}
            </li>
          </ul>
        </div>

        <div className={s.col}>
          <h2 className={s.h}>Офис</h2>
          <p><Fill value={c.address} /></p>
        </div>

        <div className={s.col}>
          <h2 className={s.h}>На сайте</h2>
          <ul className={s.list}>
            <li><Link className="link" href="/#uslugi">Услуги</Link></li>
            <li><Link className="link" href="/#keisy">Кейсы</Link></li>
            <li><Link className="link" href="/komanda">Команда</Link></li>
            <li><Link className="link" href="/#zayavka">Заявка</Link></li>
            <VariantLinks className="link" />
          </ul>
        </div>
      </div>
      <div className="container">
        <div className={s.bottom}>
          <p>Автоматизацию и приложения делаем с проверенными партнёрами.</p>
          <p>© {new Date().getFullYear()} Курак</p>
        </div>
      </div>
    </footer>
  );
}
