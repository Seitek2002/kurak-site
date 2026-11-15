"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_TEXT, PORTFOLIO_HREF, UI, type Lang } from "@/content/kurak";
import { V12, type MapStyle } from "@/content/v12";
import { MOTION, ScrollTrigger } from "@/lib/motion";
import { CITIES } from "./geo";
import { Relief, outlinePaths, projectFlat, type ReliefState } from "./relief";
import s from "./V12.module.css";

const STYLE_KEY = "kurak-v12-style";
const STYLES = V12.hero.styles.map((x) => x.id);
const SQ = 0.72;
const OUTLINE = outlinePaths(SQ);

/**
 * Первый экран: рельеф Кыргызстана во весь экран, огромный заголовок и сюжет на прокрутке.
 * Экран закреплён (sticky), пока трек прокручивается; прогресс трека = время истории вести.
 * Без JS видна SVG-подложка с контуром страны; при «уменьшить движение» холст рисует итог без анимации.
 */
export function Hero({ lang }: { lang: Lang }) {
  const [style, setStyle] = useState<MapStyle>("night");
  const [state, setState] = useState<ReliefState | null>(null);
  const [ready, setReady] = useState(false);
  const [motion, setMotion] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Relief | null>(null);

  // стиль карты помним на этом устройстве
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STYLE_KEY) as MapStyle | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- стиль из localStorage известен только после монтирования
      if (v && STYLES.includes(v)) setStyle(v);
    } catch {
      /* приватный режим: остаётся стиль по умолчанию */
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!canvas || !stage || !track) return;
    const eng = new Relief(canvas, stage, lang, setState, (mobile) => {
      // на десктопе важен только заголовок (справа над картой лишь узкая колонка), на телефоне весь верхний блок
      const el = stage.querySelector<HTMLElement>(mobile ? "[data-hero-aside]" : "h1");
      return el ? el.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top : 0;
    });
    engineRef.current = eng;
    const mq = window.matchMedia(MOTION);
    let trigger: ScrollTrigger | null = null;
    let size = "";

    const arm = () => {
      trigger?.kill();
      trigger = null;
      const on = mq.matches;
      setMotion(on);
      eng.setAnimated(on);
      if (on) {
        trigger = ScrollTrigger.create({
          trigger: track,
          // экран прилипает под шапкой: история начинается, когда трек доходит до неё
          start: () => `top top+=${parseFloat(getComputedStyle(stage).top) || 0}`,
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => eng.setTarget(self.progress),
        });
        eng.setTarget(trigger.progress);
      }
    };

    // тяжёлое (сетка высот, рельеф) после первой отрисовки
    const boot = window.setTimeout(() => {
      size = `${stage.clientWidth}x${stage.clientHeight}`;
      eng.layout();
      arm();
      setReady(true);
    }, 30);

    const io = new IntersectionObserver(([e]) => eng.setVisible(!!e?.isIntersecting), { rootMargin: "80px" });
    io.observe(stage);

    let rt = 0;
    const ro = new ResizeObserver(() => {
      const next = `${stage.clientWidth}x${stage.clientHeight}`;
      if (!size || next === size) return;
      // на телефоне высота прыгает от адресной строки: перерисовываем только при заметной разнице
      const [w0, h0] = size.split("x").map(Number);
      if (w0 === stage.clientWidth && Math.abs((h0 ?? 0) - stage.clientHeight) < 90) return;
      size = next;
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        eng.layout();
        ScrollTrigger.refresh();
      }, 160);
    });
    ro.observe(stage);
    mq.addEventListener("change", arm);

    return () => {
      window.clearTimeout(boot);
      window.clearTimeout(rt);
      io.disconnect();
      ro.disconnect();
      mq.removeEventListener("change", arm);
      trigger?.kill();
      eng.destroy();
      engineRef.current = null;
    };
  }, [lang]);

  // смена стиля: CSS-токены уже поменялись, перерисовываем рельеф
  const painted = useRef<MapStyle | null>(null);
  useEffect(() => {
    if (!ready) return;
    if (painted.current && painted.current !== style) engineRef.current?.paint();
    painted.current = style;
    try {
      window.localStorage.setItem(STYLE_KEY, style);
    } catch {
      /* без хранилища просто не запоминаем */
    }
  }, [style, ready]);

  const stage = state?.stage ?? 0;
  const lines = V12.hero.title[lang];

  return (
    <section className={s.hero} aria-labelledby="v12-h1">
      <div ref={trackRef} className={s.heroTrack}>
        <div ref={stageRef} className={s.heroStage} data-style={style} data-ready={ready || undefined}>
          {/* Без JS: плоский контур страны и города */}
          <svg className={s.heroFallback} viewBox={`-0.2 -0.2 ${OUTLINE.w + 0.4} ${OUTLINE.h + 0.4}`} aria-hidden="true" focusable="false">
            <path d={OUTLINE.border} className={s.fbBorder} />
            <path d={OUTLINE.lake} className={s.fbLake} />
            {CITIES.filter((c) => c.rank < 3).map((c) => {
              const p = projectFlat(c.at[0], c.at[1], SQ);
              return (
                <g key={c.id}>
                  <circle cx={p.x} cy={p.y} r={c.rank === 1 ? 0.055 : 0.035} className={s.fbDot} />
                  {c.rank === 1 && (
                    <text x={p.x + 0.09} y={p.y - 0.06} className={s.fbLabel}>
                      {c.name[lang]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <canvas ref={canvasRef} className={s.heroCanvas} role="img" aria-label={V12.hero.mapLabel[lang]} />

          <div className={s.heroTop}>
            <h1 id="v12-h1" className={s.heroTitle}>
              {lines.map((l) => (
                <span key={l} className={s.heroLine}>
                  {l}
                </span>
              ))}
            </h1>
            <div className={s.heroAside} data-hero-aside>
              <p className={s.heroLede}>
                {BRAND_TEXT.oneLine[lang]}. {BRAND_TEXT.promise[lang]}
              </p>
              <div className={s.heroActions}>
                <a href="#contact" className={`${s.btn} ${s.btnHero}`}>
                  {UI.discuss[lang]}
                </a>
                <a href={PORTFOLIO_HREF} className={s.heroLink}>
                  {UI.portfolio[lang]}
                </a>
              </div>
            </div>
          </div>

          <div className={s.heroBottom}>
            <ol className={s.stages} aria-hidden="true">
              {V12.hero.stages.map((x, i) => (
                <li key={i} className={s.stageLine} data-on={i === stage || undefined}>
                  {x[lang]}
                </li>
              ))}
            </ol>

            <div className={s.heroMeta}>
              {state && (
                <div className={s.counter} aria-hidden="true">
                  <p className={s.count}>
                    <span className={s.countLabel}>{V12.hero.heardLabel[lang]}</span>
                    <span className={s.countRow}>
                      <span className={s.countNum}>{state.heard}</span>
                      <span className={s.countOf}>{V12.hero.of(state.total, lang)}</span>
                      <span className={s.countTotal}>/ {state.total}</span>
                    </span>
                  </p>
                  <p className={s.count} data-dim={stage < 3 || undefined}>
                    <span className={s.countLabel}>{V12.hero.repliedLabel[lang]}</span>
                    <span className={s.countRow}>
                      <span className={s.countNum}>{state.replied}</span>
                    </span>
                  </p>
                </div>
              )}
              <p className={s.heroNote}>{V12.hero.note[lang]}</p>
              <div className={s.styleSwitch} role="group" aria-label={V12.hero.styleLabel[lang]}>
                <span className={s.styleLabel} aria-hidden="true">
                  {V12.hero.styleLabel[lang]}
                </span>
                {V12.hero.styles.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    className={s.styleBtn}
                    aria-pressed={style === x.id}
                    data-style-btn={x.id}
                    title={x.hint[lang]}
                    onClick={() => setStyle(x.id)}
                  >
                    <span className={s.styleSwatch} data-swatch={x.id} aria-hidden="true" />
                    <span className={s.styleName}>{x.name[lang]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {motion && ready && stage === 0 && (
            <p className={s.scrollHint} aria-hidden="true">
              {V12.hero.scrollHint[lang]}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
