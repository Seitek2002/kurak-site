"use client";

import { useId, useRef, useState } from "react";
import { FORM, UI, serviceName, type Lang } from "@/content/kurak";
import { V5 } from "@/content/v5";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { IconClose } from "./Geometry";
import s from "./V5.module.css";

type Status = "idle" | "sending" | LeadOutcome;

/**
 * Заявка: имя, контакт, подборка из меню и календаря, задача своими словами.
 * Исходы честные: «sent» только по ответу приёмника, «offline» говорит, что это демо и заявка не ушла.
 */
export function LeadForm({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = { name: !validName(draft.name), contact: !validContact(draft.contact) };
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return contactRef.current?.focus();

    setStatus("sending");
    const outcome = await sendLead(
      {
        name: draft.name.trim(),
        contact: draft.contact.trim(),
        task: draft.task.trim() || undefined,
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

  const message = status === "sent" ? FORM.sent[lang] : status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-st`}>
      <div className={s.field}>
        <label htmlFor={`${uid}-n`} className={s.label}>{FORM.name[lang]}</label>
        <input
          ref={nameRef}
          id={`${uid}-n`}
          name="name"
          autoComplete="name"
          className={s.input}
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          aria-invalid={err.name || undefined}
          aria-describedby={`${uid}-ne`}
        />
        <p id={`${uid}-ne`} className={s.err}>{err.name ? FORM.errName[lang] : ""}</p>
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-c`} className={s.label}>{FORM.contact[lang]}</label>
        <input
          ref={contactRef}
          id={`${uid}-c`}
          name="contact"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+996"
          className={s.input}
          value={draft.contact}
          onChange={(e) => setDraft({ contact: e.target.value })}
          aria-invalid={err.contact || undefined}
          aria-describedby={`${uid}-ce`}
        />
        <p id={`${uid}-ce`} className={s.err}>{err.contact ? FORM.errContact[lang] : ""}</p>
      </div>

      <fieldset className={s.picked}>
        <legend className={s.label}>{FORM.picked[lang]}</legend>
        {picked.length === 0 ? (
          <p className={s.pickedEmpty}>{V5.form.pickedEmpty[lang]}</p>
        ) : (
          <ul className={s.pickedList}>
            {picked.map((id) => (
              <li key={id} className={s.pickedItem}>
                <span>{serviceName(id, lang)}</span>
                <button type="button" className={s.pickedX} onClick={() => remove(id)} aria-label={`${UI.remove[lang]}: ${serviceName(id, lang)}`}>
                  <IconClose />
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <div className={s.field}>
        <label htmlFor={`${uid}-t`} className={s.label}>{FORM.task[lang]}</label>
        <textarea
          id={`${uid}-t`}
          name="task"
          rows={3}
          className={`${s.input} ${s.area}`}
          placeholder={FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>

      <div className={s.submitRow}>
        <button type="submit" className="v5-btn" disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
          {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
        <p className={s.fine}>{FORM.fine[lang]}</p>
      </div>
      <p id={`${uid}-st`} className={s.status} role="status" data-kind={status}>
        {message}
      </p>
    </form>
  );
}
