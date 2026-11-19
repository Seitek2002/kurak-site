import { CATEGORIES } from "@/content/services";
import { UI } from "@/content/kurak";
import { Patch } from "../Patch";
import { QuiltWord } from "./QuiltWord";
import { Magnetic } from "./Magnetic";
import { Scene } from "./Scene";
import { Contacts } from "./Contacts";
import { PortfolioShare } from "./PortfolioShare";
import s from "./V2Hero.module.css";

/**
 * Лоскуты вокруг знака: [left %, top %, размер px, поворот, скорость параллакса, left % и top % на телефоне].
 * На компьютере координаты от всего первого экрана, на телефоне и планшете от «неба» над знаком,
 * поэтому лоскуты не заходят на текст при любой высоте экрана.
 */
const FLOAT: [number, number, number, number, number, number, number][] = [
  [3, 12, 64, -12, 1.4, 5, 8], [86, 11, 84, 14, 0.8, 78, 4], [64, 15, 46, 8, 1.8, 56, 50], [19, 15, 52, 18, 1.1, 27, 46],
  [96, 33, 58, -20, 1.6, 88, 56], [42, 10, 40, 10, 2.1, 44, 8], [30, 9, 36, -8, 2.4, 69, 68], [76, 8, 44, -14, 1.2, 9, 64],
];

/**
 * Первый экран: знак KURAK из лоскутов, кто мы и что делаем, заявка, портфолио и контакты.
 * Всё обязательное помещается без прокрутки (1280 × 800 и 375 × 812).
 */
export function V2Hero() {
  return (
    <section id="v2-hero" className={s.hero} aria-labelledby="v2-title">
      <Scene target="v2-hero" scene="hero" />
      <div className={s.floats} aria-hidden="true">
        {FLOAT.map(([l, t, size, r, k, ml, mt], i) => {
          const cat = CATEGORIES[i]!.id;
          return (
            <span
              key={cat}
              className={s.float}
              data-cat={cat}
              data-speed={k}
              style={{ "--x": `${l}%`, "--y": `${t}%`, "--mx": `${ml}%`, "--my": `${mt}%`, "--size": `${size}px`, "--r": `${r}deg`, "--i": i } as React.CSSProperties}
            >
              <Patch cat={cat} />
            </span>
          );
        })}
      </div>
      <div className={`container ${s.inner}`}>
        <QuiltWord className={s.word} />
        <div className={s.copy} data-hero-copy>
          <h1 id="v2-title" className={s.title}>
            <span className={s.who}>
              Курак — маркетинговое агентство полного цикла в&nbsp;Бишкеке<span className="visually-hidden">.</span>
            </span>
            <span className={s.big}>
              <span className="v2-line"><span>Маркетинг, сшитый</span></span>{" "}
              <span className="v2-line"><span>в&nbsp;одно полотно</span></span>
            </span>
          </h1>
          <p className={s.lede}>
            Стратегия, SMM и&nbsp;реклама, PR, ивенты, брендинг, продажи и&nbsp;сайты. Одна команда и&nbsp;один договор.
          </p>
          {/* в коде заявка раньше портфолио: так идёт и клавиатура; на экране места задают grid-areas */}
          <div className={s.cta}>
            <Magnetic>
              <a href="#zayavka" className="v2-round" data-cursor="Поехали">
                {UI.apply.ru}
              </a>
            </Magnetic>
          </div>
          <PortfolioShare className={s.links} />
        </div>
        <Contacts className={s.contacts} />
      </div>
    </section>
  );
}
