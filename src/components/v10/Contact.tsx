"use client";

import { useId, useRef, useState } from "react";
import { Fill } from "@/components/Fill";
import { CHANNELS, FORM, SERVICE_BY_ID, serviceName, type Lang } from "@/content/kurak";
import { V10 } from "@/content/v10";
import { sendLead, validContact, validName, type LeadOutcome } from "@/lib/lead";
import { useSelection } from "@/store/selection";
import { wool } from "./wool";
import s from "./V10.module.css";

type Status = "idle" | "sending" | LeadOutcome;
type Variant = "loom" | "whatsapp";

/* ------------------------------------------------------------------ */
/* Станок: каждая выбранная услуга натянута отдельным стеблем           */
/* ------------------------------------------------------------------ */

function Loom({ lang }: { lang: Lang }) {
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  const clear = useSelection((st) => st.clear);
  const uid = useId();

  return (
    <div className={s.loom}>
      <h3 className={s.loomTitle} id={`${uid}-t`}>
        {V10.loom.title[lang]}
      </h3>
      <p className={s.hint}>{V10.loom.caption[lang]}</p>
      <div className={s.loomFrame}>
        {picked.length ? (
          <ul className={s.loomStalks} aria-labelledby={`${uid}-t`}>
            {picked.map((id) => {
              const cat = SERVICE_BY_ID[id]?.category.id ?? "smm";
              const name = serviceName(id, lang);
              return (
                <li key={id} className={s.loomStalk} style={{ "--w": wool(cat) } as React.CSSProperties}>
                  <span className={s.loomStalkBody}>
                    <span className={s.loomName}>{name}</span>
                  </span>
                  <button type="button" className={s.loomX} onClick={() => remove(id)} aria-label={`${V10.removeFrom[lang]}: ${name}`}>
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={s.loomEmpty}>
            <span className={s.ghost} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
            <p className={s.hint}>{V10.loom.empty[lang]}</p>
            <a href="#services" className={s.textLink}>
              {V10.loom.toMenu[lang]}
            </a>
          </div>
        )}
      </div>
      {picked.length ? (
        <div className={s.loomFoot}>
          <span>
            {picked.length} {V10.loom.count[lang]}
          </span>
          <button type="button" className={s.clear} onClick={clear}>
            {V10.loom.clear[lang]}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Форма                                                               */
/* ------------------------------------------------------------------ */

function useLead(lang: Lang) {
  const [status, setStatus] = useState<Status>("idle");
  const submit = async (payload: { name: string; contact: string; task?: string }) => {
    setStatus("sending");
    const picked = useSelection.getState().picked;
    const outcome = await sendLead(
      { ...payload, services: picked.map((id) => serviceName(id, "ru")) },
      `${window.location.pathname} (${lang})`,
    );
    setStatus(outcome);
    if (outcome === "sent") {
      useSelection.getState().clear();
      useSelection.getState().resetDraft();
    }
  };
  return { status, submit };
}

function Status({ status, lang }: { status: Status; lang: Lang }) {
  const msg = status === "offline" ? FORM.offline[lang] : status === "error" ? FORM.error[lang] : "";
  return (
    <p className={s.status} role="status" data-kind={msg ? status : undefined}>
      {msg}
    </p>
  );
}

function LeadForm({ lang }: { lang: Lang }) {
  const uid = useId();
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const { status, submit } = useLead(lang);
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { name: !validName(draft.name), contact: !validContact(draft.contact) };
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return contactRef.current?.focus();
    void submit({ name: draft.name.trim(), contact: draft.contact.trim(), task: draft.task.trim() || undefined });
  };

  if (status === "sent") {
    return (
      <div className={s.sent} role="status">
        <p>{FORM.sent[lang]}</p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-h`} aria-describedby={`${uid}-promise`}>
      <h3 id={`${uid}-h`} className={s.formTitle}>
        {FORM.title[lang]}
      </h3>
      <div className={s.field2}>
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
      <div className={s.field2}>
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
        {err.contact ? (
          <p id={`${uid}-ce`} className={s.err}>
            {FORM.errContact[lang]}
          </p>
        ) : null}
        <p id={`${uid}-cf`} className={s.hint}>
          {FORM.fine[lang]}
        </p>
      </div>
      <div className={s.field2}>
        <label htmlFor={`${uid}-t`} className={s.label}>
          {FORM.task[lang]}
        </label>
        <textarea
          id={`${uid}-t`}
          name="task"
          rows={4}
          className={`${s.input} ${s.area}`}
          placeholder={FORM.taskHint[lang]}
          value={draft.task}
          onChange={(e) => setDraft({ task: e.target.value })}
        />
      </div>
      <div className={s.formFoot}>
        <button type="submit" className={s.btn} disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
          {status === "sending" ? FORM.sending[lang] : FORM.submit[lang]}
        </button>
        <p id={`${uid}-promise`} className={s.hint}>
          {FORM.promise[lang]}
        </p>
      </div>
      <Status status={status} lang={lang} />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Сразу в WhatsApp                                                     */
/* ------------------------------------------------------------------ */

const WA = CHANNELS.find((c) => c.id === "whatsapp")!;

function WhatsApp({ lang }: { lang: Lang }) {
  const uid = useId();
  const picked = useSelection((st) => st.picked);
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const { status, submit } = useLead(lang);
  const [err, setErr] = useState<{ name?: boolean; contact?: boolean }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const message = [V10.wa.hello[lang], picked.length ? `${V10.wa.interest[lang]}: ${picked.map((id) => serviceName(id, lang)).join(", ")}.` : ""]
    .filter(Boolean)
    .join("\n");
  const href = WA.href ? `${WA.href}${WA.href.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}` : "";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = { name: !validName(draft.name), contact: !validContact(draft.contact) };
    setErr(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return phoneRef.current?.focus();
    void submit({ name: draft.name.trim(), contact: `WhatsApp: ${draft.contact.trim()}`, task: V10.wa.task.ru });
  };

  return (
    <div className={s.board}>
      <div className={s.wa}>
        <h3 className={s.waTitle}>{V10.wa.title[lang]}</h3>
        <p className={s.lede}>{V10.wa.text[lang]}</p>
        <p className={s.bubble}>
          <span className={s.bubbleLabel}>{V10.wa.preview[lang]}</span>
          {message}
        </p>
        {href ? (
          <a href={href} className={s.btn} target="_blank" rel="noopener noreferrer" style={{ justifySelf: "start" }}>
            {V10.wa.open[lang]}
          </a>
        ) : null}
      </div>

      <div className={s.form}>
        {href ? null : status === "sent" ? (
          <div className={s.sent} role="status">
            <p>{FORM.sent[lang]}</p>
          </div>
        ) : (
          <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-why`}>
            <p id={`${uid}-why`} className={s.hint}>
              {V10.wa.noNumber[lang]}
            </p>
            <div className={s.field2}>
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
            <div className={s.field2}>
              <label htmlFor={`${uid}-p`} className={s.label}>
                {V10.wa.phone[lang]}
              </label>
              <input
                ref={phoneRef}
                id={`${uid}-p`}
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                placeholder="+996 ___ ___ ___"
                className={s.input}
                value={draft.contact}
                onChange={(e) => {
                  setDraft({ contact: e.target.value });
                  if (err.contact && validContact(e.target.value)) setErr((x) => ({ ...x, contact: false }));
                }}
                aria-invalid={err.contact || undefined}
                aria-describedby={err.contact ? `${uid}-pe` : undefined}
              />
              {err.contact ? (
                <p id={`${uid}-pe`} className={s.err}>
                  {FORM.errContact[lang]}
                </p>
              ) : null}
            </div>
            <div className={s.formFoot}>
              <button type="submit" className={s.btn} disabled={status === "sending"} aria-busy={status === "sending" || undefined}>
                {status === "sending" ? FORM.sending[lang] : V10.wa.submit[lang]}
              </button>
            </div>
            <Status status={status} lang={lang} />
          </form>
        )}

        <div>
          <p className={s.label} style={{ marginBottom: 8 }}>
            {V10.wa.other[lang]}
          </p>
          <ul className={s.channels}>
            {CHANNELS.map((c) => (
              <li key={c.id}>
                <span className={s.channelLabel}>{c.label[lang]}</span>
                {c.href ? (
                  <a href={c.href} className={s.textLink}>
                    <Fill value={c.value} />
                  </a>
                ) : (
                  <Fill value={c.value} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Блок заявки с переключателем вариантов                               */
/* ------------------------------------------------------------------ */

export function ContactSwitch({ lang }: { lang: Lang }) {
  const uid = useId();
  const [variant, setVariant] = useState<Variant>("loom");
  const opts: Variant[] = ["loom", "whatsapp"];
  return (
    <>
      <div className={s.variant} role="radiogroup" aria-labelledby={`${uid}-l`}>
        <span id={`${uid}-l`} className={s.variantLabel}>
          {V10.contact.switchLabel[lang]}
        </span>
        <span className={s.seg}>
          {opts.map((v) => (
            <label key={v} className={s.segOpt}>
              <input type="radio" name={`${uid}-v`} value={v} checked={variant === v} onChange={() => setVariant(v)} />
              {V10.contact.variants[v][lang]}
            </label>
          ))}
        </span>
      </div>
      {variant === "loom" ? (
        <div className={s.board}>
          <Loom lang={lang} />
          <LeadForm lang={lang} />
        </div>
      ) : (
        <WhatsApp lang={lang} />
      )}
    </>
  );
}
