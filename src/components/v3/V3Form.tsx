"use client";

import { useId, useRef, useState } from "react";
import { UI, SERVICE_NAMES, type Lang } from "@/content/v3";
import { useSelection } from "@/store/selection";
import { trackLead } from "@/lib/track";
import s from "./V3.module.css";

type Status = { kind: "idle" | "sending" | "sent" | "offline" | "error"; text?: string };

/** Три поля, крупно: имя, телефон, задача по желанию. План из помощника уходит вместе с заявкой. */
export function V3Form({ lang }: { lang: Lang }) {
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof err = {};
    if (draft.name.trim().length < 2) next.name = UI.errName[lang];
    if (draft.contact.replace(/\D/g, "").length < 9) next.phone = UI.errPhone[lang];
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.phone) return phoneRef.current?.focus();

    const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
    if (!endpoint) return setStatus({ kind: "offline", text: UI.demo[lang] });
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(endpoint.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${endpoint}` : endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          contact: draft.contact,
          task: draft.task,
          services: picked.map((id) => SERVICE_NAMES[id]?.ru).filter(Boolean),
          page: `${window.location.pathname} (${lang})`,
        }),
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        trackLead();
        resetDraft();
        clear();
        return;
      }
      setStatus(res.status === 503 ? { kind: "offline", text: UI.demo[lang] } : { kind: "error", text: UI.failed[lang] });
    } catch {
      setStatus({ kind: "error", text: UI.failed[lang] });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className={s.formDone} role="status">
        {UI.sent[lang]}
      </div>
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
      <button type="submit" className="v3-btn v3-btn--primary" disabled={status.kind === "sending"} aria-busy={status.kind === "sending" || undefined}>
        {status.kind === "sending" ? UI.sending[lang] : UI.submit[lang]}
      </button>
      <p className={s.fine}>{UI.fine[lang]}</p>
      <p className={s.status} role="status">
        {status.text ?? ""}
      </p>
    </form>
  );
}
