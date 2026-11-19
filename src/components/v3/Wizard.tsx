"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CHANNELS, RESPONSE_TIME, SERVICE_BY_ID, STEPS, TEAM, dt } from "@/content/kurak";
import { SITE } from "@/content/site";
import {
  BUSINESS,
  FIRST_STEP,
  PATH,
  QUESTIONS,
  SERVICE_NAMES,
  UI,
  WHEN,
  buildPlan,
  decodeAnswers,
  encodeAnswers,
  type Lang,
} from "@/content/v3";
import { whatsappShare } from "@/lib/share";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import { KurakLogo } from "../brand/KurakLogo";
import { ShareButton } from "./ShareButton";
import { V3Form } from "./V3Form";
import { IconArrow, IconPhone, IconRestart, IconSave, IconWhatsApp } from "./Icons";
import s from "./V3.module.css";

export const NEED_EVENT = "kurak:need";

/** «Руководитель ивент-отдела» → «Бибинур, руководитель ивент-отдела»; аббревиатуры (SMM, PR) не трогаем */
const lowerFirst = (x: string) => (x.length > 1 && x[1] === x[1]!.toLowerCase() ? x[0]!.toLowerCase() + x.slice(1) : x);

/** Дата на бланке плана: ставится, когда план готов (только в браузере). Кыргызскую дату пишем цифрами: не во всех браузерах есть кыргызские названия месяцев */
const today = (lang: Lang) =>
  lang === "ky"
    ? new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })
    : new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/**
 * Помощник подбора: три вопроса с крупными ответами, на выходе персональный план:
 * что подключить, первый шаг по каждой услуге, кто ведёт, что будет дальше.
 * План можно отправить в WhatsApp, оставить номер прямо на листе, поделиться ссылкой (по ней план откроется
 * у шефа) или сохранить в PDF через печать. Ответы обычные radio и checkbox: работают с клавиатуры.
 */
