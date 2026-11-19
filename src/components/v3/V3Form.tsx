"use client";

import { useEffect, useId, useRef, useState } from "react";
import { serviceName } from "@/content/kurak";
import { UI, SERVICE_NAMES, type Lang } from "@/content/v3";
import { sendLead, validContact, validName } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import s from "./V3.module.css";

type Status = { kind: "idle" | "sending" | "sent" | "offline" | "error"; text?: string };

/**
 * Заявка крупно: имя, телефон, задача по желанию. План из помощника уходит вместе с заявкой.
 * compact: только имя и телефон, для листа с планом в первом экране. Черновик общий с большой формой.
 */
export function V3Form({ lang, compact = false, autoFocus = false }: { lang: Lang; compact?: boolean; autoFocus?: boolean }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [err, setErr] = useState<{ name?: string; phone?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) nameRef.current?.focus();
  }, [autoFocus]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (!validName(draft.name)) next.name = UI.errName[lang];
    if (!validContact(draft.contact)) next.phone = UI.errPhone[lang];
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.phone) return phoneRef.current?.focus();

    setStatus({ kind: "sending" });
    const out = await sendLead(
      {
        name: draft.name.trim(),
        contact: draft.contact.trim(),
        task: draft.task.trim() || undefined,
        services: picked.map((id) => serviceName(id, "ru")),
        timing: draft.timing || undefined,
      },
      `${window.location.pathname} (${lang})`,
    );
    if (out === "sent") {
      setStatus({ kind: "sent" });
      resetDraft();
      clear();
      return;
    }
    setStatus(out === "offline" ? { kind: "offline", text: UI.demo[lang] } : { kind: "error", text: UI.failed[lang] });
  }

  if (status.kind === "sent") {
    return (
      <div className={s.formDone} role="status">
        {UI.sent[lang]}
      </div>
    );
  }

  const nameField = (
    <div className={s.field}>
      <label htmlFor={`${uid}-n`}>{UI.name[lang]}</label>
      <input
        ref={nameRef}
        id={`${uid}-n`}
        name="name"
        autoComplete="name"
        className={s.input}
        value={draft.name}
        onChange={(e) => setDraft({ name: e.target.value })}
        aria-invalid={!!err.name || undefined}
        aria-describedby={`${uid}-ne`}
      />
      <p id={`${uid}-ne`} className={s.err}>{err.name}</p>
    </div>
  );
  const phoneField = (
    <div className={s.field}>
      <label htmlFor={`${uid}-p`}>{UI.phone[lang]}</label>
      <input
        ref={phoneRef}
        id={`${uid}-p`}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+996"
        className={s.input}
        value={draft.contact}
        onChange={(e) => setDraft({ contact: e.target.value })}
        aria-invalid={!!err.phone || undefined}
        aria-describedby={`${uid}-pe`}
      />
      <p id={`${uid}-pe`} className={s.err}>{err.phone}</p>
    </div>
  );
  const submit = (
    <button type="submit" className="v3-btn v3-btn--primary" disabled={status.kind === "sending"} aria-busy={status.kind === "sending" || undefined}>
      {status.kind === "sending" ? UI.sending[lang] : UI.submit[lang]}
    </button>
  );
  const statusLine = (
    <p className={s.status} role="status">
      {status.text ?? ""}
    </p>
  );

  if (compact) {
    return (
      <form className={`${s.form} ${s.formCompact}`} onSubmit={onSubmit} noValidate>
        <div className={s.formRow}>
          {nameField}
          {phoneField}
        </div>
        <div className={s.formFoot}>
          {submit}
          <p className={s.fine}>{UI.fine[lang]}</p>
        </div>
        {statusLine}
      </form>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <h3 className={s.formTitle}>{UI.formTitle[lang]}</h3>
      {picked.length > 0 && (
        <p className={s.formPlan}>
          {UI.planTitle[lang]}: {picked.map((id) => SERVICE_NAMES[id]?.[lang]).filter(Boolean).join(", ")}
        </p>
      )}
      {nameField}
      {phoneField}
      <div className={s.field}>
        <label htmlFor={`${uid}-c`}>{UI.comment[lang]}</label>
        <textarea
          id={`${uid}-c`}
          name="task"
          rows={3}
          className={`${s.input} ${s.area}`}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>
      {submit}
      <p className={s.fine}>{UI.fine[lang]}</p>
      {statusLine}
    </form>
  );
}
