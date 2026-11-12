"use client";

import { gsap, ScrollTrigger, MOTION, DESKTOP_MOTION, scrollToY } from "./motion";

/**
 * Сцены варианта 2. Разметка секций рендерится на сервере, сцена получает готовый элемент
 * и навешивает анимации. Всё, что создано внутри mm.add, откатывается само.
 * Возвращаемая функция снимает слушатели, которые живут вне медиа-запросов.
 */
type Scene = (el: HTMLElement, mm: gsap.MatchMedia) => void | (() => void);

const hero: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    const st = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 };
    // двигаем маску, а не саму букву: у буквы своя CSS-анимация входа
    el.querySelectorAll<HTMLElement>(".v2-letter-mask").forEach((l, i) => {
      gsap.to(l, { yPercent: (i % 2 ? -1 : 1) * 18, xPercent: (i - 2) * 14, rotation: (i - 2) * 4, ease: "none", scrollTrigger: st });
    });
    el.querySelectorAll<HTMLElement>("[data-speed]").forEach((p) => {
      const k = Number(p.dataset.speed);
      gsap.to(p, { y: -k * 260, rotation: `+=${k * 70}`, ease: "none", scrollTrigger: { ...st, scrub: true } });
    });
    gsap.to(el.querySelector("[data-hero-copy]"), { yPercent: -30, ease: "none", scrollTrigger: { ...st, scrub: true } });
  });
};

const FROM: [number, number, number][] = [
  [-260, -180, -70], [0, -320, 40], [280, -200, 80], [360, 20, -50],
  [260, 260, 60], [0, 340, -40], [-280, 240, 70], [-380, 0, -80],
];

const assembly: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    el.dataset.live = "true";
    const goals = Array.from(el.querySelectorAll<HTMLElement>("[data-goal-i]"));
    const cells = goals.map((g) => el.querySelector<HTMLElement>(`[data-cell="${g.dataset.cat}"]`)!);
    let active = -2;
    const mark = (n: number) => {
      if (n === active) return;
      active = n;
      goals.forEach((g, i) => {
        g.toggleAttribute("data-on", i <= n);
        g.toggleAttribute("data-current", i === n);
      });
    };
    mark(-1);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1 },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: () => `+=${window.innerHeight * 3.2}`,
        pin: el.querySelector<HTMLElement>("[data-stage]"),
        scrub: 0.7,
        invalidateOnRefresh: true,
        onUpdate: (self) => mark(Math.min(7, Math.floor(self.progress * 9.5) - 1)),
      },
    });
    tl.from(el.querySelector("[data-cell='you']"), { scale: 0, rotation: -90, duration: 0.8 }, 0);
    cells.forEach((c, i) => {
      const [x, y, r] = FROM[i]!;
      tl.from(c, { xPercent: x, yPercent: y, rotation: r, scale: 0.5, opacity: 0 }, 0.6 + i * 0.9);
    });
    tl.fromTo(el.querySelector("[data-thread]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", duration: 2 }, ">-0.2");
    tl.from(el.querySelector("[data-finale]"), { yPercent: 60, opacity: 0, duration: 0.8 }, "<0.8");
    tl.to(el.querySelector("[data-quilt]"), { rotation: -4, scale: 0.94, duration: 1.2, ease: "power2.inOut" }, "<");
    return () => {
      delete el.dataset.live;
      goals.forEach((g) => {
        g.removeAttribute("data-on");
        g.removeAttribute("data-current");
      });
    };
  });
};

