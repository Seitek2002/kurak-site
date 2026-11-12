import Link from "next/link";
import { SITE } from "@/content/site";
import { Fill } from "../Fill";
import { VariantLinks } from "../VariantSwitch";
import { QuiltWord } from "./QuiltWord";
import s from "./V2Footer.module.css";

/** Подвал-шторка: лежит под страницей и открывается, когда страница уезжает вверх. */
export function V2Footer() {
  const c = SITE.contacts;
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <div className={s.grid}>
          <p className={s.say}>Шьём маркетинг в&nbsp;Бишкеке. Из&nbsp;разных лоскутов одно полотно.</p>
          <div className={s.col}>
            <h2 className={s.h}>Связаться</h2>
            <ul className={s.list}>
              <li>{c.phoneHref ? <a className="link" href={c.phoneHref}>{c.phone.value}</a> : <Fill value={c.phone} />}</li>
              <li>Telegram {c.telegramHref ? <a className="link" href={c.telegramHref}>{c.telegram.value}</a> : <Fill value={c.telegram} />}</li>
              <li>Instagram {c.instagramHref ? <a className="link" href={c.instagramHref}>{c.instagram.value}</a> : <Fill value={c.instagram} />}</li>
              <li><Fill value={c.address} /></li>
            </ul>
          </div>
          <div className={s.col}>
            <h2 className={s.h}>Ещё</h2>
            <ul className={s.list}>
              <li><Link className="link" href="/komanda">Вся команда</Link></li>
              <li><a className="link" href="#zayavka">Заявка</a></li>
              <VariantLinks className="link" />
            </ul>
          </div>
        </div>
        <QuiltWord className={s.word} />
        <div className={s.bottom}>
          <p>Автоматизацию и приложения делаем с проверенными партнёрами.</p>
          <p>© {new Date().getFullYear()} Курак</p>
        </div>
      </div>
    </footer>
  );
}
