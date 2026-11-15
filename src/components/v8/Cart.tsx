"use client";

import { useEffect, useRef, useState } from "react";
import { FORM, SERVICE_BY_ID, UI, serviceName, type Lang } from "@/content/kurak";
import { V8, servicesCount } from "@/content/v8";
import { useSelection } from "@/store/selection";
import { EmptyPlate, ServiceArt } from "./Art";
import { LeadForm } from "./LeadForm";
import { IconBack, IconBag, IconClose } from "./Icons";
import { useV8 } from "./ui";
import s from "./Cart.module.css";

/**
 * Корзина как у Додо: панель выезжает справа, в ней выбранные услуги с крестиком
 * и большая кнопка «Оформить заявку», которая открывает форму на том же месте.
 * На телефоне снизу плавающая таблетка: «Обсудить задачу», а когда что-то выбрано — «Заявка | 3».
 */
export function Cart({ lang }: { lang: Lang }) {
  const open = useV8((st) => st.cartOpen);
  const step = useV8((st) => st.step);
  const closeCart = useV8((st) => st.closeCart);
  const setStep = useV8((st) => st.setStep);
  const openCart = useV8((st) => st.openCart);
  const said = useV8((st) => st.said);
  const bump = useV8((st) => st.bump);
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  const clear = useSelection((st) => st.clear);

  const dlgRef = useRef<HTMLDialogElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      returnRef.current = document.activeElement as HTMLElement | null;
      dlg.showModal();
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  const onKey = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href], input, textarea, [tabindex]:not([tabindex='-1'])"),
    );
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

  /* Плавающая кнопка прячется, пока на экране главная кнопка первого экрана или сама форма заявки */
  const [formInView, setFormInView] = useState(true);
  useEffect(() => {
    const els = ["hero-cta", "zayavka"].map((id) => document.getElementById(id)).filter((x): x is HTMLElement => !!x);
    // без IntersectionObserver кнопка остаётся скрытой: «Обсудить задачу» есть в меню шапки
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target, e.isIntersecting));
        setFormInView([...seen.values()].some(Boolean));
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const count = picked.length;

  return (
    <>
      <dialog
        ref={dlgRef}
        className={s.drawer}
        aria-labelledby="v8-cart-title"
        onClose={() => {
          closeCart();
          returnRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeCart();
        }}
        onKeyDown={onKey}
      >
        <div className={s.panel}>
          <div className={s.top}>
            {step === "form" ? (
              <button type="button" className={s.iconBtn} onClick={() => setStep("list")} aria-label={V8.cart.back[lang]}>
                <IconBack />
              </button>
            ) : null}
            <h2 id="v8-cart-title" className={s.title}>
              {step === "form" ? FORM.title[lang] : V8.cart.title[lang]}
            </h2>
            <button type="button" className={s.iconBtn} onClick={closeCart} aria-label={UI.close[lang]}>
              <IconClose />
            </button>
          </div>

          {step === "list" ? (
            <>
              <div className={s.scroll}>
                {count > 0 ? (
                  <>
                    <div className={s.countRow}>
                      <p className={s.count}>
                        {lang === "ky" ? `${V8.cart.inCart.ky} ${servicesCount(count, lang)}` : `${servicesCount(count, lang)} ${V8.cart.inCart.ru}`}
                      </p>
                      <button type="button" className={s.clear} onClick={clear}>
                        {V8.cart.clear[lang]}
                      </button>
                    </div>
                    <ul className={s.items}>
                      {picked.map((id) => {
                        const it = SERVICE_BY_ID[id];
                        return (
                          <li key={id} className={s.item}>
                            <ServiceArt id={id} className={s.thumb} />
                            <div className={s.itemText}>
                              <p className={s.itemTitle}>{serviceName(id, lang)}</p>
                              {it ? <p className={s.itemCat}>{it.category.short[lang]}</p> : null}
                            </div>
                            <button type="button" className={s.remove} onClick={() => remove(id)} aria-label={`${V8.cart.removeOne[lang]}: ${serviceName(id, lang)}`}>
                              <IconClose />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <p className={s.note}>{V8.cart.pickedNote[lang]}</p>
                  </>
                ) : (
                  <div className={s.empty}>
                    <EmptyPlate className={s.emptyPlate} />
                    <h3 className={s.emptyTitle}>{V8.cart.emptyTitle[lang]}</h3>
                    <p className={s.emptyText}>{FORM.empty[lang]}</p>
                    <a href="#menu" className="v8-btn v8-btn--soft" onClick={closeCart}>
                      {V8.cart.toMenu[lang]}
                    </a>
                  </div>
                )}
              </div>
              <div className={s.foot}>
                <button type="button" className="v8-btn v8-btn--primary v8-btn--lg v8-btn--block" onClick={() => setStep("form")}>
                  {count > 0 ? V8.cart.checkout[lang] : V8.cart.noPick[lang]}
                </button>
              </div>
            </>
          ) : (
            <div className={s.scroll}>
              <p className={s.formLede}>{FORM.promise[lang]}</p>
              <LeadForm lang={lang} focusFirst onDone={closeCart} />
            </div>
          )}
        </div>
      </dialog>

      <div className={s.float} data-hidden={formInView || undefined}>
        {count > 0 ? (
          <button type="button" className={`v8-btn v8-btn--primary v8-btn--lg ${s.floatBtn}`} onClick={() => openCart("list")} aria-haspopup="dialog" aria-label={`${V8.cart.label[lang]}: ${count}`}>
            <IconBag />
            <span>{V8.cart.label[lang]}</span>
            <span className={s.sep} aria-hidden="true" />
            <span key={bump} className={s.floatCount} aria-hidden="true">
              {count}
            </span>
          </button>
        ) : (
          <a href="#zayavka" className={`v8-btn v8-btn--primary v8-btn--lg ${s.floatBtn}`}>
            {UI.discuss[lang]}
          </a>
        )}
      </div>

      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {said.n ? said.text : ""}
      </p>
    </>
  );
}
