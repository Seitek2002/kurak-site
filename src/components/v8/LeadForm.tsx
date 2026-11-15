"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FORM, SERVICE_BY_ID, UI, serviceName, type Lang } from "@/content/kurak";
import { V8 } from "@/content/v8";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { IconCheck, IconClose } from "./Icons";
import s from "./LeadForm.module.css";

type Status = "idle" | "sending" | LeadOutcome;

/**
 * Заявка: имя, контакт, задача. Подборка из меню стоит прямо в поле «Задача» таблетками,
 * уходит вместе с заявкой русскими названиями. Черновик полей общий (useSelection.draft),
 * поэтому форма в панели заявки и форма внизу страницы всегда совпадают.
 */
export function LeadForm({ lang, focusFirst = false, onDone }: { lang: Lang; focusFirst?: boolean; onDone?: () => void }) {
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
  const doneRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusFirst) nameRef.current?.focus();
  }, [focusFirst]);
  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
    if (status === "offline" || status === "error") statusRef.current?.scrollIntoView({ block: "nearest" });
  }, [status]);

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

  if (status === "sent") {
    return (
      <div className={s.done} role="status" tabIndex={-1} ref={doneRef}>
        <span className={s.doneIcon} aria-hidden="true">
          <IconCheck />
        </span>
        <p className={s.doneText}>{FORM.sent[lang]}</p>
        {onDone ? (
          <button type="button" className="v8-btn v8-btn--grey" onClick={onDone}>
            {UI.close[lang]}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
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
          autoComplete="tel"
          placeholder="+996"
          className={s.input}
          value={draft.contact}
          onChange={(e) => {
            setDraft({ contact: e.target.value });
            if (err.contact && validContact(e.target.value)) setErr((x) => ({ ...x, contact: false }));
          }}
          aria-invalid={err.contact || undefined}
          aria-describedby={err.contact ? `${uid}-ce ${uid}-cf` : `${uid}-cf`}
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
        <label htmlFor={`${uid}-t`} className={s.label}>
          {FORM.task[lang]}
        </label>
        <div className={s.taskBox}>
          {picked.length > 0 ? (
            <div className={s.picked}>
              <p className={s.pickedLabel} id={`${uid}-p`}>
                {V8.form.taskPicked[lang]}
              </p>
              <ul className={s.chips} aria-labelledby={`${uid}-p`}>
                {picked.map((id) => (
                  <li key={id} className={s.chip}>
                    <span>{SERVICE_BY_ID[id] ? serviceName(id, lang) : id}</span>
                    <button type="button" className={s.chipX} onClick={() => remove(id)} aria-label={`${UI.remove[lang]}: ${serviceName(id, lang)}`}>
                      <IconClose />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <textarea
            id={`${uid}-t`}
            name="task"
            rows={3}
            className={s.area}
            placeholder={FORM.taskHint[lang]}
            value={draft.task}
            onChange={(e) => setDraft({ task: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="v8-btn v8-btn--primary v8-btn--lg v8-btn--block" disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
        {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
      </button>

      <div role="status" className={s.statusSlot} ref={statusRef}>
        {status === "offline" ? <p className={s.notice}>{FORM.offline[lang]}</p> : null}
        {status === "error" ? <p className={`${s.notice} ${s.noticeErr}`}>{FORM.error[lang]}</p> : null}
      </div>
    </form>
  );
}
