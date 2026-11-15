"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_TEXT, CATEGORIES, PORTFOLIO_HREF, UI, type Lang } from "@/content/kurak";
import { V10 } from "@/content/v10";
import { KURAK_PATHS } from "@/components/brand/KurakLogo";
import { mountChiy } from "./chiy";
import { StyleSwitch } from "./StyleSwitch";
import s from "./Hero.module.css";

/**
 * Первый экран: полотно чия во весь экран. Секция высокая, сцена внутри липкая:
 * пока посетитель листает, восемь пучков по очереди встают по местам, счётчик считает направления.
 * При «уменьшить движение» секция в один экран и полотно сразу собрано. Без JS виден статичный знак из стеблей.
 */
export function ChiyHero({ lang }: { lang: Lang }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState({ joined: 0, current: -1 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const slot = slotRef.current;
    const theme = section?.closest<HTMLElement>(".v10-theme");
    if (!section || !stage || !canvas || !slot || !theme) return;
    return mountChiy({
      canvas,
      stage,
      slot,
      section,
      theme,
      onStep: (joined, current) => setStep({ joined, current }),
      onReady: () => setReady(true),
    });
  }, []);

  const done = step.joined === 8;
  const cur = step.current >= 0 ? CATEGORIES[step.current] : null;

  return (
    <section ref={sectionRef} id="v10-hero" className={s.hero} aria-labelledby="v10-hero-title" data-done={done || undefined}>
      <div ref={stageRef} className={s.stage} data-ready={ready || undefined}>
        <canvas ref={canvasRef} className={s.canvas} role="img" aria-label={V10.hero.canvas[lang]} />

        <div className={s.top}>
          <h1 id="v10-hero-title" className={s.title}>
            {V10.hero.title[lang]}
          </h1>
          <div className={s.aside}>
            <p className={s.lead}>
              {BRAND_TEXT.oneLine[lang]}. {BRAND_TEXT.promise[lang]}
            </p>
            <div className={s.actions}>
              <a href="#contact" className={s.cta}>
                {UI.discuss[lang]}
              </a>
              <a href={PORTFOLIO_HREF} className={s.pdf}>
                {UI.portfolio[lang]}
              </a>
            </div>
          </div>
        </div>

        <div ref={slotRef} className={s.slot}>
          {/* Без JS и до первой отрисовки холста: знак, собранный из стеблей */}
          <svg className={s.fallback} viewBox="-12 -14 467 121" aria-hidden="true" focusable="false">
            <defs>
              <pattern id="v10-stalks" width="5" height="10" patternUnits="userSpaceOnUse">
                <rect x="4.2" width="0.8" height="10" className={s.fbGap} />
              </pattern>
            </defs>
            <rect x="-12" y="-14" width="467" height="121" className={s.fbPanel} />
            {KURAK_PATHS.map((d) => (
              <path key={d} d={d} className={s.fbMark} />
            ))}
            <rect x="-12" y="-14" width="467" height="121" fill="url(#v10-stalks)" />
          </svg>
        </div>

        <div className={s.story}>
          <ol className={s.legend} aria-label={V10.hero.legend[lang]}>
            {CATEGORIES.map((c, i) => (
              <li
                key={c.id}
                className={s.legendItem}
                style={{ "--w": `var(--v10-w${i + 1})` } as React.CSSProperties}
                data-on={i < step.joined || undefined}
                data-current={i === step.current && !done ? true : undefined}
              >
                <span className={s.legendNum}>{c.n}</span>
                <span className={s.legendName}>{c.short[lang]}</span>
              </li>
            ))}
          </ol>

          <div className={s.meta}>
            <p className={s.counter}>
              <span className={s.count} aria-hidden="true">
                <span className={s.countNow}>{step.joined}</span>/8
              </span>
              <span className={s.countLabel}>
                <span className="visually-hidden">{step.joined} / 8 </span>
                {V10.hero.counter[lang]}
              </span>
            </p>
            <p className={s.now} aria-hidden="true">
              {done ? (
                <span className={s.nowDone}>{V10.hero.done[lang]}</span>
              ) : cur ? (
                <>
                  <span className={s.nowNum}>{cur.n}</span>
                  <span className={s.nowGoal}>{cur.goal[lang]}</span>
                </>
              ) : (
                <span className={s.nowHint}>{V10.hero.hint[lang]}</span>
              )}
            </p>
            <StyleSwitch lang={lang} className={s.switch} />
          </div>
        </div>
      </div>
    </section>
  );
}
