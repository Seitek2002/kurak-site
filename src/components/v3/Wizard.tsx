"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_INDEX, SERVICE_INDEX } from "@/content/services";
import { SITE } from "@/content/site";
import { QUESTIONS, SERVICE_NAMES, UI, buildPlan, type Lang } from "@/content/v3";
import { useSelection } from "@/store/selection";
import { Patch } from "../Patch";
import { IconArrow, IconWhatsApp, Tunduk } from "./Icons";
import s from "./V3.module.css";

export const NEED_EVENT = "kurak:need";

/**
 * Помощник подбора: три вопроса с крупными ответами, на выходе план услуг.
 * Ответы обычные radio и checkbox: работают с клавиатуры и в любом браузере.
 */
export function Wizard({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<string | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const touched = useRef(false);
  const addMany = useSelection((st) => st.addMany);

  // «Подобрать под мой бизнес» из блока ситуаций: отмечаем нужное заранее
  useEffect(() => {
    const on = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setNeeds((cur) => (cur.includes(id) ? cur : [...cur, id]));
      setStep((cur) => (cur === 3 ? 0 : cur));
    };
    window.addEventListener(NEED_EVENT, on);
    return () => window.removeEventListener(NEED_EVENT, on);
  }, []);

  // после действия человека переводим фокус на новый вопрос, чтобы экранный диктор его прочёл
  useEffect(() => {
    if (touched.current) headRef.current?.focus();
  }, [step]);

  const plan = buildPlan(business, needs);
  const q = QUESTIONS[step];
  const answered = step === 0 ? !!business : step === 1 ? needs.length > 0 : !!when;

  const next = () => {
    touched.current = true;
    if (!answered) return setHint(true);
    setHint(false);
    if (step === 2) addMany(plan);
    setStep((v) => v + 1);
  };
  const back = () => {
    touched.current = true;
    setHint(false);
    setStep((v) => Math.max(0, v - 1));
  };
  const restart = () => {
    touched.current = true;
    setBusiness(null);
    setNeeds([]);
    setWhen(null);
    setStep(0);
  };

  const msg = `${UI.planMsg[lang]}\n${plan.map((id) => `• ${SERVICE_NAMES[id]![lang]}`).join("\n")}`;
  const wa = SITE.contacts.whatsappHref ? `${SITE.contacts.whatsappHref}?text=${encodeURIComponent(msg)}` : "";

  return (
    <div className={s.wizard} id="podbor" role="region" aria-label={UI.wizardTitle[lang]}>
      <div className={s.tunduk}>
        <Tunduk filled={Math.min(step, 3)} />
      </div>

      {q ? (
        <form
          className={s.wizBody}
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <fieldset className={s.q}>
            <legend className={s.qLegend}>
              <span className={s.qCount}>
                {UI.step[lang]} {step + 1} {UI.of[lang]} 3. {UI.heroNote[lang]}
              </span>
              <h2 ref={headRef} tabIndex={-1} className={s.qTitle}>
                {q.title[lang]}
              </h2>
              <span className={s.qHint}>{q.multi ? UI.pickMany[lang] : UI.pickOne[lang]}</span>
            </legend>
            <div className={s.options}>
              {q.options.map((o) => {
                const id = `w-${q.id}-${o.id}`;
                const checked = q.id === "business" ? business === o.id : q.id === "needs" ? needs.includes(o.id) : when === o.id;
                return (
                  <span key={o.id} className={s.option}>
                    <input
                      id={id}
                      type={q.multi ? "checkbox" : "radio"}
                      name={q.id}
                      value={o.id}
                      checked={checked}
                      onChange={() => {
                        setHint(false);
                        if (q.id === "business") setBusiness(o.id);
                        else if (q.id === "when") setWhen(o.id);
                        else setNeeds((cur) => (cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id]));
                      }}
                    />
                    <label htmlFor={id}>
                      <span className={s.check} aria-hidden="true" />
                      {o.label[lang]}
                    </label>
                  </span>
                );
              })}
            </div>
          </fieldset>
          <p className={s.wizHint} role="status">
            {hint ? (q.multi ? UI.pickMany[lang] : UI.pickOne[lang]) : ""}
          </p>
          <div className={s.wizNav}>
            {step > 0 && (
              <button type="button" className="v3-btn v3-btn--ghost" onClick={back}>
                {UI.back[lang]}
              </button>
            )}
            <button type="submit" className="v3-btn">
              {UI.next[lang]}
              <IconArrow />
            </button>
          </div>
        </form>
      ) : (
        <div className={s.wizBody}>
          <h2 ref={headRef} tabIndex={-1} className={s.qTitle}>
            {UI.planTitle[lang]}
          </h2>
          <p className={s.planLede}>{UI.planLede[lang]}</p>
          <ol className={s.plan}>
            {plan.map((id) => {
              const cat = SERVICE_INDEX[id]!.category;
              const lead = CATEGORY_INDEX[cat.id].lead.name;
              return (
                <li key={id} className={s.planItem} data-cat={cat.id}>
                  <span className={s.planPatch} aria-hidden="true">
                    <Patch cat={cat.id} plain />
                  </span>
                  <span className={s.planText}>
                    <strong>{SERVICE_NAMES[id]![lang]}</strong>
                    {lead && (
                      <span className={s.planLead}>
                        {UI.leads[lang]}: {lead}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className={s.wizNav}>
            {wa ? (
              <a className="v3-btn v3-btn--wa" href={wa} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp />
                {UI.sendPlan[lang]}
              </a>
            ) : (
              <a className="v3-btn" href="#svyaz">
                {UI.callMe[lang]}
              </a>
            )}
            <button type="button" className="v3-btn v3-btn--ghost" onClick={restart}>
              {UI.restart[lang]}
            </button>
          </div>
          {!wa && <p className={s.planNote}>{UI.noWa[lang]}</p>}
        </div>
      )}
    </div>
  );
}
