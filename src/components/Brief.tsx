"use client";

import { useId, useRef, useState } from "react";
import { SERVICE_INDEX } from "@/content/services";
import { STEPS } from "@/content/site";
import { useSelection } from "@/store/selection";
import { trackLead } from "@/lib/track";
import { MiniQuilt } from "./MiniQuilt";
import s from "./Brief.module.css";

const TIMING = ["Срочно", "В этом месяце", "В ближайшие три месяца", "Пока изучаю"];
const BUDGET = ["До 100 тыс. сом", "От 100 до 500 тыс. сом", "Больше 500 тыс. сом", "Обсудим на созвоне"];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "offline"; text: string }
  | { kind: "error"; text: string };

function patchWord(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "лоскут";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "лоскута";
  return "лоскутов";
}

export function Brief() {
  const picked = useSelection((st) => st.picked);
  const remove = useSelection((st) => st.remove);
  const draft = useSelection((st) => st.draft);
  const setDraft = useSelection((st) => st.setDraft);
  const resetDraft = useSelection((st) => st.resetDraft);
  const clear = useSelection((st) => st.clear);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<{ name?: string; contact?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const cells = Math.max(8, Math.ceil(picked.length / 4) * 4);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (draft.name.trim().length < 2) next.name = "Напишите, как к вам обращаться.";
    const c = draft.contact.trim();
    const looksPhone = c.replace(/[^\d]/g, "").length >= 9;
    const looksTg = /^@?[a-zA-Z0-9_]{5,32}$/.test(c);
    if (!looksPhone && !looksTg) next.contact = "Нужен телефон с кодом, например +996 555 123 456, или ник в Telegram.";
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.contact) return contactRef.current?.focus();

    const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
    if (!endpoint) {
      // Демо без сервера (GitHub Pages): ничего не отправляем и прямо об этом говорим
      setStatus({ kind: "offline", text: "Это демо-версия сайта: форма не подключена, заявка не отправлена." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(endpoint.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${endpoint}` : endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          services: picked.map((id) => SERVICE_INDEX[id]?.service.title).filter(Boolean),
          page: window.location.pathname,
        }),
      });
      if (res.ok) {
        setStatus({ kind: "sent" });
        trackLead();
        resetDraft();
        clear();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.status === 503) {
        setStatus({ kind: "offline", text: body.message ?? "Форма пока не подключена, заявка не отправлена." });
      } else {
        setStatus({ kind: "error", text: body.message ?? "Заявка не ушла. Попробуйте ещё раз через минуту." });
      }
    } catch {
      setStatus({ kind: "error", text: "Нет связи с сервером. Проверьте интернет и отправьте ещё раз." });
    }
  }

  return (
    <section id="zayavka" className={`${s.section} on-field`} aria-labelledby="zayavka-title">
      <div className={`container ${s.grid}`}>
        <div className={s.side}>
          <h2 id="zayavka-title" className={`h-section ${s.title}`}>
            Расскажите о&nbsp;задаче
          </h2>
          <div className={s.quiltBox}>
            <MiniQuilt picked={picked} cells={cells} size="l" />
            <p className={s.quiltCap} aria-live="polite">
              {picked.length
                ? `Ваш курак: ${picked.length} ${patchWord(picked.length)}. Он уйдёт вместе с заявкой.`
                : "Ваш курак пока пустой. Отметьте услуги в меню, или просто опишите задачу."}
            </p>
          </div>
        </div>

        <div className={s.formCol}>
          {status.kind === "sent" ? (
            <div className={s.done} role="status">
              <p className={s.doneTitle}>Заявка у нас.</p>
              <p>Дальше всё по шагам ниже. Если срочно, позвоните.</p>
            </div>
          ) : (
            <form className={s.form} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-status`}>
              {picked.length > 0 && (
                <fieldset className={s.picked}>
                  <legend className={s.label}>Из вашей подборки</legend>
                  <ul className={s.tags}>
                    {picked.map((id) => {
                      const e = SERVICE_INDEX[id];
                      if (!e) return null;
                      return (
                        <li key={id} className={s.tag} data-cat={e.category.id}>
                          <span className={s.tagDot} aria-hidden="true" />
                          {e.service.title}
                          <button type="button" className={s.tagX} onClick={() => remove(id)} aria-label={`Убрать: ${e.service.title}`}>
                            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              )}

              <div className={s.row2}>
                <div className={s.field}>
                  <label htmlFor={`${uid}-name`} className={s.label}>Как вас зовут</label>
                  <input
                    ref={nameRef}
                    id={`${uid}-name`}
                    name="name"
                    autoComplete="name"
                    className={s.input}
                    value={draft.name}
                    onChange={(e) => setDraft({ name: e.target.value })}
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    required
                  />
                  <p id={`${uid}-name-err`} className={s.err}>{errors.name}</p>
                </div>
                <div className={s.field}>
                  <label htmlFor={`${uid}-contact`} className={s.label}>Телефон или Telegram</label>
                  <input
                    ref={contactRef}
                    id={`${uid}-contact`}
                    name="contact"
                    autoComplete="tel"
                    inputMode="text"
                    className={s.input}
                    value={draft.contact}
                    onChange={(e) => setDraft({ contact: e.target.value })}
                    aria-invalid={!!errors.contact || undefined}
                    aria-describedby={errors.contact ? `${uid}-contact-err` : undefined}
                    required
                  />
                  <p id={`${uid}-contact-err`} className={s.err}>{errors.contact}</p>
                </div>
              </div>

              <div className={s.field}>
                <label htmlFor={`${uid}-task`} className={s.label}>Задача своими словами</label>
                <textarea
                  id={`${uid}-task`}
                  name="task"
                  rows={3}
                  className={`${s.input} ${s.area}`}
                  placeholder="Например: открываем вторую кофейню и хотим, чтобы о ней узнал район"
                  value={draft.task}
                  onChange={(e) => setDraft({ task: e.target.value })}
                />
              </div>

              <fieldset className={s.choice}>
                <legend className={s.label}>Когда нужно начать</legend>
                <div className={s.seg}>
                  {TIMING.map((t, i) => (
                    <span key={t}>
                      <input
                        type="radio"
                        name="timing"
                        id={`${uid}-t${i}`}
                        value={t}
                        checked={draft.timing === t}
                        onChange={() => setDraft({ timing: t })}
                      />
                      <label htmlFor={`${uid}-t${i}`}>{t}</label>
                    </span>
                  ))}
                </div>
              </fieldset>

              <fieldset className={s.choice}>
                <legend className={s.label}>Бюджет в месяц</legend>
                <div className={s.seg}>
                  {BUDGET.map((t, i) => (
                    <span key={t}>
                      <input
                        type="radio"
                        name="budget"
                        id={`${uid}-b${i}`}
                        value={t}
                        checked={draft.budget === t}
                        onChange={() => setDraft({ budget: t })}
                      />
                      <label htmlFor={`${uid}-b${i}`}>{t}</label>
                    </span>
                  ))}
                </div>
              </fieldset>

              <div className={s.submitRow}>
                <button type="submit" className="btn" aria-busy={status.kind === "sending" || undefined} disabled={status.kind === "sending"}>
                  {status.kind === "sending" ? "Отправляем" : "Обсудить задачу"}
                </button>
                <p className={s.fine}>Контакты нужны только для ответа на заявку. Черновик хранится на этом устройстве.</p>
              </div>
              <p id={`${uid}-status`} className={s.status} role="status">
                {status.kind === "offline" || status.kind === "error" ? status.text : ""}
              </p>
            </form>
          )}

          <ol className={s.steps}>
            {STEPS.map((st, i) => (
              <li key={st.title} className={s.step}>
                <span className={s.stepN} aria-hidden="true">{i + 1}</span>
                <span>
                  <strong>{st.title}</strong> {st.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
