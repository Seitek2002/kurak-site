"use client";

import { useRef } from "react";
import { REVIEWS } from "@/content/site";
import { clientLogo, reviewPhoto, SLOT_TEXT } from "@/content/photos";
import { Fill } from "./Fill";
import { PhotoSlot } from "./brand/PhotoSlot";
import s from "./Reviews.module.css";

/** Отзывы лентой. Листаются руками, кнопками и стрелками; сами не крутятся. */
export function Reviews() {
  const rail = useRef<HTMLUListElement>(null);
  const hasDrafts = REVIEWS.some((r) => r.who.draft);

  const go = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 32 : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className={`section ${s.section}`} aria-labelledby="otzyvy-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="otzyvy-title" className="h-section">
            Что говорят клиенты
          </h2>
          <div className={s.controls}>
            <button type="button" className={s.arrow} onClick={() => go(-1)} aria-label="Предыдущий отзыв">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className={s.arrow} onClick={() => go(1)} aria-label="Следующий отзыв">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      <ul ref={rail} className={s.rail} tabIndex={0} aria-label="Отзывы клиентов">
        {REVIEWS.map((r, i) => (
          <li key={i} className={s.card}>
            <blockquote className={s.quote}>
              <p>{r.text}</p>
            </blockquote>
            <div className={s.author}>
              <span className={s.avatar}>
                <PhotoSlot kind="person" hideLabel src={reviewPhoto(i)} label={SLOT_TEXT.author.ru} className={s.avatarSlot} />
              </span>
              <p className={s.who}>
                <Fill value={r.who} note="имя клиента" />
                <span className={s.role}>{r.role}</span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="container">
        {hasDrafts && (
          <p className={s.note}>Тексты отзывов пока образцы. Опубликуем только настоящие, с разрешения клиентов.</p>
        )}
        <div className={s.clients}>
          <h3 className={s.clientsTitle}>Клиенты, которые разрешили показать логотип</h3>
          <ul className={s.logos} aria-label="Логотипы клиентов">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={s.logo}>
                <PhotoSlot kind="logo" src={clientLogo(i)} label={SLOT_TEXT.client.ru} className={s.logoSlot} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
