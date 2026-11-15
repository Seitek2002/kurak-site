"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FORM, serviceName, type Lang } from "@/content/kurak";
import { V4 } from "@/content/v4";
import { sendLead, validContact, validName } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { usePicked } from "./Poster";
import s from "./V4.module.css";

type Status = "idle" | "sending" | "sent" | "offline" | "error";

/** Текст задачи, собранный из подборки: «Интересует: таргет, сайты и лендинги» */
function autoTask(ids: string[], lang: Lang) {
  if (ids.length === 0) return "";
  const names = ids.map((id) => serviceName(id, lang));
  return `${V4.brief.autoPrefix[lang]}${names.join(", ")}.`;
}

/**
 * Заявка: имя, контакт (телефон, WhatsApp или Telegram), задача.
 * Задача предзаполняется из подборки, пока человек не написал своё: тогда его текст не трогаем.
 */
export function BriefForm({ lang, children }: { lang: Lang; children?: React.ReactNode }) {
  const uid = useId();
  const ids = usePicked();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const lastAuto = useRef<string | null>(null);
  const key = ids.join("|");

  // Предзаполнение задачи из подборки. Свой текст человека (не пустой и не прошлый автотекст) не перезаписываем.
  useEffect(() => {
    const list = key ? key.split("|") : [];
    const next = autoTask(list, lang);
    const other = autoTask(list, lang === "ru" ? "ky" : "ru");
    const cur = useSelection.getState().draft.task;
    const isAuto = cur.trim() === "" || cur === lastAuto.current || cur === next || cur === other;
    if (isAuto && cur !== next) setDraft({ task: next });
    lastAuto.current = next;
  }, [key, lang, setDraft]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bad = { name: !validName(draft.name), contact: !validContact(draft.contact) };
    setErr(bad);
    if (bad.name) return nameRef.current?.focus();
    if (bad.contact) return contactRef.current?.focus();
    setStatus("sending");
    const outcome = await sendLead(
      {
        name: draft.name.trim(),
        contact: draft.contact.trim(),
        task: draft.task.trim() || undefined,
        services: ids.map((id) => serviceName(id, "ru")),
      },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      clear();
      resetDraft();
      lastAuto.current = "";
    }
  }

  const message = status === "sent" ? FORM.sent[lang] : status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate data-endpoint={process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? ""}>
      <div className={s.field}>
        <label htmlFor={`${uid}-name`} className={s.label}>
          {FORM.name[lang]}
        </label>
        <input
          ref={nameRef}
          id={`${uid}-name`}
          name="name"
          autoComplete="name"
          className={s.input}
          value={draft.name}
          onChange={(e) => {
            setDraft({ name: e.target.value });
            if (err.name && validName(e.target.value)) setErr((x) => ({ ...x, name: false }));
          }}
          aria-invalid={err.name || undefined}
          aria-describedby={`${uid}-name-err`}
        />
        <p id={`${uid}-name-err`} className={s.err}>
          {err.name ? FORM.errName[lang] : ""}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor={`${uid}-contact`} className={s.label}>
          {FORM.contact[lang]}
        </label>
        <input
          ref={contactRef}
          id={`${uid}-contact`}
          name="contact"
          type="text"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+996"
          className={s.input}
          value={draft.contact}
          onChange={(e) => {
            setDraft({ contact: e.target.value });
            if (err.contact && validContact(e.target.value)) setErr((x) => ({ ...x, contact: false }));
          }}
          aria-invalid={err.contact || undefined}
          aria-describedby={`${uid}-contact-err ${uid}-contact-hint`}
        />
        <p id={`${uid}-contact-err`} className={s.err}>
          {err.contact ? FORM.errContact[lang] : ""}
        </p>
        <p id={`${uid}-contact-hint`} className={s.hint}>
          {FORM.fine[lang]}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor={`${uid}-task`} className={s.label}>
          {FORM.task[lang]} <span className={s.optional}>{V4.brief.optional[lang]}</span>
        </label>
        <textarea
          id={`${uid}-task`}
          name="task"
          rows={4}
          className={`${s.input} ${s.area}`}
          placeholder={FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>
      <div className={s.submitRow}>
        <button type="submit" className="v4-btn" disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
          {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
      </div>
      <p className={s.status} role="status" data-status={status}>
        {message}
      </p>
      {children}
    </form>
  );
}
