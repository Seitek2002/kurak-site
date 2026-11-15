/**
 * Холст «Чий»: сотни вертикальных стеблей. Каждый стебель заранее «обмотан» своим столбцом узора
 * (как в настоящем чырмалган чие, цвет меняется только вдоль стебля), поэтому узор KURAK виден,
 * только когда стебли стоят по местам и по порядку.
 *
 * Сюжет: восемь пучков, по одному на направление агентства, перевязаны нитью своего цвета.
 * Прокрутка развязывает пучки по очереди: стебли расходятся по местам, обматываются шерстью,
 * и проявляется часть узора этого направления.
 *
 * Производительность: узор и стебли пекутся один раз в офскрин-холсты (при смене размера или стиля),
 * кадр = два drawImage на стебель. Цикл крутится только пока секция на экране, без движения не рисует.
 * Все цвета читаются из CSS-токенов варианта (--v10-*), в коде цветов нет.
 */
import { KURAK_PATHS } from "@/components/brand/KurakLogo";
import type { ChiyStyle } from "@/content/v10";

type Palette = {
  panel: string;
  line: string;
  red: string;
  reed: string;
  shade: string;
  sheen: string;
  paper: string;
  wool: string[];
};

type Geometry = {
  W: number;
  H: number;
  dpr: number;
  pitch: number;
  cols: number;
  per: number;
  x0: number;
  pivotY: number;
  PH: number;
  L: number;
  colW: number;
  rows: number;
  bareRows: number;
  teeth: number;
  maxAng: number;
};

const C_BG = 0;
const C_LINE = 1;
const C_RED = 2;
const GROUPS = 8;

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return {
    panel: v("--v10-chiy-panel"),
    line: v("--v10-chiy-line"),
    red: v("--v10-chiy-red"),
    reed: v("--v10-chiy-reed"),
    shade: v("--v10-chiy-shade"),
    sheen: v("--v10-chiy-sheen"),
    paper: v("--v10-chiy-paper"),
    wool: Array.from({ length: GROUPS }, (_, i) => v(`--v10-w${i + 1}`)),
  };
}

const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Детерминированный шум: у каждого стебля свой характер, одинаковый при каждой перерисовке */
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/* ------------------------------------------------------------------ */
/* Геометрия: место полотна задаёт вёрстка (элемент-слот), холст его только читает */
/* ------------------------------------------------------------------ */

function measure(W: number, H: number, slot: { x: number; y: number; w: number; h: number }, dpr: number): Geometry | null {
  if (slot.w < 40 || slot.h < 40) return null;
  const pitch = W < 600 ? 4 : W < 1100 ? 6 : 7;
  const cols = Math.floor(slot.w / pitch / GROUPS) * GROUPS;
  if (cols < GROUPS * 2) return null;
  const per = cols / GROUPS;
  const panelW = cols * pitch;
  const PH = slot.h;
  return {
    W,
    H,
    dpr,
    pitch,
    cols,
    per,
    x0: slot.x + (slot.w - panelW) / 2,
    pivotY: slot.y + PH / 2,
    PH,
    L: PH * 1.5,
    colW: Math.ceil(pitch * dpr),
    rows: Math.ceil(PH * dpr),
    bareRows: Math.ceil(PH * 1.5 * dpr),
    teeth: per >= 16 ? 2 : 1,
    maxAng: W < 600 ? 0.075 : 0.2,
  };
}

/* ------------------------------------------------------------------ */
/* Узор: рамка, зубцы направлений сверху и снизу, знак KURAK в поле     */
/* ------------------------------------------------------------------ */

