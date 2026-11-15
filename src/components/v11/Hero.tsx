"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_TEXT, PORTFOLIO_HREF, UI, type Lang } from "@/content/kurak";
import { V11 } from "@/content/v11";
import { MOTION, ScrollTrigger } from "@/lib/motion";
import { BoardRenderer, stepAt, type BoardLayout } from "./board";
import { HOLES } from "./data";
import { BoardFallback } from "./BoardFallback";
import { useV11 } from "./store";
import s from "./Hero.module.css";

/** Открыть лунку в меню услуг (секция «Девять лунок» слушает это событие) */
export const openHole = (id: string) => window.dispatchEvent(new CustomEvent("v11:hole", { detail: id }));

/**
 * Первый экран: доска тогуз коргоол во весь экран, сверху огромный заголовок.
 * На прокрутке идёт настоящая партия: расклад по девяти лункам, сбор в казан, туз, победа 82 из 162.
 * Счётчик казана и номер хода обновляются напрямую в DOM, без перерисовки React на каждом кадре.
 */
export function Hero({ lang }: { lang: Lang }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const moveRef = useRef<HTMLSpanElement>(null);
  const holeRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const rendererRef = useRef<BoardRenderer | null>(null);
  const kickRef = useRef<() => void>(() => {});
  const [layout, setLayout] = useState<BoardLayout | null>(null);
  const [hover, setHover] = useState(-1);
  const board = useV11((st) => st.board);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const slot = slotRef.current;
    if (!track || !stage || !canvas || !slot) return;
    const r = new BoardRenderer(canvas);
    rendererRef.current = r;
    r.setPalette(canvas);
    const motion = window.matchMedia(MOTION).matches;
    let target = motion ? 0 : 1;
    let cur = target;
    let raf = 0;
    let visible = true;
    let lastStep = "";
    let lastNum = -1;
    let lastMove = -1;
    let lastTuz = false;
    const lit: boolean[] = HOLES.map(() => false);
    const tuzAt = r.timeline.tuz?.t ?? Infinity;

    const sync = (t: number) => {
      const step = stepAt(t);
      if (step !== lastStep) {
        stage.dataset.step = step;
        lastStep = step;
      }
      const sc = r.score(t);
      if (sc.ours !== lastNum && numRef.current) {
        numRef.current.textContent = String(sc.ours);
        lastNum = sc.ours;
      }
      if (sc.move !== lastMove && moveRef.current) {
        moveRef.current.textContent = String(sc.move);
        lastMove = sc.move;
      }
      const tz = t >= tuzAt;
      if (tz !== lastTuz) {
        stage.dataset.tuz = tz ? "on" : "off";
        lastTuz = tz;
      }
      HOLES.forEach((_, i) => {
        const on = t >= r.litAt(i);
        if (on !== lit[i]) {
          lit[i] = on;
          holeRefs.current[i]?.toggleAttribute("data-lit", on);
        }
      });
    };

    const draw = () => {
      r.render(cur);
      sync(cur);
    };
    const loop = () => {
      raf = 0;
      const d = target - cur;
      cur = Math.abs(d) < 0.0004 ? target : cur + d * 0.2;
      draw();
      if (cur !== target && visible) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    kickRef.current = kick;

    const measure = () => {
      const st = stage.getBoundingClientRect();
      const sl = slot.getBoundingClientRect();
      if (!st.width || !sl.width || !sl.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const L = r.resize(st.width, st.height, dpr, { x: sl.left - st.left, y: sl.top - st.top, w: sl.width, h: sl.height });
      setLayout(L);
      draw();
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(slot);
    measure();

    let trigger: ScrollTrigger | null = null;
    if (motion) {
      trigger = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          target = self.progress;
          kick();
        },
        onRefresh: (self) => {
          target = self.progress;
          kick();
        },
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) kick();
    });
    io.observe(track);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      trigger?.kill();
      rendererRef.current = null;
      kickRef.current = () => {};
    };
  }, []);

  // смена стиля доски: перечитать токены и перерисовать
  useEffect(() => {
    const r = rendererRef.current;
    const c = canvasRef.current;
    if (!r || !c) return;
    r.setPalette(c);
    kickRef.current();
  }, [board]);

  // наведение на лунку подсвечивает её на холсте
  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    r.hover = hover;
    kickRef.current();
  }, [hover]);

  const L = layout;
  const tip = L && hover >= 0 ? L.holes[hover] : null;
  const hoverHole = hover >= 0 ? HOLES[hover] : null;

  return (
    <section className={`${s.hero} v11-surface`} aria-labelledby="v11-hero-title">
      <div className={s.track} ref={trackRef}>
        <div className={s.stage} ref={stageRef} data-step="intro" data-tuz="off" data-vertical={L?.vertical ? "" : undefined}>
          <canvas ref={canvasRef} className={s.canvas} role="img" aria-label={V11.hero.canvasLabel[lang]} />
          <div className={s.slot} ref={slotRef}>
            <BoardFallback className={s.fallback} />
          </div>

          <div className={s.top}>
            <div className={s.intro}>
              <h1 id="v11-hero-title" className={s.title}>
                {V11.hero.title[lang]}
              </h1>
              <div className={s.introRow}>
                <p className={s.lead}>
                  {BRAND_TEXT.oneLine[lang]}. {BRAND_TEXT.promise[lang]}
                </p>
                <div className={s.cta}>
                  <a className="v11-btn" href="#contact">
                    {UI.discuss[lang]}
                  </a>
                  <a className={`v11-link ${s.pdf}`} href={PORTFOLIO_HREF}>
                    {UI.portfolio[lang]}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <ol className={s.steps}>
            {V11.story.map((st, i) => (
              <li key={st.id} className={s.step} data-step-id={st.id}>
                <p className={s.stepTitle}>
                  <span className={s.stepNo} aria-hidden="true">
                    {i + 1}
                  </span>
                  {st.title[lang]}
                </p>
                <p className={s.stepText}>{st.text[lang]}</p>
                {st.id === "win" ? (
                  <a className={`v11-btn ${s.stepCta}`} href="#contact">
                    {UI.discuss[lang]}
                  </a>
                ) : null}
              </li>
            ))}
          </ol>

          <div className={s.meter} aria-hidden="true">
            <span ref={numRef} className={`${s.num} num`}>
              0
            </span>
            <span className={s.meterLabel}>{V11.hero.kazan[lang]}</span>
            <span className={s.meterSub}>
              {V11.hero.toWin[lang]}
              <span className={s.moveLine}>
                {V11.hero.move[lang]} <span ref={moveRef} className="num">0</span>
              </span>
            </span>
          </div>

          {L ? (
            <div className={s.overlay}>
              {HOLES.map((hole, i) => {
                const p = L.holes[i]!;
                const u = L.under[i]!;
                const w = Math.max(44, p.rx * 2);
                const h = Math.max(44, p.ry * 2);
                return (
                  <a
                    key={hole.id}
                    ref={(el) => {
                      holeRefs.current[i] = el;
                    }}
                    href={`#hole-${hole.id}`}
                    className={s.hole}
                    style={{ left: p.x - w / 2, top: p.y - h / 2, width: w, height: h }}
                    aria-label={`${V11.hero.openHole[lang]}: ${hole.short[lang]}. ${hole.goal[lang]}`}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover((x) => (x === i ? -1 : x))}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover((x) => (x === i ? -1 : x))}
                    onClick={() => openHole(hole.id)}
                  >
                    <span
                      className={s.holeName}
                      style={L.vertical ? { left: w / 2 + p.rx + 6, top: h / 2 } : { left: u.x - p.x + w / 2, top: u.y - p.y + h / 2 + 10 }}
                      aria-hidden="true"
                    >
                      {hole.short[lang]}
                    </span>
                  </a>
                );
              })}
              {L.tuzTag ? (
                <span className={s.tuzTag} style={{ left: L.tuzTag.x, top: L.tuzTag.y }} aria-hidden="true">
                  {V11.hero.tuz[lang]}
                </span>
              ) : null}
              {L.tagW >= 60 ? (
                <>
                  <span className={s.kazanTag} style={{ left: L.kazan.x, top: L.kazan.y, maxWidth: L.tagW }} aria-hidden="true">
                    {V11.hero.yourKazan[lang]}
                  </span>
                  <span className={s.kazanTag} style={{ left: L.rivalKazan.x, top: L.rivalKazan.y, maxWidth: L.tagW }} aria-hidden="true">
                    {V11.hero.rivalKazan[lang]}
                  </span>
                </>
              ) : null}
              <span className={s.sideTag} style={{ left: L.farEdge.x, top: L.farEdge.y }} aria-hidden="true">
                {V11.hero.rival[lang]}
              </span>
              {tip && hoverHole ? (
                <span className={s.tip} style={{ left: tip.x, top: tip.y - tip.ry - 10 }} aria-hidden="true">
                  <b>{hoverHole.short[lang]}</b>
                  {hoverHole.goal[lang]}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className={s.hint} aria-hidden="true">
            {V11.hero.scroll[lang]}
          </p>
        </div>
      </div>
    </section>
  );
}
