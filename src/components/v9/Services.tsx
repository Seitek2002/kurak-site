"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BUNDLES, CATEGORIES, SERVICE_BY_ID, UI, type Category, type Lang } from "@/content/kurak";
import type { CategoryId } from "@/content/services";
import { V9 } from "@/content/v9";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import { Shape } from "./Shape";
import s from "./V9.module.css";

const OPEN_EVENT = "v9:open-category";

/** «Внедрение CRM» → «внедрение CRM», но «HR-бренд» остаётся как есть */
const lowerFirst = (t: string) => (t.charAt(1) && t.charAt(1) === t.charAt(1).toLowerCase() ? t.charAt(0).toLowerCase() + t.slice(1) : t);

/** Кнопка, открывающая карточку направления из любого места страницы (промо ивентов) */
export function OpenCategory({ id, className, children }: { id: CategoryId; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }))}
    >
      {children}
    </button>
  );
}

/** «МЫ ДЕЛАЕМ»: восемь тёмных карточек 01–08, по клику справа выезжает лист направления */
export function ServiceCards({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const [openId, setOpenId] = useState<CategoryId | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((id: CategoryId) => {
    openerRef.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
    useSelection.getState().seen(id);
    const d = dialogRef.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => open((e as CustomEvent<CategoryId>).detail);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [open]);

  const current = CATEGORIES.find((c) => c.id === openId) ?? null;

  return (
    <>
      <ul className={s.cards}>
        {CATEGORIES.map((c, i) => {
          const n = c.services.filter((x) => picked.includes(x.id)).length;
          return (
            <li key={c.id} className={s.card}>
              <h3 className={s.cardTitle}>
                <button type="button" className={s.cardBtn} aria-haspopup="dialog" onClick={() => open(c.id)}>
                  {c.goal[lang]}
                </button>
              </h3>
              <p className={s.cardSub}>
                {c.short[lang]}: {c.services.map((x) => lowerFirst(x.title[lang])).join(", ")}
              </p>
              <span className={s.arrow} aria-hidden="true">
                ↗
              </span>
              <div className={s.cardFoot}>
                <span className={s.cardNum}>{c.n}</span>
                {n > 0 && (
                  <span className={s.cardPicked}>
                    {n} {V9.pickedHere[lang]}
                  </span>
                )}
              </div>
              <Shape i={i} className={s.cardShape} />
            </li>
          );
        })}
        <li className={`${s.card} ${s.cardCta}`}>
          <h3 className={s.cardTitle}>
            <a href="#form" className={s.cardBtn}>
              {V9.notFoundTitle[lang]}
            </a>
          </h3>
          <p className={s.cardSub}>{V9.notFoundText[lang]}</p>
          <span className={s.arrow} aria-hidden="true">
            ↘
          </span>
          <Shape i={3} className={s.cardShape} />
        </li>
      </ul>

      <dialog
        ref={dialogRef}
        className={s.sheet}
        aria-labelledby="v9-sheet-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        onClose={() => {
          openerRef.current?.focus?.();
        }}
      >
        {current && <Sheet c={current} lang={lang} onClose={() => dialogRef.current?.close()} />}
      </dialog>
    </>
  );
}

function Sheet({ c, lang, onClose }: { c: Category; lang: Lang; onClose: () => void }) {
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);
  const total = picked.length;
  const idx = CATEGORIES.findIndex((x) => x.id === c.id);

  return (
    <div className={s.sheetInner}>
      <div className={s.sheetTop}>
        <span className={s.sheetCount}>
          {c.n} / {String(CATEGORIES.length).padStart(2, "0")}
        </span>
        <button type="button" className={`${s.btn} ${s.btnS}`} onClick={onClose} autoFocus>
          {UI.close[lang]}
        </button>
      </div>

      <div className={s.sheetHead}>
        <Shape i={idx} className={s.sheetShape} />
        <p className={s.sheetShort}>
          {V9.sheetLabel[lang]}: {c.short[lang]}
        </p>
        <h2 id="v9-sheet-title" className={s.sheetTitle}>
          {c.goal[lang]}
        </h2>
        <p className={s.sheetLead}>
          <span className={s.sheetLeadLabel}>{UI.leads[lang]}</span>
          <span>
            {c.lead.name ? c.lead.name : <Fill>{V9.nameSoon[lang]}</Fill>}, {lowerFirst(c.lead.role[lang])}
          </span>
        </p>
      </div>

      <ul className={s.sheetList}>
        {c.services.map((x) => {
          const on = picked.includes(x.id);
          return (
            <li key={x.id} className={s.svc}>
              <h3 className={s.svcTitle}>{x.title[lang]}</h3>
              <p className={s.svcAsk}>
                <span className={s.svcLabel}>{UI.withTask[lang]}</span>
                {x.ask[lang]}
              </p>
              <div className={s.svcInc}>
                <span className={s.svcLabel}>{UI.includes[lang]}</span>
                <ul>
                  {x.includes.map((t, k) => (
                    <li key={k}>{t[lang]}</li>
                  ))}
                </ul>
              </div>
              <button type="button" className={`${s.btn} ${s.btnS} ${s.svcBtn}`} aria-pressed={on} onClick={() => toggle(x.id)}>
                <span aria-hidden="true" className={s.svcIcon}>
                  {on ? "✓" : "+"}
                </span>
                {on ? UI.added[lang] : UI.add[lang]}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={s.sheetFoot}>
        <p className={s.sheetTotal} aria-live="polite">
          {V9.inRequestShort[lang]}: <strong>{total}</strong>
        </p>
        <a href="#form" className={`${s.btn} ${s.btnRed}`} onClick={onClose}>
          {V9.toForm[lang]}
        </a>
      </div>
    </div>
  );
}

/** Готовые пакеты: как комбо, без цен. Кнопка добавляет все услуги пакета в заявку. */
export function Bundles({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const addMany = useSelection((st) => st.addMany);
  const uid = useId();
  return (
    <ul className={s.bundleList}>
      {BUNDLES.map((b) => {
        const all = b.services.every((id) => picked.includes(id));
        return (
          <li key={b.id} className={s.bundle}>
            <h4 className={s.bundleTitle} id={`${uid}-${b.id}`}>
              {b.title[lang]}
            </h4>
            <p className={s.bundleLine}>{b.line[lang]}</p>
            <ul className={s.bundleSvc}>
              {b.services.map((id) => (
                <li key={id} data-on={picked.includes(id) || undefined}>
                  {SERVICE_BY_ID[id]?.service.title[lang]}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`${s.btn} ${s.btnS} ${s.bundleBtn}`}
              aria-pressed={all}
              aria-describedby={`${uid}-${b.id}`}
              onClick={() => (all ? b.services.forEach((id) => useSelection.getState().remove(id)) : addMany(b.services))}
            >
              <span aria-hidden="true" className={s.svcIcon}>
                {all ? "✓" : "+"}
              </span>
              {all ? V9.bundleIn[lang] : V9.addBundle[lang]}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
