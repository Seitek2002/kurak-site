"use client";

import { useId, useRef, useState } from "react";
import { FORM, serviceName, type Lang } from "@/content/kurak";
import { V7 } from "@/content/v7";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { ArrowRight } from "./Art";
import s from "./V7Form.module.css";

type Status = "idle" | "sending" | LeadOutcome;

/**
 * «Расскажите о задаче»: имя, контакт (телефон, WhatsApp или Telegram), задача.
 * Подборка из меню услуг стоит прямо в поле задачи чипами, их можно убрать. Услуги уходят русскими названиями.
 */
export function V7Form({ lang }: { lang: Lang }) {
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
  const doneRef = useRef<HTMLParagraphElement>(null);

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
      requestAnimationFrame(() => doneRef.current?.focus());
    }
  }

  if (status === "sent") {
    return (
      <div className={s.done}>
        <p ref={doneRef} tabIndex={-1} role="status" className={s.doneText}>
          {FORM.sent[lang]}
        </p>
        <p className={s.promise}>{FORM.promise[lang]}</p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-t`}>
      <h3 id={`${uid}-t`} className={s.title}>
        {FORM.title[lang]}
      </h3>

      <div className={s.field}>
        <label htmlFor={`${uid}-n`} className={s.label}>
          {FORM.name[lang]}
        </label>
        <input
          ref={nameRef}
          id={`${uid}-n`}
          name="name"
          autoComplete="name"
          className={s.input}
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          aria-invalid={err.name || undefined}
          aria-describedby={err.name ? `${uid}-ne` : undefined}
        />
        {err.name ? (
          <p id={`${uid}-ne`} className={s.err}>
            {FORM.errName[lang]}
          </p>
        ) : null}
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-c`} className={s.label}>
          {FORM.contact[lang]}
        </label>
        <input
          ref={contactRef}
          id={`${uid}-c`}
          name="contact"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+996 ... / @nick"
          className={s.input}
          value={draft.contact}
          onChange={(e) => setDraft({ contact: e.target.value })}
          aria-invalid={err.contact || undefined}
          aria-describedby={`${uid}-cf${err.contact ? ` ${uid}-ce` : ""}`}
        />
        {err.contact ? (
          <p id={`${uid}-ce`} className={s.err}>
            {FORM.errContact[lang]}
          </p>
        ) : null}
        <p id={`${uid}-cf`} className={s.hint}>
          {FORM.fine[lang]}
        </p>
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-k`} className={s.label}>
          {FORM.task[lang]}
        </label>
        <div className={s.picked} role="group" aria-label={V7.form.picked[lang]}>
          {picked.length ? (
            <>
              <span className={s.pickedLabel}>{V7.form.picked[lang]}:</span>
              <ul className={s.chips}>
                {picked.map((id) => (
                  <li key={id}>
                    <button type="button" className={s.chip} onClick={() => remove(id)} aria-label={`${V7.form.removeOne[lang]}: ${serviceName(id, lang)}`}>
                      {serviceName(id, lang)}
                      <span className={s.chipX} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span className={s.pickedEmpty}>{FORM.empty[lang]}</span>
          )}
        </div>
        <textarea
          id={`${uid}-k`}
          name="task"
          rows={3}
          className={`${s.input} ${s.area}`}
          placeholder={FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>

      <button type="submit" className={`v7-btn ${s.submit}`} disabled={sending} aria-busy={sending || undefined}>
        {sending ? FORM.sending[lang] : FORM.submit[lang]}
        <ArrowRight className={s.submitArrow} />
      </button>

      <p className={s.status} role="status" data-tone={status === "error" ? "error" : status === "offline" ? "offline" : undefined}>
        {status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : ""}
      </p>
    </form>
  );
}
