"use client";

import { useId, useRef, useState } from "react";
import { CHANNELS, FORM, serviceName, type Lang } from "@/content/kurak";
import { V12 } from "@/content/v12";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import s from "./V12.module.css";

type Mode = (typeof V12.contact.modes)[number]["id"];
type Status = "idle" | "sending" | LeadOutcome;

const WA = CHANNELS.find((c) => c.id === "whatsapp")!;
const TG = CHANNELS.find((c) => c.id === "telegram")!;

/**
 * Блок заявки с переключателем вариантов (заказчик выберет один):
 * «Заявка-объявление» (полная форма), «Написать жарчы» (сообщение для WhatsApp/Telegram из подборки),
 * «Короткий зов» (имя и телефон, перезвоним).
 */
export function Contact({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<Mode>("form");
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const modes = V12.contact.modes;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const j = (i + dir + modes.length) % modes.length;
    setMode(modes[j]!.id);
    tabs.current[j]?.focus();
  };

  return (
    <div className={s.contactBox}>
      <div className={s.modes} role="tablist" aria-label={V12.contact.switchLabel[lang]}>
        {modes.map((m, i) => (
          <button
            key={m.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab-${m.id}`}
            aria-selected={mode === m.id}
            aria-controls={`${uid}-panel-${m.id}`}
            tabIndex={mode === m.id ? 0 : -1}
            className={s.modeTab}
            onClick={() => setMode(m.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className={s.modeName}>{m.name[lang]}</span>
            <span className={s.modeHint}>{m.hint[lang]}</span>
          </button>
        ))}
      </div>

      {modes.map((m) => (
        <div
          key={m.id}
          role="tabpanel"
          id={`${uid}-panel-${m.id}`}
          aria-labelledby={`${uid}-tab-${m.id}`}
          hidden={mode !== m.id}
          className={s.modePanel}
        >
          {m.id === "form" && <LeadForm lang={lang} />}
          {m.id === "chat" && <ChatComposer lang={lang} />}
          {m.id === "call" && <Callback lang={lang} />}
        </div>
      ))}
    </div>
  );
}

/* ---------------- общее ---------------- */

function Outcome({ status, lang }: { status: Status; lang: Lang }) {
  const msg = status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";
  return (
    <p className={s.status} role="status" data-kind={msg ? status : undefined}>
      {msg}
    </p>
  );
}

function Sent({ lang }: { lang: Lang }) {
  return (
    <div className={s.sent} role="status">
      <svg viewBox="0 0 120 60" className={s.sentMark} aria-hidden="true">
        <path d="M14 8H44L33 24L44 40H14Z" />
        <path d="M14 8V56" />
        <circle cx="14" cy="56" r="3" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="14" cy="56" r="14" className={s.sentRing} style={{ animationDelay: `${i * 0.5}s` }} />
        ))}
      </svg>
      <p>{FORM.sent[lang]}</p>
    </div>
  );
}

function Picked({ lang, uid }: { lang: Lang; uid: string }) {
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  return (
    <div className={s.field}>
      <p className={s.label} id={`${uid}-p`}>
        {FORM.picked[lang]}
      </p>
      {picked.length ? (
        <ul className={s.chips} aria-labelledby={`${uid}-p`}>
          {picked.map((id) => (
            <li key={id} className={s.chip}>
              <span>{serviceName(id, lang)}</span>
              <button type="button" className={s.chipX} aria-label={`${V12.contact.removeFrom[lang]}: ${serviceName(id, lang)}`} onClick={() => remove(id)}>
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.hint}>
          {FORM.empty[lang]}{" "}
          <a href="#ways" className={s.inlineLink}>
            {V12.contact.toWays[lang]}
          </a>
        </p>
      )}
    </div>
  );
}

/* ---------------- «Заявка-объявление» ---------------- */

function LeadForm({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
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
      { name: draft.name.trim(), contact: draft.contact.trim(), task: draft.task.trim() || undefined, services: picked.map((id) => serviceName(id, "ru")) },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      useSelection.getState().clear();
      useSelection.getState().resetDraft();
    }
  }

  if (status === "sent") return <Sent lang={lang} />;

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <div className={s.formGrid}>
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
      </div>

      <Picked lang={lang} uid={uid} />

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
        <button type="submit" className={`${s.btn} ${s.submit}`} disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
          {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
        <p className={s.hint}>{FORM.promise[lang]}</p>
      </div>
      <Outcome status={status} lang={lang} />
    </form>
  );
}

/* ---------------- «Написать жарчы» ---------------- */

function ChatComposer({ lang }: { lang: Lang }) {
  const uid = useId();
  const picked = useSelection((st) => st.picked);
  const task = useSelection((st) => st.draft.task);
  const [edited, setEdited] = useState<string | null>(null);
  const [copy, setCopy] = useState<"" | "ok" | "fail">("");
  const areaRef = useRef<HTMLTextAreaElement>(null);

  const auto = [
    V12.contact.msgHello[lang],
    picked.length ? `${V12.contact.msgPicked[lang]} ${picked.map((id) => serviceName(id, lang)).join(", ")}.` : "",
    task.trim() ? `${V12.contact.msgTask[lang]} ${task.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const text = edited ?? auto;
  const wa = WA.href ? `${WA.href}?text=${encodeURIComponent(text)}` : "";
  const tg = TG.href || "";

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopy("ok");
    } catch {
      // буфер недоступен: выделяем текст, чтобы скопировать вручную
      areaRef.current?.focus();
      areaRef.current?.select();
      setCopy("fail");
    }
  }

  return (
    <div className={s.chat}>
      <div className={s.field}>
        <label htmlFor={`${uid}-m`} className={s.label}>
          {V12.contact.msgLabel[lang]}
        </label>
        <div className={s.bubble}>
          <textarea ref={areaRef} id={`${uid}-m`} rows={5} className={s.bubbleText} value={text} onChange={(e) => setEdited(e.target.value)} />
        </div>
      </div>
      <p className={s.chatTo}>
        <span>{V12.contact.numberLabel[lang]}</span>
        <span>
          WhatsApp <Fill value={WA.value} />
        </span>
        <span>
          Telegram <Fill value={TG.value} />
        </span>
      </p>
      <div className={s.formFoot}>
        {wa ? (
          <a className={`${s.btn} ${s.submit}`} href={wa} target="_blank" rel="noopener noreferrer">
            {V12.contact.openWa[lang]}
          </a>
        ) : null}
        {tg ? (
          <a className={`${s.btn} ${s.btnGhost}`} href={tg} target="_blank" rel="noopener noreferrer">
            {V12.contact.openTg[lang]}
          </a>
        ) : null}
        <button type="button" className={`${s.btn} ${wa ? s.btnGhost : s.submit}`} onClick={onCopy}>
          {V12.contact.copy[lang]}
        </button>
      </div>
      {!wa && <p className={s.hint}>{V12.contact.noNumber[lang]}</p>}
      <p className={s.status} role="status" data-kind={copy === "fail" ? "error" : copy ? "ok" : undefined}>
        {copy === "ok" ? V12.contact.copied[lang] : copy === "fail" ? V12.contact.copyFail[lang] : ""}
      </p>
    </div>
  );
}

/* ---------------- «Короткий зов» ---------------- */

function Callback({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const picked = useSelection((st) => st.picked);
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const phoneOk = draft.contact.replace(/\D/g, "").length >= 9;
    const next = { name: !validName(draft.name), contact: !phoneOk };
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return phoneRef.current?.focus();
    setStatus("sending");
    const outcome = await sendLead(
      { name: draft.name.trim(), contact: draft.contact.trim(), task: V12.contact.callTask, services: picked.map((id) => serviceName(id, "ru")) },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      useSelection.getState().clear();
      useSelection.getState().resetDraft();
    }
  }

  if (status === "sent") return <Sent lang={lang} />;

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <div className={s.formGrid}>
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
          {err.name && (
            <p id={`${uid}-ne`} className={s.err}>
              {FORM.errName[lang]}
            </p>
          )}
        </div>
        <div className={s.field}>
          <label htmlFor={`${uid}-ph`} className={s.label}>
            {V12.contact.phone[lang]}
          </label>
          <input
            ref={phoneRef}
            id={`${uid}-ph`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+996 ___ ___ ___"
            className={s.input}
            value={draft.contact}
            onChange={(e) => setDraft({ contact: e.target.value })}
            aria-invalid={err.contact || undefined}
            aria-describedby={err.contact ? `${uid}-pe` : undefined}
          />
          {err.contact && (
            <p id={`${uid}-pe`} className={s.err}>
              {FORM.errContact[lang]}
            </p>
          )}
        </div>
      </div>
      <div className={s.formFoot}>
        <button type="submit" className={`${s.btn} ${s.submit}`} disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
          {status === "sending" ? FORM.sending[lang] : V12.contact.callSubmit[lang]}
        </button>
        <p className={s.hint}>{FORM.fine[lang]}</p>
      </div>
      <Outcome status={status} lang={lang} />
    </form>
  );
}