export function Wizard({ lang }: { lang: Lang }) {
  const [step, setStep] = useState(0);
  const [business, setBusiness] = useState<string | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);
  const [when, setWhen] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [callback, setCallback] = useState(false);
  const [date, setDate] = useState("");
  const headRef = useRef<HTMLHeadingElement>(null);
  const touched = useRef(false);
  const formId = useId();
  const addMany = useSelection((st) => st.addMany);
  const setDraft = useSelection((st) => st.setDraft);

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

  // Ссылка с планом (?plan=…): открываем сразу готовый план, без опроса
  useEffect(() => {
    const restore = () => {
      const a = decodeAnswers(new URLSearchParams(window.location.search).get("plan"));
      if (!a) return;
      setBusiness(a.business);
      setNeeds(a.needs);
      setWhen(a.when);
      setDate(today(lang));
      setStep(3);
    };
    const raf = window.requestAnimationFrame(restore);
    return () => window.cancelAnimationFrame(raf);
  }, [lang]);

  // после действия человека переводим фокус на новый вопрос, чтобы экранный диктор его прочёл
  useEffect(() => {
    if (touched.current) headRef.current?.focus();
  }, [step]);

  const plan = buildPlan(business, needs);
  const q = QUESTIONS[step];
  const answered = step === 0 ? !!business : step === 1 ? needs.length > 0 : !!when;
  const businessLabel = BUSINESS.find((b) => b.id === business)?.label;
  const whenLabel = WHEN.find((w) => w.id === when)?.label;

  const next = () => {
    touched.current = true;
    if (!answered) return setHint(true);
    setHint(false);
    if (step === 2) {
      setDate(today(lang));
      addMany(plan);
      if (whenLabel) setDraft({ timing: whenLabel.ru });
    }
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
    setCallback(false);
    setStep(0);
  };
  const openCallback = () => {
    addMany(plan);
    setCallback((v) => !v);
  };

  // Ссылка на этот план и текст для WhatsApp
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const planPath = business && when && needs.length ? `${base}${PATH[lang]}?plan=${encodeAnswers({ business, needs, when })}` : `${base}${PATH[lang]}`;
  const planUrl = typeof window === "undefined" ? planPath : new URL(planPath, window.location.origin).toString();
  const msg = [
    UI.planMsg[lang],
    ...plan.map((id, i) => `${i + 1}. ${SERVICE_NAMES[id]?.[lang] ?? id}`),
    businessLabel ? `${UI.planBusiness[lang]}: ${businessLabel[lang]}` : "",
    whenLabel ? `${UI.planStart[lang]}: ${whenLabel[lang]}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const agencyWa = SITE.contacts.whatsappHref ? `${SITE.contacts.whatsappHref}?text=${encodeURIComponent(`${msg}\n${UI.planLink[lang]}: ${planUrl}`)}` : "";
  const pm = TEAM.find((p) => p.id === "oksana");

  return (
    <div className={`v3-sheet ${s.wizard} ${step === 3 ? s.wizardDone : ""}`} id="podbor" role="region" aria-label={UI.wizardTitle[lang]}>
      {q ? (
        <>
          <ol className={s.progress} aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} data-on={i === step ? "" : undefined} data-done={i < step ? "" : undefined} />
            ))}
          </ol>
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
                  {UI.step[lang]} {step + 1} {UI.of[lang]} 3
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
                <button type="button" className="v3-btn" onClick={back}>
                  {UI.back[lang]}
                </button>
              )}
              <button type="submit" className="v3-btn v3-btn--ink">
                {step === 2 ? UI.showPlan[lang] : UI.next[lang]}
                <IconArrow />
              </button>
            </div>
          </form>
        </>
      ) : (
        <article className={s.planDoc} aria-labelledby={`${formId}-t`}>
          {/* Шапка документа: как бланк агентства */}
          <div className={s.planMast}>
            <KurakLogo className={s.planLogo} />
            <p className={s.planMade}>
              {UI.planMade[lang]}
              {date && <span className={s.planDate}>{date}</span>}
            </p>
          </div>

          <div className={s.planHead}>
            <h2 ref={headRef} tabIndex={-1} id={`${formId}-t`} className={s.qTitle}>
              {UI.planTitle[lang]}
            </h2>
            <dl className={s.planMeta}>
              {businessLabel && (
                <div>
                  <dt>{UI.planBusiness[lang]}</dt>
                  <dd>{businessLabel[lang]}</dd>
                </div>
              )}
              {whenLabel && (
                <div>
                  <dt>{UI.planStart[lang]}</dt>
                  <dd>{whenLabel[lang]}</dd>
                </div>
              )}
            </dl>
            <p className={s.planLede}>{UI.planLede[lang]}</p>
          </div>

          <h3 className={s.planSub}>{UI.planWhat[lang]}</h3>
          <ol className={s.plan}>
            {plan.map((id) => {
              const info = SERVICE_BY_ID[id];
              const lead = info?.category.lead;
              const first = FIRST_STEP[id]?.[lang] ?? info?.service.includes[0][lang];
              return (
                <li key={id} className={s.planItem}>
                  <span className={s.planNum} aria-hidden="true" />
                  <div className={s.planText}>
                    <p className={s.planName}>{SERVICE_NAMES[id]?.[lang] ?? id}</p>
                    {first && (
                      <p className={s.planLine}>
                        <span className={s.planKey}>{UI.firstStep[lang]}:</span> {first}
                      </p>
                    )}
                    {lead && (
                      <p className={s.planLine}>
                        <span className={s.planKey}>{UI.leads[lang]}:</span> {lead.name ? `${lead.name}, ${lowerFirst(lead.role[lang])}` : lead.role[lang]}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {pm && (
            <p className={s.planPm}>
              {UI.planPm[lang]}: <Fill value={dt(pm.name, lang)} />, {lowerFirst(pm.role[lang])}
            </p>
          )}

          <h3 className={s.planSub}>{UI.planNext[lang]}</h3>
          <ol className={s.planSteps}>
            {STEPS.map((st, i) => (
              <li key={i}>
                <strong>{st.title[lang]}</strong>
                <span>{i === 0 ? <Fill value={dt(RESPONSE_TIME, lang)} /> : st.text[lang]}</span>
              </li>
            ))}
          </ol>

          {/* Только на бумаге и в PDF: как связаться с агентством */}
          <dl className={s.planContacts}>
            {CHANNELS.filter((c) => c.id !== "instagram").map((c) => (
              <div key={c.id}>
                <dt>{c.label[lang]}</dt>
                <dd>
                  <Fill value={c.value} />
                </dd>
              </div>
            ))}
          </dl>

          <div className={s.planActions} data-noprint="">
            {agencyWa ? (
              <a className="v3-btn v3-btn--primary" href={agencyWa} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp />
                {UI.sendPlan[lang]}
              </a>
            ) : (
              <button type="button" className="v3-btn v3-btn--primary" aria-expanded={callback} aria-controls={formId} onClick={openCallback}>
                <IconPhone />
                {UI.leavePhone[lang]}
              </button>
            )}
            {agencyWa ? (
              <button type="button" className="v3-btn" aria-expanded={callback} aria-controls={formId} onClick={openCallback}>
                <IconPhone />
                {UI.leavePhone[lang]}
              </button>
            ) : (
              <a className="v3-btn" href={whatsappShare(`${msg}\n${UI.planLink[lang]}:`, planUrl)} target="_blank" rel="noopener noreferrer">
                <IconWhatsApp />
                {UI.forwardPlan[lang]}
              </a>
            )}
          </div>

          <div id={formId} className={s.planCallback} hidden={!callback} data-noprint="">
            {callback && (
              <>
                <h3 className={s.planSub}>{UI.callbackTitle[lang]}</h3>
                <V3Form lang={lang} compact autoFocus />
              </>
            )}
          </div>

          <div className={s.planTools} data-noprint="">
            <ShareButton lang={lang} url={planPath} text={UI.planShareText[lang]} label={UI.sharePlan[lang]} className={s.toolBtn} />
            <button type="button" className={s.toolBtn} onClick={() => window.print()}>
              <IconSave />
              {UI.savePlan[lang]}
            </button>
            <button type="button" className={s.toolBtn} onClick={restart}>
              <IconRestart />
              {UI.restart[lang]}
            </button>
          </div>
        </article>
      )}
    </div>
  );
}
