"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BUNDLES, CATEGORIES, SERVICE_BY_ID, TEAM, UI, dt, serviceName, type Category, type Lang } from "@/content/kurak";
import { LEAD_PERSON, V8, servicesCount } from "@/content/v8";
import { useSelection } from "@/store/selection";
import { Fill } from "@/components/Fill";
import { ServiceArt } from "./Art";
import { Person } from "./People";
import { IconCheck, IconClose, IconPlus } from "./Icons";
import { useV8 } from "./ui";
import s from "./Menu.module.css";

/** «Ответы подписчикам» → «ответы подписчикам», но «Reels», «CRM» и «SMM» не трогаем */
const lowerFirst = (x: string) => (/^[А-ЯЁҢҮӨ][а-яёңүө]/.test(x) ? x.charAt(0).toLowerCase() + x.slice(1) : x);

function leadText(cat: Category, lang: Lang) {
  const who = cat.lead.name ?? lowerFirst(cat.lead.role[lang]);
  return cat.lead.withPartners ? `${who}, ${V8.menu.withPartners[lang]}` : who;
}

const FIRST = "smm";
const RIBBON = [...CATEGORIES.map((c) => ({ id: c.id as string, label: c.short })), { id: "combo", label: V8.menu.combo }];

/**
 * Меню услуг как на главной Додо: липкая лента категорий-таблеток с подсветкой при скролле,
 * карточки «товаров» (тарелка, название, состав, «Ведёт», таблетка «Выбрать»), комбо и карточка-модалка.
 */