function buildPattern(g: Geometry): Uint8Array {
  const { cols, rows, per, teeth } = g;
  const map = new Uint8Array(cols * rows);

  // Маска знака: рисуем пять фигур логотипа с запасом по ширине и берём центр каждого столбца
  const SUB = 4;
  const mc = makeCanvas(cols * SUB, rows);
  const m = mc.getContext("2d", { willReadFrequently: true });
  let alpha: Uint8ClampedArray | null = null;
  if (m) {
    const panelPx = cols * g.pitch * g.dpr;
    const fieldTop = rows * 0.215;
    const fieldH = rows * 0.57;
    const s = Math.min((panelPx * 0.9) / 443, (fieldH * 0.9) / 93);
    const ox = (panelPx - 443 * s) / 2;
    const oy = fieldTop + (fieldH - 93 * s) / 2;
    const kx = SUB / (g.pitch * g.dpr);
    m.setTransform(s * kx, 0, 0, s, ox * kx, oy);
    for (const d of KURAK_PATHS) m.fill(new Path2D(d));
    alpha = m.getImageData(0, 0, mc.width, rows).data;
  }

  const toothCols = per / teeth;
  for (let i = 0; i < cols; i++) {
    const k = Math.min(GROUPS - 1, Math.floor(i / per));
    const f = ((i % toothCols) + 0.5) / toothCols;
    const tri = 1 - Math.abs(2 * f - 1);
    // ромбик между зубцами: там, где зубец сходит на нет
    const gapTri = clamp(1 - tri * 2.2);
    const edge = i === 0 || i === cols - 1;
    for (let r = 0; r < rows; r++) {
      const v = (r + 0.5) / rows;
      let c = C_BG;
      if (edge || v < 0.025 || v > 0.975) c = C_LINE;
      else if (v >= 0.05 && v < 0.05 + 0.12 * tri) c = 3 + k;
      else if (v <= 0.95 && v > 0.95 - 0.12 * tri) c = 3 + k;
      else if (gapTri > 0 && Math.abs(v - 0.105) < 0.04 * gapTri) c = C_LINE;
      else if (gapTri > 0 && Math.abs(v - 0.895) < 0.04 * gapTri) c = C_LINE;
      else if ((v > 0.188 && v < 0.199) || (v > 0.801 && v < 0.812)) c = C_LINE;
      else if (alpha && alpha[(r * cols * SUB + i * SUB + SUB / 2) * 4 + 3]! > 127) c = C_RED;
      map[i * rows + r] = c;
    }
  }
  return map;
}

/* ------------------------------------------------------------------ */
/* Выпечка: обмотанные шерстью стебли и голые стебли, по столбцу на стебель */
/* ------------------------------------------------------------------ */

type Baked = { wrapped: HTMLCanvasElement; bare: HTMLCanvasElement };

function colorOf(c: number, pal: Palette) {
  if (c === C_BG) return pal.panel;
  if (c === C_LINE) return pal.line;
  if (c === C_RED) return pal.red;
  return pal.wool[c - 3] ?? pal.line;
}

function eachRun(map: Uint8Array, i: number, rows: number, fn: (r0: number, r1: number, c: number) => void) {
  const base = i * rows;
  let r0 = 0;
  let c = map[base]!;
  for (let r = 1; r <= rows; r++) {
    const n = r < rows ? map[base + r]! : -1;
    if (n !== c) {
      fn(r0, r, c);
      r0 = r;
      c = n;
    }
  }
}

