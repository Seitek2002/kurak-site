"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORIES, RESPONSE_TIME, SERVICE_BY_ID, UI, dt, type Lang } from "@/content/kurak";
import { SITE } from "@/content/site";
import { QUIZ_BUSINESS, QUIZ_NEEDS, QUIZ_QUESTIONS, QUIZ_START, QUIZ_WHEN, V13_QUIZ, buildPlan, lowerFirst } from "@/content/v13";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import { IconWhatsApp } from "./Icons";
import { Patch } from "./Patch";
import { scrollToId } from "./motion";
import { setTaskLine } from "./task";
import s from "./Quiz.module.css";

const MARKS = [V13_QUIZ.mark.ru, V13_QUIZ.mark.ky];

/**
 * Опрос первого экрана (концепт варианта 3): три вопроса, крупные ответы, на выходе план:
 * что подключим, с чего начнём, кто ведёт. Каждый ответ пришивает лоскут к шкале прогресса.
 * План сразу уходит в заявку: услуги в подборку, строка плана в поле «Задача», срок в timing.
 * Ответы обычные radio и checkbox: работают с клавиатуры, без скрипта виден первый вопрос.
 */
export function Quiz({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<string | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const touched = useRef(false);
  const addMany = useSelection((st) => st.addMany);
  const setDraft = useSelection((st) => st.setDraft);

  useEffect(() => {
    if (touched.current) headRef.current?.focus({ preventScroll: true });
  }, [step]);

  const plan = buildPlan(business, needs);
  const q = QUIZ_QUESTIONS[step];
  const answered = step === 0 ? !!business : step === 1 ? needs.length > 0 : !!when;
  const done = [!!business, needs.length > 0, !!when];

  function attach() {
    const b = QUIZ_BUSINESS.find((x) => x.id === business)?.label[lang] ?? "";
    const n = QUIZ_NEEDS.filter((x) => needs.includes(x.id)).map((x) => x.label[lang].toLowerCase()).join(", ");
    const w = QUIZ_WHEN.find((x) => x.id === when);
    addMany(plan);
    setTaskLine(MARKS, V13_QUIZ.line(b.toLowerCase(), n, (w?.label[lang] ?? "").toLowerCase())[lang]);
    if (w) setDraft({ timing: w.label.ru });
  }

  const next = () => {
    touched.current = true;
    if (!answered) return setHint(true);
    setHint(false);
    if (step === 2) attach();
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
    setTaskLine(MARKS, null);
  };

  const msg = `${V13_QUIZ.waMsg[lang]}\n${plan.map((id) => `- ${SERVICE_BY_ID[id]?.service.title[lang] ?? id}`).join("\n")}`;
  const wa = SITE.contacts.whatsappHref ? `${SITE.contacts.whatsappHref}?text=${encodeURIComponent(msg)}` : "";
  const PIPS = ["brand", "smm", "events"] as const;

  return (
    <div className={s.card} id="plan" role="region" aria-labelledby="v13-quiz-title">
      <div className={s.top}>
        <div className={s.topText}>
          <h2 id="v13-quiz-title" className={s.title}>
            {V13_QUIZ.title[lang]}
          </h2>
          <p className={s.sub}>{V13_QUIZ.sub[lang]}</p>
        </div>
        <ol className={s.progress} aria-hidden="true">
          {PIPS.map((kind, i) => (
            <li key={kind} className={s.pip} data-done={done[i] && (i < step || step === 3) ? "" : undefined} data-now={i === step ? "" : undefined}>
              <Patch kind={kind} className={s.pipPatch} />
            </li>
          ))}
        </ol>
      </div>

      {q ? (
        <form
          className={s.body}
          onSubmit={(e) => {
            e.preventDefault();
            next();
          }}
        >
          <fieldset className={s.q}>
            <legend className={s.legend}>
              <span className={s.count}>{V13_QUIZ.step(step + 1)[lang]}</span>
              <h3 ref={headRef} tabIndex={-1} className={s.qTitle}>
                {q.title[lang]}
              </h3>
            </legend>
            <div className={s.options} data-multi={q.multi || undefined}>
              {q.options.map((o) => {
                const id = `v13-q-${q.id}-${o.id}`;
                const checked = q.id === "business" ? business === o.id : q.id === "needs" ? needs.includes(o.id) : when === o.id;
                return (
                  <span key={o.id} className={s.option}>
                    <input
                      id={id}
                      type={q.multi ? "checkbox" : "radio"}
                      name={`v13-${q.id}`}
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
                      <span className={s.box} aria-hidden="true" />
                      <span>{o.label[lang]}</span>
                    </label>
                  </span>
                );
              })}
            </div>
          </fieldset>
          <div className={s.nav}>
            <p className={s.hint} role="status">
              {hint ? (q.multi ? V13_QUIZ.pickMany[lang] : V13_QUIZ.pickOne[lang]) : ""}
            </p>
            {step > 0 && (
              <button type="button" className="v13-btn v13-btn--quiet" onClick={back}>
                {V13_QUIZ.back[lang]}
              </button>
            )}
            <button type="submit" className="v13-btn v13-btn--ink">
              {step === 2 ? V13_QUIZ.showPlan[lang] : V13_QUIZ.next[lang]}
            </button>
          </div>
        </form>
      ) : (
        <div className={s.body}>
          <h3 ref={headRef} tabIndex={-1} className={s.qTitle}>
            {V13_QUIZ.planTitle[lang]}
          </h3>
          <div className={s.planGrid}>
            <div>
              <h4 className={s.planHead}>{V13_QUIZ.services[lang]}</h4>
              <ul className={s.planList}>
                {plan.map((id) => {
                  const hit = SERVICE_BY_ID[id];
                  if (!hit) return null;
                  const lead = CATEGORIES.find((c) => c.id === hit.category.id)!.lead;
                  const role = lead.role[lang];
                  return (
                    <li key={id} className={s.planItem}>
                      <Patch kind={hit.category.id} className={s.planPatch} />
                      <span className={s.planText}>
                        <span className={s.planName}>{hit.service.title[lang]}</span>
                        <span className={s.planLead}>
                          {UI.leads[lang]}: {lead.name ?? <Fill note="имя руководителя">{lang === "ky" ? "Аты" : "Имя"}</Fill>}, {lowerFirst(role)}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className={s.pm}>{V13_QUIZ.pm[lang]}</p>
            </div>
            <div>
              <h4 className={s.planHead}>{V13_QUIZ.steps[lang]}</h4>
              <ol className={s.steps}>
                <li>
                  {when === "now" ? (
                    <span>
                      {QUIZ_START.now![lang]} <Fill value={dt(RESPONSE_TIME, lang)} />
                    </span>
                  ) : (
                    QUIZ_START[when ?? "month"]![lang]
                  )}
                </li>
                <li>{V13_QUIZ.call[lang]}</li>
                <li>{V13_QUIZ.offer[lang]}</li>
              </ol>
            </div>
          </div>
          <div className={s.nav}>
            {wa && (
              <a className="v13-btn" href={wa} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp />
                {V13_QUIZ.sendWa[lang]}
              </a>
            )}
            <button type="button" className={wa ? "v13-btn v13-btn--quiet" : "v13-btn v13-btn--ink"} onClick={() => scrollToId("zayavka", "v13-name")}>
              {V13_QUIZ.leavePhone[lang]}
            </button>
            <button type="button" className={s.restart} onClick={restart}>
              {V13_QUIZ.restart[lang]}
            </button>
          </div>
          <p className={s.note}>{V13_QUIZ.inRequest[lang]}</p>
        </div>
      )}
    </div>
  );
}