export function Menu({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);
  const addMany = useSelection((st) => st.addMany);
  const say = useV8((st) => st.say);
  const openCart = useV8((st) => st.openCart);

  const [active, setActive] = useState<string>(FIRST);
  const ribbonRef = useRef<HTMLDivElement>(null);

  /* Подсветка активной категории: последняя секция, чей верх ушёл под ленту */
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const ribbon = ribbonRef.current;
      const line = (ribbon?.getBoundingClientRect().bottom ?? 120) + 32;
      let current = FIRST;
      for (const r of RIBBON) {
        const el = document.getElementById(`cat-${r.id}`);
        if (el && el.getBoundingClientRect().top <= line) current = r.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Активная таблетка всегда видна в ленте (на телефоне лента прокручивается вбок) */
  useEffect(() => {
    const ribbon = ribbonRef.current;
    const pill = ribbon?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!ribbon || !pill) return;
    const left = pill.offsetLeft - ribbon.offsetLeft;
    if (left < ribbon.scrollLeft + 8 || left + pill.offsetWidth > ribbon.scrollLeft + ribbon.clientWidth - 8) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ribbon.scrollTo({ left: Math.max(0, left - 16), behavior: reduce ? "auto" : "smooth" });
    }
  }, [active]);

  const onToggle = useCallback(
    (id: string) => {
      const was = useSelection.getState().picked.includes(id);
      toggle(id);
      say(`${was ? V8.menu.removed[lang] : V8.menu.added[lang]}: ${serviceName(id, lang)}`, !was);
    },
    [toggle, say, lang],
  );

  /* ---------- Модалка услуги ---------- */
  const dlgRef = useRef<HTMLDialogElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const openService = (id: string, trigger: HTMLElement) => {
    returnRef.current = trigger;
    setShown(id);
    setTick((t) => t + 1);
  };
  useEffect(() => {
    const dlg = dlgRef.current;
    if (tick && dlg && !dlg.open) dlg.showModal();
  }, [tick]);
  const close = () => dlgRef.current?.close();

  const onDialogKey = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const item = shown ? SERVICE_BY_ID[shown] : null;
  const itemPicked = shown ? picked.includes(shown) : false;
  const leadPerson = item ? TEAM.find((p) => p.id === LEAD_PERSON[item.category.id]) : null;

  return (
    <section id="menu" className={s.menu} aria-labelledby="menu-title">
      <div className={`v8-wrap ${s.head}`}>
        <h2 id="menu-title" className={s.title}>
          {V8.menu.title[lang]}
        </h2>
        <p className={s.lede}>{V8.menu.lede[lang]}</p>
      </div>

      <nav className={s.ribbonBar} aria-label={V8.menu.ribbon[lang]}>
        <div className="v8-wrap">
          <div className={s.ribbon} ref={ribbonRef}>
            {RIBBON.map((r) => (
              <a key={r.id} href={`#cat-${r.id}`} data-id={r.id} className={s.pill} aria-current={active === r.id ? "true" : undefined}>
                {r.label[lang]}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="v8-wrap">
        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={`cat-${cat.id}`} className={s.cat} aria-labelledby={`cat-${cat.id}-t`}>
            <h3 id={`cat-${cat.id}-t`} className={s.catTitle}>
              {cat.goal[lang]} <span className={s.catShort}>{cat.short[lang]}</span>
            </h3>
            <ul className={s.grid}>
              {cat.services.map((svc) => {
                const on = picked.includes(svc.id);
                return (
                  <li key={svc.id} className={s.card} data-on={on || undefined}>
                    <div className={s.cardArt}>
                      <ServiceArt id={svc.id} className={s.plate} />
                    </div>
                    <div className={s.cardBody}>
                      <h4 className={s.cardTitle}>
                        <button type="button" className={s.cardOpen} onClick={(e) => openService(svc.id, e.currentTarget)} aria-haspopup="dialog">
                          {svc.title[lang]}
                        </button>
                      </h4>
                      <p className={s.cardText}>{svc.includes.map((x, k) => (k ? lowerFirst(x[lang]) : x[lang])).join(", ")}</p>
                      <div className={s.cardFoot}>
                        <p className={s.cardLead}>
                          <span className={s.cardLeadLabel}>{UI.leads[lang]}:</span> {leadText(cat, lang)}
                        </p>
                        <button
                          type="button"
                          className={`v8-btn ${on ? "v8-btn--primary" : "v8-btn--soft"} ${s.pick}`}
                          aria-pressed={on}
                          aria-label={`${on ? V8.menu.picked[lang] : V8.menu.pick[lang]}: ${svc.title[lang]}`}
                          onClick={() => onToggle(svc.id)}
                        >
                          {on ? <IconCheck /> : null}
                          {on ? V8.menu.picked[lang] : V8.menu.pick[lang]}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section id="cat-combo" className={s.cat} aria-labelledby="cat-combo-t">
          <div className={s.comboHead}>
            <h3 id="cat-combo-t" className={s.catTitle}>
              {V8.menu.comboTitle[lang]}
            </h3>
            <p className={s.comboLede}>{V8.menu.comboLede[lang]}</p>
          </div>
          <ul className={s.combos}>
            {BUNDLES.map((b) => {
              const all = b.services.every((id) => picked.includes(id));
              const stack = b.services.slice(0, 3);
              return (
                <li key={b.id} className={s.combo}>
                  <div className={s.stack} aria-hidden="true">
                    {stack.map((id, k) => (
                      <ServiceArt key={id} id={id} className={`${s.stackPlate} ${s[`stack${k}`]}`} />
                    ))}
                    {b.services.length > 3 ? <span className={s.stackMore}>+{b.services.length - 3}</span> : null}
                  </div>
                  <div className={s.comboBody}>
                    <h4 className={s.comboTitle}>{b.title[lang]}</h4>
                    <p className={s.comboLine}>{b.line[lang]}</p>
                    <p className={s.comboCount}>{servicesCount(b.services.length, lang)}</p>
                    <ul className={s.comboList}>
                      {b.services.map((id) => (
                        <li key={id} data-on={picked.includes(id) || undefined}>
                          {serviceName(id, lang)}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`v8-btn ${all ? "v8-btn--primary" : "v8-btn--soft"} v8-btn--block ${s.comboBtn}`}
                      onClick={() => {
                        if (all) return openCart("list");
                        addMany(b.services);
                        say(`${V8.menu.added[lang]}: ${b.title[lang]}`, true);
                      }}
                      aria-label={all ? `${V8.menu.comboAll[lang]}: ${b.title[lang]}` : `${V8.menu.pick[lang]}: ${b.title[lang]}`}
                    >
                      {all ? <IconCheck /> : <IconPlus />}
                      {all ? V8.menu.comboAll[lang] : V8.menu.pick[lang]}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <dialog
        ref={dlgRef}
        className={s.dlg}
        aria-labelledby="v8-dlg-title"
        onClose={() => returnRef.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={onDialogKey}
      >
        {item ? (
          <div className={s.dlgBody}>
            <div className={s.dlgArt}>
              <ServiceArt id={item.service.id} className={s.dlgPlate} />
            </div>
            <div className={s.dlgInfo}>
              <button type="button" className={s.dlgClose} onClick={close} aria-label={UI.close[lang]}>
                <IconClose />
              </button>
              <p className={s.dlgCat}>
                {item.category.short[lang]}. {item.category.goal[lang]}
              </p>
              <h2 id="v8-dlg-title" className={s.dlgTitle}>
                {item.service.title[lang]}
              </h2>

              <h3 className={s.dlgSub}>{UI.includes[lang]}</h3>
              <ul className={s.dlgList}>
                {item.service.includes.map((x) => (
                  <li key={x.ru}>
                    <IconCheck />
                    {x[lang]}
                  </li>
                ))}
              </ul>

              <h3 className={s.dlgSub}>{UI.withTask[lang]}</h3>
              <p className={s.dlgAsk}>{item.service.ask[lang]}</p>

              <div className={s.dlgLead}>
                <span className={s.dlgAvatar}>
                  <Person id={LEAD_PERSON[item.category.id]} bust className={s.dlgFace} />
                </span>
                <span className={s.dlgLeadText}>
                  <span className={s.dlgLeadLabel}>{UI.leads[lang]}</span>
                  <strong>{leadPerson ? <Fill value={dt(leadPerson.name, lang)} /> : leadText(item.category, lang)}</strong>
                  <span>{item.category.lead.role[lang]}</span>
                </span>
              </div>

              <p className={s.dlgPrice}>{V8.menu.price[lang]}</p>

              <div className={s.dlgFoot}>
                <button
                  type="button"
                  className={`v8-btn ${itemPicked ? "v8-btn--grey" : "v8-btn--primary"} v8-btn--lg v8-btn--block`}
                  onClick={() => {
                    onToggle(item.service.id);
                    close();
                  }}
                >
                  {itemPicked ? V8.menu.remove[lang] : UI.add[lang]}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
