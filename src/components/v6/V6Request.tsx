"use client";

import { useRef, useState } from "react";
import { FORM, SERVICE_BY_ID, serviceName, type Lang } from "@/content/kurak";
import { V6_REQUEST, V6_UI } from "@/content/v6";
import { sendLead, validContact, validName } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { hasPrefill, monthLoss, prefillText, som, useCalc } from "./calc";
import { IconClose, IconPlus } from "./Icons";
import s from "./V6.module.css";

type Status = "idle" | "sending" | "sent" | "offline" | "error";

/**
 * Заявка как счёт без цен: слева строки подборки (их можно убрать), справа три поля.
 * Задача предзаполнена кнопкой «Вернуть эти деньги» из расчёта. Если посетитель менял цифры калькулятора,
 * строка расчёта видна в «Ваша заявка» и уходит с заявкой, с какой бы кнопки он ни пришёл (её можно убрать).
 * Исход честный: sent, offline (демо), error.
 */
/** Цифры калькулятора для заявки: null, пока посетитель их не трогал или убрал строку */
function useCalcForRequest(lang: Lang) {
  const leads = useCalc((st) => st.leads);
  const pct = useCalc((st) => st.pct);
  const check = useCalc((st) => st.check);
  const touched = useCalc((st) => st.touched);
  const included = useCalc((st) => st.included);
  const v = { leads, pct, check };
  return { touched, included, month: som(monthLoss(v)), text: prefillText(v, lang) };
}

export function V6Bill({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  const calc = useCalcForRequest(lang);
  const setIncluded = useCalc((st) => st.setIncluded);
  return (
    <div className={s.bill}>
      <h3 className={s.billTitle}>{V6_REQUEST.bill[lang]}</h3>
      {calc.touched &&
        (calc.included ? (
          <p className={s.billCalc}>
            <span className={s.billCalcLabel}>{V6_REQUEST.calc[lang]}</span>
            <span className={`${s.billCalcValue} v6-num`}>{V6_REQUEST.calcValue(calc.month)[lang]}</span>
            <button type="button" className={s.billRemove} onClick={() => setIncluded(false)} aria-label={V6_REQUEST.calcRemove[lang]}>
              <IconClose />
            </button>
          </p>
        ) : (
          <button type="button" className="v6-chip" onClick={() => setIncluded(true)}>
            <IconPlus />
            <span>{V6_REQUEST.calcBack[lang]}</span>
          </button>
        ))}
      {picked.length === 0 ? (
        <p className={s.billEmpty}>{FORM.empty[lang]}</p>
      ) : (
        <ul className={s.billList} aria-label={FORM.picked[lang]}>
          {picked.map((id) => {
            const hit = SERVICE_BY_ID[id];
            if (!hit) return null;
            const name = hit.service.title[lang];
            return (
              <li key={id} className={s.billRow}>
                <span className={s.billName}>{name}</span>
                <span className={s.billCat}>{hit.category.short[lang]}</span>
                <button type="button" className={s.billRemove} onClick={() => remove(id)} aria-label={V6_UI.remove(name)[lang]}>
                  <IconClose />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className={s.billTotal}>
        <span>{V6_REQUEST.price[lang]}</span>
        <span>{V6_REQUEST.priceValue[lang]}</span>
      </p>
    </div>
  );
}

export function V6Form({ lang }: { lang: Lang }) {
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<{ name?: string; contact?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const calc = useCalcForRequest(lang);
  const withCalc = calc.touched && calc.included;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!validName(draft.name)) next.name = FORM.errName[lang];
    if (!validContact(draft.contact)) next.contact = FORM.errContact[lang];
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return contactRef.current?.focus();

    setStatus("sending");
    // Расчёт из калькулятора уходит с заявкой, если его ещё нет в тексте задачи
    const task = withCalc && !hasPrefill(draft.task) ? [calc.text, draft.task.trim()].filter(Boolean).join("\n") : draft.task.trim();
    const outcome = await sendLead(
      {
        name: draft.name.trim(),
        contact: draft.contact.trim(),
        task: task || undefined,
        services: picked.map((id) => serviceName(id, "ru")),
      },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      clear();
      resetDraft();
    }
  }

  if (status === "sent") {
    return (
      <div className={s.formDone} role="status">
        <p>{FORM.sent[lang]}</p>
      </div>
    );
  }

  const sending = status === "sending";
  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-labelledby="v6-form-title">
      <h3 id="v6-form-title" className="visually-hidden">
        {FORM.title[lang]}
      </h3>
      <div className={s.field}>
        <label htmlFor="v6-name" className={s.fieldLabel}>
          {FORM.name[lang]}
        </label>
        <input
          ref={nameRef}
          id="v6-name"
          name="name"
          autoComplete="name"
          className={s.input}
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          aria-invalid={err.name ? true : undefined}
          aria-describedby="v6-name-help"
          aria-required="true"
        />
        <p id="v6-name-help" className={s.help} data-error={err.name ? true : undefined}>
          {err.name ?? ""}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor="v6-contact" className={s.fieldLabel}>
          {FORM.contact[lang]}
        </label>
        <input
          ref={contactRef}
          id="v6-contact"
          name="contact"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+996 555 123 456"
          className={s.input}
          value={draft.contact}
          onChange={(e) => setDraft({ contact: e.target.value })}
          aria-invalid={err.contact ? true : undefined}
          aria-describedby="v6-contact-help"
          aria-required="true"
        />
        <p id="v6-contact-help" className={s.help} data-error={err.contact ? true : undefined}>
          {err.contact ?? FORM.fine[lang]}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor="v6-task" className={s.fieldLabel}>
          {FORM.task[lang]}
        </label>
        <textarea
          id="v6-task"
          name="task"
          rows={5}
          className={`${s.input} ${s.area}`}
          placeholder={withCalc ? calc.text : FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>
      <div className={s.formAct}>
        <button type="submit" className="v6-btn" disabled={sending} aria-busy={sending || undefined}>
          {sending ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
        <p className={s.formStatus} role="status" data-tone={status === "error" ? "error" : undefined}>
          {status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : ""}
        </p>
      </div>
    </form>
  );
}
