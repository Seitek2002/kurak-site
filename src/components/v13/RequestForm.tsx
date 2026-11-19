"use client";

import { useRef, useState } from "react";
import { FORM, UI, serviceName, type Lang } from "@/content/kurak";
import { sendLead, validContact, validName } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import s from "./Request.module.css";

type Status = "idle" | "sending" | "sent" | "offline" | "error";

/**
 * Форма заявки: имя, контакт, задача. Задача уже содержит строки плана и расчёта, если человек их пришил,
 * подборка услуг уходит русскими названиями, срок из опроса в timing.
 * Исход честный: sent, offline (демо, заявка не ушла), error.
 */
export function RequestForm({ lang }: { lang: Lang }) {
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<{ name?: string; contact?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!validName(draft.name)) next.name = FORM.errName[lang];
    if (!validContact(draft.contact)) next.contact = FORM.errContact[lang];
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
        timing: draft.timing || undefined,
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
      <div className={s.done} role="status">
        <p>{FORM.sent[lang]}</p>
      </div>
    );
  }

  const sending = status === "sending";
  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-labelledby="zayavka-title" data-endpoint={process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? ""}>
      <div className={s.field}>
        <label htmlFor="v13-name" className={s.label}>
          {FORM.name[lang]}
        </label>
        <input
          ref={nameRef}
          id="v13-name"
          name="name"
          autoComplete="name"
          className={s.input}
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          aria-invalid={err.name ? true : undefined}
          aria-describedby="v13-name-help"
          aria-required="true"
        />
        <p id="v13-name-help" className={s.help} data-error={err.name ? true : undefined}>
          {err.name ?? ""}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor="v13-contact" className={s.label}>
          {FORM.contact[lang]}
        </label>
        <input
          ref={contactRef}
          id="v13-contact"
          name="contact"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+996 555 123 456"
          className={s.input}
          value={draft.contact}
          onChange={(e) => setDraft({ contact: e.target.value })}
          aria-invalid={err.contact ? true : undefined}
          aria-describedby="v13-contact-help"
          aria-required="true"
        />
        <p id="v13-contact-help" className={s.help} data-error={err.contact ? true : undefined}>
          {err.contact ?? FORM.fine[lang]}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor="v13-task" className={s.label}>
          {FORM.task[lang]}
        </label>
        <textarea
          id="v13-task"
          name="task"
          rows={5}
          className={`${s.input} ${s.area}`}
          placeholder={FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>
      <div className={s.act}>
        <button type="submit" className={`v13-btn ${s.submit}`} disabled={sending} aria-busy={sending || undefined}>
          {sending ? FORM.sending[lang] : UI.apply[lang]}
        </button>
        <p className={s.promise}>{FORM.promise[lang]}</p>
      </div>
      <p className={s.status} role="status" data-tone={status === "error" ? "error" : status === "offline" ? "offline" : undefined}>
        {status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : ""}
      </p>
    </form>
  );
}
