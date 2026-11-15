"use client";

import { useId, useRef, useState } from "react";
import { CHANNELS, FORM, RESPONSE_TIME, STEPS, UI, dt, serviceName, type Lang } from "@/content/kurak";
import { V11 } from "@/content/v11";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { Fill } from "../Fill";
import { HOLES, countsFor } from "./data";
import { Strip } from "./Strip";
import { useV11 } from "./store";
import s from "./V11.module.css";

type Mode = "form" | "whatsapp";
type Status = "idle" | "sending" | LeadOutcome;

function IconX() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Что отмечено: услуги по-человечески и стратегия отдельной строкой */
function usePickedList(lang: Lang) {
  const picked = useSelection((st) => st.picked);
  const strategy = useV11((st) => st.strategy);
  const items = [
    ...(strategy ? [{ id: "strategy", name: V11.strategy.title[lang], ru: V11.strategy.leadName }] : []),
    ...picked.map((id) => ({ id, name: serviceName(id, lang), ru: serviceName(id, "ru") })),
  ];
  return { picked, strategy, items };
}

/** Доска клиента: отмеченные лунки уже стоят коргоолами */
function ClientBoard({ lang }: { lang: Lang }) {
  const { picked, strategy, items } = usePickedList(lang);
  const remove = useSelection((st) => st.remove);
  const setStrategy = useV11((st) => st.setStrategy);
  const counts = countsFor(picked, strategy);
  return (
    <div className={s.clientBoard}>
      <p className={s.formLabel}>{V11.contact.board[lang]}</p>
      <Strip counts={counts} labels={HOLES.map((h) => h.short[lang])} size="m" className={s.clientStrip} />
      {items.length === 0 ? (
        <p className={s.pickedEmpty}>{V11.contact.boardEmpty[lang]}</p>
      ) : (
        <ul className={s.pickedList} aria-label={FORM.picked[lang]}>
          {items.map((it) => (
            <li key={it.id} className={s.pickedItem}>
              <span>{it.name}</span>
              <button
                type="button"
                className={s.pickedX}
                onClick={() => (it.id === "strategy" ? setStrategy(false) : remove(it.id))}
                aria-label={`${UI.remove[lang]}: ${it.name}`}
              >
                <IconX />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LeadForm({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const clear = useSelection((st) => st.clear);
  const resetDraft = useSelection((st) => st.resetDraft);
  const setStrategy = useV11((st) => st.setStrategy);
  const { items } = usePickedList(lang);
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
      { name: draft.name.trim(), contact: draft.contact.trim(), task: draft.task.trim() || undefined, services: items.map((it) => it.ru) },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      clear();
      resetDraft();
      setStrategy(false);
    }
  }

  const message = status === "sent" ? FORM.sent[lang] : status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-st`}>
      <div className={s.field}>
        <label htmlFor={`${uid}-n`} className={s.formLabel}>
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
          aria-describedby={`${uid}-ne`}
        />
        <p id={`${uid}-ne`} className={s.err}>
          {err.name ? FORM.errName[lang] : ""}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor={`${uid}-c`} className={s.formLabel}>
          {FORM.contact[lang]}
        </label>
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
        <p id={`${uid}-ce`} className={s.err}>
          {err.contact ? FORM.errContact[lang] : ""}
        </p>
      </div>
      <div className={s.field}>
        <label htmlFor={`${uid}-t`} className={s.formLabel}>
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
      <div className={s.submitRow}>
        <button type="submit" className="v11-btn" disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
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

function WhatsApp({ lang }: { lang: Lang }) {
  const { items } = usePickedList(lang);
  const wa = CHANNELS.find((c) => c.id === "whatsapp")!;
  const draft = useSelection((st) => st.draft);
  const lines = [V11.contact.waHello[lang]];
  if (items.length) lines.push(`${V11.contact.waPicked[lang]}: ${items.map((it) => it.name).join(", ")}.`);
  if (draft.task.trim()) lines.push(draft.task.trim());
  const text = lines.join("\n");
  const base = wa.href && /wa\.me\/\d/.test(wa.href) ? wa.href : "https://wa.me/";
  const href = `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
  return (
    <div className={s.wa}>
      <h3 className={s.waTitle}>{V11.contact.waTitle[lang]}</h3>
      <p className={s.waLead}>{V11.contact.waLead[lang]}</p>
      <figure className={s.waNote}>
        <figcaption className={s.formLabel}>{V11.contact.waPreview[lang]}</figcaption>
        <p className={s.waText}>{text}</p>
      </figure>
      <div className={s.waRow}>
        <a className="v11-btn" href={href} target="_blank" rel="noopener noreferrer">
          {V11.contact.waButton[lang]}
        </a>
        <p className={s.waNumber}>
          {V11.contact.waNumber[lang]}: <Fill value={wa.value} />
        </p>
      </div>
      {base === "https://wa.me/" ? <p className={s.fine}>{V11.contact.waNoNumber[lang]}</p> : null}
      <div className={s.waOther}>
        <p className={s.formLabel}>{V11.contact.other[lang]}</p>
        <ul className={s.channelList}>
          {CHANNELS.filter((c) => c.id !== "whatsapp").map((c) => (
            <li key={c.id}>
              <span className={s.channelName}>{c.label[lang]}</span>
              {c.value.draft ? <Fill value={c.value} /> : <a className="v11-link" href={c.href}>{c.value.value}</a>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * «Ваш первый ход»: два варианта заявки с переключателем.
 * Форма показывает доску клиента с отмеченными лунками; WhatsApp собирает сообщение из тех же лунок.
 */
export function Contact({ lang }: { lang: Lang }) {
  const [mode, setMode] = useState<Mode>("form");
  const modes: Mode[] = ["form", "whatsapp"];
  return (
    <section id="contact" className={`${s.contact} v11-surface`} aria-labelledby="v11-contact-title">
      <div className={`v11-wrap ${s.contactIn}`}>
        <header className={s.contactHead}>
          <h2 id="v11-contact-title" className="v11-h2">
            {V11.contact.title[lang]}
          </h2>
          <p className="v11-lead">{V11.contact.lead[lang]}</p>
          <fieldset className={s.modeSwitch}>
            <legend className={s.formLabel}>{V11.contact.how[lang]}</legend>
            <div className={s.modeRow}>
              {modes.map((m) => (
                <label key={m} className={s.modeOpt}>
                  <input type="radio" name="v11-contact-mode" value={m} checked={mode === m} onChange={() => setMode(m)} className={s.styleInput} />
                  <span>{V11.contact.modes[m][lang]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={s.nextMoves}>
            <p className={s.formLabel}>{V11.contact.nextMoves[lang]}</p>
            <ol className={s.nextList}>
              {STEPS.map((st, i) => (
                <li key={st.title.ru}>
                  <span className={s.moveNo} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>
                    <b>{st.title[lang]}</b> {i === 0 ? <Fill value={dt(RESPONSE_TIME, lang)} /> : null} {st.text[lang]}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </header>

        <div className={s.contactBody}>
          <ClientBoard lang={lang} />
          <div className={s.contactMode} data-open={mode === "form" ? "" : undefined}>
            <LeadForm lang={lang} />
          </div>
          <div className={s.contactMode} data-open={mode === "whatsapp" ? "" : undefined}>
            <WhatsApp lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
