import { ADDRESS, BRAND_TEXT, UI } from "@/content/kurak";
import { Fill } from "../Fill";
import { QuiltWord } from "./QuiltWord";
import { Contacts } from "./Contacts";
import { PortfolioShare } from "./PortfolioShare";
import s from "./V2Footer.module.css";

/** На чернилах знак сшит из светлых и тёплых тонов: красный, терракота, румянец, охра */
const WORD_CATS = ["smm", "sales", "events", "team", "smm"] as const;

/** Подвал-шторка на чернилах: лежит под страницей и открывается, когда страница уезжает вверх. */
export function V2Footer() {
  return (
    <footer id="kontakty" className={`${s.footer} v2-soot`}>
      <div className={`container ${s.inner}`}>
        <div className={s.grid}>
          <div className={s.lead}>
            <p className={s.say}>Шьём маркетинг в&nbsp;Бишкеке. Из&nbsp;разных лоскутов одно полотно.</p>
            <p className={s.who}>{BRAND_TEXT.oneLine.ru}</p>
            <a href="#zayavka" className={`btn ${s.cta}`}>
              {UI.apply.ru}
            </a>
          </div>
          <div className={s.col}>
            <h2 className={s.h}>Связаться</h2>
            <Contacts layout="column" className={s.contacts} />
            <p className={s.addr}>
              <span className={s.addrLabel}>{UI.address.ru}</span>
              <Fill value={ADDRESS} />
            </p>
          </div>
          <div className={s.col}>
            <h2 className={s.h}>Портфолио</h2>
            <p className={s.note}>Сохраните PDF или отправьте ссылку шефу, коллегам и&nbsp;знакомым.</p>
            <PortfolioShare className={s.files} />
            <h2 className={`${s.h} ${s.hNext}`}>Разделы</h2>
            <ul className={s.list}>
              <li><a className="link" href="#uslugi">Услуги</a></li>
              <li><a className="link" href="#keisy">Кейсы</a></li>
              <li><a className="link" href="#komanda">Команда</a></li>
              <li><a className="link" href="#zayavka">Заявка</a></li>
            </ul>
          </div>
        </div>
        <QuiltWord className={s.word} cats={[...WORD_CATS]} />
        <div className={s.bottom}>
          <p>{BRAND_TEXT.partners.ru}</p>
          <p>© {new Date().getFullYear()} Курак</p>
        </div>
      </div>
    </footer>
  );
}
