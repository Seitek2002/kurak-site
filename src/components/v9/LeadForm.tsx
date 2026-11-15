"use client";

import { useId, useRef, useState } from "react";
import { FORM, serviceName, type Lang } from "@/content/kurak";
import { V9 } from "@/content/v9";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import s from "./V9.module.css";

type Status = "idle" | "sending" | LeadOutcome;

/** Заявка: имя, контакт, задача. Подборка из меню услуг стоит над полем задачи и уходит вместе с заявкой. */
export function LeadForm({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
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
      useSelection.getState().clear();
      useSelection.getState().resetDraft();
    }
  }

  if (status === "sent") {
    return (
      <div className={s.sent} role="status">
        <p>{FORM.sent[lang]}</p>
      </div>
    );
  }

  const msg = status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-promise`}>
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
          onChange={(e) => {
            setDraft({ name: e.target.value });
            if (err.name && validName(e.target.value)) setErr((x) => ({ ...x, name: false }));
          }}
          aria-invalid={err.name || undefined}
          aria-describedby={err.name ? `${uid}-ne` : undefined}
        />
        {err.name && (
          <p id={`${uid}-ne`} className={s.err}>
            {FORM.errName[lang]}
          </p>
        )}
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-c`} className={s.label}>
          {FORM.contact[lang]}
        </label>
        <input
          ref={contactRef}
          id={`${uid}-c`}
          name="contact"
          autoComplete="tel"
          inputMode="text"
          placeholder="+996 ___ ___ ___"
          className={s.input}
          value={draft.contact}
          onChange={(e) => {
            setDraft({ contact: e.target.value });
            if (err.contact && validContact(e.target.value)) setErr((x) => ({ ...x, contact: false }));
          }}
          aria-invalid={err.contact || undefined}
          aria-describedby={err.contact ? `${uid}-ce ${uid}-cf` : `${uid}-cf`}
        />
        {err.contact && (
          <p id={`${uid}-ce`} className={s.err}>
            {FORM.errContact[lang]}
          </p>
        )}
        <p id={`${uid}-cf`} className={s.hint}>
          {FORM.fine[lang]}
        </p>
      </div>

      <div className={s.field}>
        <p className={s.label} id={`${uid}-p`}>
          {FORM.picked[lang]}
        </p>
        {picked.length ? (
          <ul className={s.chips} aria-labelledby={`${uid}-p`}>
            {picked.map((id) => (
              <li key={id} className={s.chip}>
                <span>{serviceName(id, lang)}</span>
                <button
                  type="button"
                  className={s.chipX}
                  aria-label={`${V9.removeFrom[lang]}: ${serviceName(id, lang)}`}
                  onClick={() => remove(id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.hint}>
            {FORM.empty[lang]}{" "}
            <a href="#services" className={s.inlineLink}>
              {V9.nav.services[lang]}
            </a>
          </p>
        )}
      </div>

      <div className={s.field}>
        <label htmlFor={`${uid}-t`} className={s.label}>
          {FORM.task[lang]}
        </label>
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

      <div className={s.formFoot}>
        <button
          type="submit"
          className={`${s.btn} ${s.btnRed} ${s.submit}`}
          disabled={status === "sending"}
          aria-busy={status === "sending" || undefined}
        >
          {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
        <p id={`${uid}-promise`} className={s.hint}>
          {FORM.promise[lang]}
        </p>
      </div>

      <p className={s.status} role="status" data-kind={msg ? status : undefined}>
        {msg}
      </p>
    </form>
  );
}