function glowPass(target: HTMLCanvasElement, blurPx: number) {
  const ctx = target.getContext("2d");
  if (!ctx || !("filter" in ctx)) return;
  const copy = makeCanvas(target.width, target.height);
  const cctx = copy.getContext("2d");
  if (!cctx) return;
  cctx.drawImage(target, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.filter = `blur(${blurPx}px)`;
  ctx.globalAlpha = 0.9;
  ctx.drawImage(copy, 0, 0);
  ctx.restore();
  copy.width = 0;
}

function bake(g: Geometry, map: Uint8Array, pal: Palette, mode: ChiyStyle): Baked | null {
  const { cols, rows, colW, dpr, bareRows } = g;
  const wrapped = makeCanvas(cols * colW, rows);
  const bare = makeCanvas(cols * colW, bareRows);
  const w = wrapped.getContext("2d");
  const b = bare.getContext("2d");
  if (!w || !b) return null;
  const gap = Math.max(1, Math.round(dpr * (g.pitch >= 6 ? 1.2 : 0.7)));
  const sw = colW - gap;

  for (let i = 0; i < cols; i++) {
    const x = i * colW;

    /* --- обмотанный стебель --- */
    if (mode === "wool") {
      eachRun(map, i, rows, (r0, r1, c) => {
        w.fillStyle = colorOf(c, pal);
        w.fillRect(x, r0, sw, r1 - r0);
      });
      // витки шерсти: тонкие косые полоски по всей длине
      const step = 2.6 * dpr;
      const tilt = 1.1 * dpr;
      const th = 0.75 * dpr;
      w.beginPath();
      for (let y = -tilt; y < rows; y += step) {
        w.moveTo(x, y);
        w.lineTo(x + sw, y + tilt);
        w.lineTo(x + sw, y + tilt + th);
        w.lineTo(x, y + th);
        w.closePath();
      }
      w.globalAlpha = 0.16;
      w.fillStyle = pal.shade;
      w.fill();
      // объём: тень по краям, блик ближе к левому краю
      w.globalAlpha = 0.24;
      w.fillRect(x, 0, Math.max(1, dpr * 1.2), rows);
      w.globalAlpha = 0.36;
      w.fillRect(x + sw - Math.max(1, dpr * 1.6), 0, Math.max(1, dpr * 1.6), rows);
      w.globalAlpha = 0.2 + rnd(i, 3) * 0.08;
      w.fillStyle = pal.sheen;
      w.fillRect(x + sw * 0.26, 0, Math.max(1, sw * 0.14), rows);
      w.globalAlpha = 1;
    } else if (mode === "ink") {
      // гравюра: бумага, тушь и красная печать; витки нитей светлыми штрихами по тёмному
      eachRun(map, i, rows, (r0, r1, c) => {
        w.fillStyle = c === C_BG ? pal.paper : c === C_RED ? pal.red : pal.line;
        w.fillRect(x, r0, sw, r1 - r0);
        const dark = c !== C_BG;
        const step = (dark ? 2.8 : 5.2) * dpr;
        w.beginPath();
        for (let y = r0 + ((i * 1.3) % step); y < r1; y += step) {
          w.moveTo(x, y);
          w.lineTo(x + sw, y + 0.9 * dpr);
          w.lineTo(x + sw, y + 0.9 * dpr + 0.6 * dpr);
          w.lineTo(x, y + 0.6 * dpr);
          w.closePath();
        }
        w.globalAlpha = dark ? 0.42 : 0.16;
        w.fillStyle = dark ? pal.paper : pal.line;
        w.fill();
        w.globalAlpha = 1;
      });
      w.fillStyle = pal.line;
      w.globalAlpha = 0.85;
      w.fillRect(x, 0, Math.max(1, 0.7 * dpr), rows);
      w.fillRect(x + sw - Math.max(1, 0.7 * dpr), 0, Math.max(1, 0.7 * dpr), rows);
      w.globalAlpha = 1;
    } else {
      // неон: тёмная шерсть, светящиеся нити, фон полотна едва виден
      eachRun(map, i, rows, (r0, r1, c) => {
        if (c === C_BG) {
          w.globalAlpha = 0.55;
          w.fillStyle = pal.panel;
          w.fillRect(x, r0, sw, r1 - r0);
          w.globalAlpha = 0.5;
          w.fillStyle = pal.reed;
          w.fillRect(x + sw * 0.42, r0, Math.max(1, sw * 0.16), r1 - r0);
          w.globalAlpha = 1;
          return;
        }
        w.fillStyle = colorOf(c, pal);
        w.fillRect(x + sw * 0.12, r0, sw * 0.76, r1 - r0);
      });
      w.globalAlpha = 0.28;
      w.fillStyle = pal.sheen;
      w.fillRect(x + sw * 0.38, 0, Math.max(1, sw * 0.18), rows);
      w.globalAlpha = 1;
    }

    /* --- голый стебель: тонкий, светлее к середине, кончики растворяются --- */
    const bw = mode === "ink" ? Math.max(1, 0.9 * dpr) : Math.max(1.4 * dpr, sw * (mode === "neon" ? 0.34 : 0.56));
    const bx = x + (sw - bw) / 2;
    b.fillStyle = mode === "ink" ? pal.line : pal.reed;
    b.globalAlpha = mode === "ink" ? 0.8 : 1;
    b.fillRect(bx, 0, bw, bareRows);
    if (mode === "wool") {
      b.fillStyle = pal.shade;
      b.globalAlpha = 0.08 + rnd(i, 5) * 0.22;
      b.fillRect(bx, 0, bw, bareRows);
      b.fillStyle = pal.sheen;
      b.globalAlpha = 0.35;
      b.fillRect(bx + bw * 0.2, 0, Math.max(1, bw * 0.25), bareRows);
    }
    b.globalAlpha = 1;
  }

  // кончики стеблей растворяются
  const grad = b.createLinearGradient(0, 0, 0, bareRows);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(0.2, pal.line);
  grad.addColorStop(0.8, pal.line);
  grad.addColorStop(1, "transparent");
  b.globalCompositeOperation = "destination-in";
  b.fillStyle = grad;
  b.fillRect(0, 0, bare.width, bareRows);
  b.globalCompositeOperation = "source-over";

  if (mode === "neon") {
    glowPass(wrapped, 3.5 * dpr);
    glowPass(bare, 2 * dpr);
  }
  return { wrapped, bare };
}

/* ------------------------------------------------------------------ */
/* Кадр                                                                */
/* ------------------------------------------------------------------ */

/** Ход направления k при общем прогрессе p: пучки развязываются по очереди, с нахлёстом */
export function groupProgress(p: number, k: number) {
  const start = 0.03 + k * 0.105;
  return clamp((p - start) / 0.2);
}

function drawFrame(ctx: CanvasRenderingContext2D, g: Geometry, baked: Baked, pal: Palette, mode: ChiyStyle, p: number, time: number) {
  const { dpr, pitch, per, PH, L, colW, rows, bareRows, x0, pivotY, maxAng } = g;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = mode === "neon" ? "lighter" : "source-over";
  const secW = per * pitch;

  for (let k = 0; k < GROUPS; k++) {
    const pg = groupProgress(p, k);
    const cx = x0 + (k + 0.5) * secW;
    const lean = Math.sin(time * 0.0007 + k * 1.9) * 0.012;
    for (let j = 0; j < per; j++) {
      const i = k * per + j;
      const stagger = (j / per) * 0.42;
      const t = clamp((pg - stagger) / 0.58);
      const te = ease(t);
      const xFinal = x0 + i * pitch + pitch / 2;
      const rel = (xFinal - cx) / (secW / 2);
      const sway = (Math.sin(time * 0.0012 + k * 1.3 + j * 0.37) * 0.012 + lean) * (1 - te);
      const ang = lerp(rel * maxAng + (rnd(i, 7) - 0.5) * 0.05, 0, te) + sway;
      const x = lerp(cx + rel * secW * 0.08, xFinal, te);
      const y = pivotY + lerp((rnd(i, 2) - 0.5) * PH * 0.16, 0, te);
      const wrap = clamp((t - 0.12) / 0.62);
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      ctx.setTransform(cos * dpr, sin * dpr, -sin * dpr, cos * dpr, x * dpr, y * dpr);
      ctx.drawImage(baked.bare, i * colW, 0, colW, bareRows, -pitch / 2, -L / 2, pitch, L);
      if (wrap > 0) {
        const sh = Math.max(1, Math.round(rows * wrap));
        ctx.drawImage(baked.wrapped, i * colW, 0, colW, sh, -pitch / 2, -PH / 2, pitch, (PH * sh) / rows);
      }
    }
    // нить, которой перевязан пучок: развязывается в начале хода направления
    const tieA = 1 - clamp(pg / 0.22);
    if (tieA > 0) {
      const tw = secW * 0.16 + 10;
      const th = Math.max(7, PH * 0.035);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = tieA;
      ctx.fillStyle = mode === "ink" ? pal.line : (pal.wool[k] ?? pal.line);
      ctx.beginPath();
      ctx.roundRect(cx - tw / 2, pivotY - th / 2, tw, th, th / 2);
      ctx.fill();
      if (mode === "wool") {
        ctx.globalAlpha = tieA * 0.3;
        ctx.fillStyle = pal.shade;
        ctx.fillRect(cx - tw / 2 + th / 2, pivotY + th * 0.15, tw - th, th * 0.3);
      }
      ctx.globalAlpha = 1;
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
}

/* ------------------------------------------------------------------ */
/* Монтирование                                                        */
/* ------------------------------------------------------------------ */

export type ChiyMount = {
  canvas: HTMLCanvasElement;
  /** Липкая сцена: её размер = размер холста */
  stage: HTMLElement;
  /** Место полотна в вёрстке */
  slot: HTMLElement;
  /** Высокая секция, по прокрутке которой идёт сюжет */
  section: HTMLElement;
  /** Обёртка темы: на ней data-chiy и токены цветов */
  theme: HTMLElement;
  /** Сколько направлений вплетено (0–8) и какое сейчас в работе (-1, если ни одно) */
  onStep: (joined: number, current: number) => void;
  onReady: () => void;
};

export function mountChiy(o: ChiyMount): () => void {
  const ctx = o.canvas.getContext("2d");
  if (!ctx) return () => {};

  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduced = reducedMq.matches;
  let g: Geometry | null = null;
  let map: Uint8Array | null = null;
  let baked: Baked | null = null;
  let pal = readPalette(o.theme);
  let mode = (o.theme.dataset.chiy as ChiyStyle) || "wool";
  let shown = reduced ? 1 : -1;
  let raf = 0;
  let visible = true;
  let dirty = true;
  let lastJoined = -1;
  let lastCurrent = -2;
  let ready = false;

  const target = () => {
    if (reduced) return 1;
    const r = o.section.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 4 ? clamp(-r.top / total) : 1;
  };

  const report = (p: number) => {
    let joined = 0;
    let current = -1;
    for (let k = 0; k < GROUPS; k++) {
      const pg = groupProgress(p, k);
      if (pg >= 0.55) joined = k + 1;
      if (pg > 0) current = k;
    }
    if (joined !== lastJoined || current !== lastCurrent) {
      lastJoined = joined;
      lastCurrent = current;
      o.onStep(joined, current);
    }
  };

  const rebake = () => {
    if (!g) return;
    if (baked) {
      baked.wrapped.width = 0;
      baked.bare.width = 0;
    }
    baked = map ? bake(g, map, pal, mode) : null;
    dirty = true;
  };

  const layout = () => {
    const sr = o.stage.getBoundingClientRect();
    const lr = o.slot.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = sr.width;
    const H = sr.height;
    o.canvas.width = Math.round(W * dpr);
    o.canvas.height = Math.round(H * dpr);
    g = measure(W, H, { x: lr.left - sr.left, y: lr.top - sr.top, w: lr.width, h: lr.height }, dpr);
    map = g ? buildPattern(g) : null;
    rebake();
  };

  const frame = (time: number) => {
    raf = 0;
    if (!g || !baked) return;
    const t = target();
    const prev = shown;
    shown = shown < 0 ? t : Math.abs(t - shown) < 0.0008 ? t : shown + (t - shown) * 0.2;
    const moving = shown !== prev || shown < 1;
    if (dirty || moving) {
      drawFrame(ctx, g, baked, pal, mode, shown, reduced ? 0 : time);
      dirty = false;
      report(shown);
      if (!ready) {
        ready = true;
        o.onReady();
      }
    }
    // собранное и неподвижное полотно не крутит цикл: следующий кадр запросит прокрутка
    if (visible && !reduced && (moving || shown !== t)) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  layout();
  kick();

  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      layout();
      kick();
    });
  });
  ro.observe(o.stage);
  ro.observe(o.slot);

  const io = new IntersectionObserver(
    ([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) kick();
    },
    { rootMargin: "80px 0px" },
  );
  io.observe(o.section);

  const mo = new MutationObserver(() => {
    pal = readPalette(o.theme);
    mode = (o.theme.dataset.chiy as ChiyStyle) || "wool";
    rebake();
    kick();
  });
  mo.observe(o.theme, { attributes: true, attributeFilter: ["data-chiy"] });

  const onScroll = () => {
    if (reduced) return;
    kick();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const onMq = () => {
    reduced = reducedMq.matches;
    if (reduced) shown = 1;
    dirty = true;
    kick();
  };
  reducedMq.addEventListener("change", onMq);

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(resizeRaf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    window.removeEventListener("scroll", onScroll);
    reducedMq.removeEventListener("change", onMq);
    if (baked) {
      baked.wrapped.width = 0;
      baked.bare.width = 0;
    }
    baked = null;
    map = null;
  };
}