const rail: Scene = (el, mm) => {
  const track = el.querySelector<HTMLElement>("[data-track]")!;
  let tween: gsap.core.Tween | null = null;

  const yForPanel = (panel: HTMLElement) => {
    const st = tween?.scrollTrigger;
    if (!st) return null;
    const dist = track.scrollWidth - window.innerWidth;
    const x = Math.min(dist, Math.max(0, panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2));
    return st.start + (x / dist) * (st.end - st.start);
  };

  mm.add(DESKTOP_MOTION, () => {
    el.dataset.live = "true";
    const dist = () => track.scrollWidth - window.innerWidth;
    tween = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
    });
    const containerAnimation = tween;
    track.querySelectorAll<HTMLElement>("[data-art]").forEach((art) => {
      gsap.fromTo(art, { rotation: -50, scale: 0.55 }, { rotation: 12, scale: 1, ease: "none", scrollTrigger: { trigger: art, containerAnimation, start: "left right", end: "right left", scrub: true } });
    });
    track.querySelectorAll<HTMLElement>("[data-goal]").forEach((g) => {
      gsap.from(g, { xPercent: 30, ease: "none", scrollTrigger: { trigger: g, containerAnimation, start: "left right", end: "left 40%", scrub: true } });
    });
    gsap.fromTo(el.querySelector("[data-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist()}`, scrub: true } });
    return () => {
      delete el.dataset.live;
      tween = null;
    };
  });

  // Клавиатура внутри ленты: докручиваем окно, чтобы панель с фокусом была на экране
  const onFocus = (e: FocusEvent) => {
    const panel = (e.target as HTMLElement).closest<HTMLElement>("[data-panel]");
    const y = panel ? yForPanel(panel) : null;
    if (y !== null) scrollToY(y, true);
  };
  // Переход по лоскуту из сборки или из подборки: #cat-smm
  const onHash = () => {
    const m = window.location.hash.match(/^#cat-(\w+)$/);
    const panel = m ? document.getElementById(`cat-${m[1]}`) : null;
    const y = panel ? yForPanel(panel) : null;
    if (y !== null) scrollToY(y);
  };
  track.addEventListener("focusin", onFocus);
  window.addEventListener("hashchange", onHash);
  return () => {
    track.removeEventListener("focusin", onFocus);
    window.removeEventListener("hashchange", onHash);
  };
};

const manifesto: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    el.dataset.live = "true";
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    let lit = -1;
    ScrollTrigger.create({
      trigger: el.querySelector("[data-say]"),
      start: "top 80%",
      end: "bottom 40%",
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        if (n === lit) return;
        lit = n;
        words.forEach((w, i) => w.toggleAttribute("data-lit", i < n));
      },
    });
    el.querySelectorAll<HTMLElement>("[data-badge]").forEach((b) => {
      gsap.from(b, { scale: 0, rotation: -120, ease: "back.out(2)", duration: 0.8, scrollTrigger: { trigger: b, start: "top 75%", toggleActions: "play none none reverse" } });
    });
    gsap.from(el.querySelectorAll("[data-note]"), {
      y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector("[data-notes]"), start: "top 85%" },
    });
    return () => {
      delete el.dataset.live;
      words.forEach((w) => w.removeAttribute("data-lit"));
    };
  });
};

const cases: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-case]"));
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (next) {
        const st = { trigger: next, start: "top bottom", end: "top 20%", scrub: true };
        gsap.to(card, { scale: 0.9 + i * 0.015, rotation: i % 2 ? 1.5 : -1.5, ease: "none", scrollTrigger: st });
        gsap.to(card.querySelector("[data-shade]"), { opacity: 0.55, ease: "none", scrollTrigger: st });
      }
      gsap.from(card.querySelector("[data-result]"), { yPercent: 100, ease: "power3.out", duration: 1, scrollTrigger: { trigger: card, start: "top 70%" } });
    });
    gsap.from(el.querySelectorAll("[data-stat]"), {
      y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector("[data-stats]"), start: "top 85%" },
    });
  });
};

const team: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    const cards = el.querySelectorAll<HTMLElement>("[data-person]");
    gsap.fromTo(
      cards,
      { clipPath: "inset(100% 0% 0% 0%)", y: 80 },
      { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.1, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: el.querySelector("[data-grid]"), start: "top 80%" } },
    );
    cards.forEach((c, i) => {
      gsap.to(c, { yPercent: i % 2 ? -10 : 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });
};

const finale: Scene = (el, mm) => {
  mm.add(MOTION, () => {
    const st = { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 };
    gsap.fromTo(el.querySelector("[data-ring]"), { rotation: -120, scale: 0.88 }, { rotation: 120, scale: 1.08, ease: "none", scrollTrigger: st });
    el.querySelectorAll<SVGElement>("[data-ring] > span > svg").forEach((p, i) => {
      gsap.fromTo(p, { rotation: 0 }, { rotation: (i % 2 ? -1 : 1) * 360, ease: "none", scrollTrigger: st });
    });
    gsap.from(el.querySelectorAll("[data-line] > span"), { yPercent: 110, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 60%" } });
  });
};

export const SCENES = { hero, assembly, rail, manifesto, cases, team, finale };
export type SceneName = keyof typeof SCENES;
