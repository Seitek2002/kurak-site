"use client";

import { useRef, useState } from "react";
import { CATEGORIES } from "@/content/services";
import { gsap, ScrollTrigger, useMotion, MOTION } from "@/lib/motion";
import { Patch } from "../Patch";
import s from "./Marquee.module.css";

/**
 * Две бегущие строки навстречу друг другу. Скорость и направление следуют за скроллом.
 * Останавливаются при наведении, фокусе, кнопкой «Пауза» и когда ушли с экрана.
 */
export function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const hover = useRef(false);

  useMotion(ref, (mm, el) => {
    mm.add(MOTION, () => {
      el.dataset.live = "true";
      const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));
      const tweens = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38 + i * 6, ease: "none", repeat: -1, paused: true }),
      );
      // запас «прошлого», чтобы строка могла ехать назад при скролле вверх
      tweens.forEach((t) => t.totalTime(t.duration() * 200));
      let dir = 1;
      let visible = false;
      const apply = (boost = 1) => {
        const run = visible && !pausedRef.current && !hover.current;
        tweens.forEach((t) => {
          if (!run) return t.pause();
          t.play();
          gsap.to(t, { timeScale: dir * boost, duration: 0.6, overwrite: true });
        });
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          apply();
        },
        onUpdate: (self) => {
          dir = self.direction;
          apply(Math.min(5, 1 + Math.abs(self.getVelocity()) / 600));
          gsap.to(el.querySelectorAll("[data-skew]"), { skewX: gsap.utils.clamp(-8, 8, self.getVelocity() / -120), duration: 0.4, overwrite: true });
        },
      });
      (el as unknown as { __apply?: () => void }).__apply = apply;
      return () => {
        st.kill();
        delete el.dataset.live;
      };
    });
  });

  const sync = () => (ref.current as unknown as { __apply?: () => void } | null)?.__apply?.();

  const goals = CATEGORIES.map((c) => (
    <span key={c.id} className={s.item} data-cat={c.id}>
      {c.goal}
      <span className={s.sep}>
        <Patch cat={c.id} plain />
      </span>
    </span>
  ));
  const shorts = CATEGORIES.map((c) => (
    <span key={c.id} className={`${s.item} ${s.small}`} data-cat={c.id}>
      {c.short}
      <span className={`${s.sep} ${s.sepSmall}`}>
        <Patch cat={c.id} plain />
      </span>
    </span>
  ));

  return (
    <section
      ref={ref}
      className={s.section}
      aria-label="Восемь направлений Курака"
      onPointerEnter={() => {
        hover.current = true;
        sync();
      }}
      onPointerLeave={() => {
        hover.current = false;
        sync();
      }}
      onFocus={() => {
        hover.current = true;
        sync();
      }}
      onBlur={() => {
        hover.current = false;
        sync();
      }}
    >
      <ul className="visually-hidden">
        {CATEGORIES.map((c) => (
          <li key={c.id}>{c.goal}: {c.short}</li>
        ))}
      </ul>
      <div className={s.rows} aria-hidden="true">
        <div className={s.row} data-row>
          <div className={s.run} data-skew>{goals}</div>
          <div className={s.run} data-skew>{goals}</div>
        </div>
        <div className={`${s.row} ${s.rowAlt}`} data-row>
          <div className={s.run} data-skew>{shorts}</div>
          <div className={s.run} data-skew>{shorts}</div>
        </div>
      </div>
      <button
        type="button"
        className={s.pause}
        aria-pressed={paused}
        onClick={() => {
          pausedRef.current = !pausedRef.current;
          setPaused(pausedRef.current);
          sync();
        }}
      >
        {paused ? "Запустить строку" : "Пауза"}
      </button>
    </section>
  );
}
