/**
 * Доска тогуз коргоол на Canvas 2D: перспектива, 162 коргоола, казаны, туз.
 * Партия настоящая и по правилам (см. game.ts): ходы найдены перебором и записаны в GAME.
 * Время t ∈ [0, 1] задаёт прокрутка; положение каждого коргоола — чистая функция от t,
 * поэтому прокрутка назад отматывает партию без накопленных ошибок.
 * Все цвета берутся из CSS-переменных --cv-* (токены варианта), литералов цвета здесь нет.
 */
import { KURAK_PATHS } from "../brand/KurakLogo";
import { PER_SIDE, RING, TOTAL, play, startPosition, type Side } from "./game";

/** Ходы партии (индексы лунок на кольце). Белые = мы. Туз берёт «Брендинг», 82-й коргоол приносит туз на ходу соперника. */
export const GAME = [0, 9, 8, 16, 1, 13, 4, 10, 6, 15, 6, 11, 8, 17, 5, 17, 2, 9, 0, 10, 3, 13, 1, 14, 8, 10, 5, 12, 7, 12, 6, 17, 1, 17, 4, 10, 5, 12, 1, 9, 8, 15, 7, 9, 2, 11, 2, 14];

/** Где начинается каждый шаг сюжета (доля прокрутки) */
export const STEP_AT = [0, 0.05, 0.3, 0.45, 0.61, 0.955] as const;
export const STEP_IDS = ["intro", "sow", "capture", "tuz", "income", "win"] as const;
export type StepId = (typeof STEP_IDS)[number];
export const stepAt = (t: number): StepId => {
  let i = 0;
  for (let k = 0; k < STEP_AT.length; k++) if (t >= STEP_AT[k]!) i = k;
  return STEP_IDS[i]!;
};

const K0 = RING; // наш казан
const K1 = RING + 1; // казан соперника

type Seg = { t0: number; t1: number; c0: number; s0: number; c1: number; s1: number; lift: number };
export type Timeline = {
  segs: Seg[][];
  init: { c: number; s: number }[];
  k0: number[];
  k1: number[];
  plies: { t0: number; t1: number; from: number; side: Side }[];
  lit: number[];
  captures: { t: number; at: number; side: Side }[];
  tuz: { t: number; at: number } | null;
  tuzDrops: number[];
};

function plyWindow(i: number, n: number): [number, number] {
  if (i === 0) return [0.06, 0.225];
  if (i <= 3) {
    const a = 0.228 + (i - 1) * 0.025;
    return [a, a + 0.023];
  }
  if (i === 4) return [0.31, 0.43];
  if (i === 5) return [0.432, 0.455];
  if (i === 6) return [0.46, 0.585];
  const a = 0.62;
  const w = (0.95 - a) / (n - 7);
  const s = a + (i - 7) * w;
  return [s, s + w * 0.94];
}

export function buildTimeline(moves: number[] = GAME): Timeline {
  const p = startPosition();
  const cont: number[][] = Array.from({ length: RING + 2 }, () => []);
  const init: { c: number; s: number }[] = [];
  const segs: Seg[][] = Array.from({ length: TOTAL }, () => []);
  const slotOf = new Map<number, number>();
  for (let r = 0; r < RING; r++)
    for (let k = 0; k < PER_SIDE; k++) {
      const id = r * PER_SIDE + k;
      cont[r]!.push(id);
      init[id] = { c: r, s: k };
      slotOf.set(id, k);
    }
  const k0: number[] = [];
  const k1: number[] = [];
  const plies: Timeline["plies"] = [];
  const lit: number[] = Array(PER_SIDE).fill(Infinity);
  const captures: Timeline["captures"] = [];
  const tuzDrops: number[] = [];
  let tuz: Timeline["tuz"] = null;

  const add = (id: number, s: Seg) => segs[id]!.push(s);
  const toKazan = (owner: Side) => (owner === 0 ? K0 : K1);
  const push = (c: number, id: number) => {
    const s = cont[c]!.length;
    cont[c]!.push(id);
    slotOf.set(id, s);
    return s;
  };

  moves.forEach((from, i) => {
    const side = p.toMove;
    const [a, b] = plyWindow(i, moves.length);
    const ev = play(p, from);
    plies.push({ t0: a, t1: b, from, side });
    const sowN = ev.filter((e) => e.kind === "sow" || e.kind === "tuzDrop").length;
    const hasEnd = ev.some((e) => e.kind === "capture" || e.kind === "tuz");
    const sowEnd = hasEnd ? a + (b - a) * 0.66 : b;
    const dt = sowEnd - a;
    const hand = cont[from]!.slice().reverse();
    cont[from] = [];
    let k = 0;
    for (const e of ev) {
      if (e.kind === "sow" || e.kind === "tuzDrop") {
        const id = hand[k]!;
        const s0 = slotOf.get(id) ?? 0;
        const t0 = a + dt * 0.68 * (k / Math.max(1, sowN));
        const t1 = t0 + dt * 0.32;
        if (e.kind === "sow") {
          const s1 = push(e.to, id);
          add(id, { t0, t1, c0: from, s0, c1: e.to, s1, lift: e.to === from ? 0.35 : 1 });
          if (i === 0 && e.to < PER_SIDE) lit[e.to] = Math.min(lit[e.to]!, t1);
        } else {
          add(id, { t0, t1, c0: from, s0, c1: e.to, s1: 0, lift: 1 });
          const K = toKazan(e.owner);
          const s1 = push(K, id);
          const u0 = t1 + dt * 0.04;
          const u1 = u0 + Math.max(dt * 0.3, 0.004);
          add(id, { t0: u0, t1: u1, c0: e.to, s0: 0, c1: K, s1, lift: 0.8 });
          (e.owner === 0 ? k0 : k1).push(u1);
          tuzDrops.push(t1);
        }
        k++;
      } else if (e.kind === "capture" || e.kind === "tuz") {
        const taken = cont[e.at]!;
        cont[e.at] = [];
        const K = toKazan(e.side);
        const span = b - sowEnd;
        taken.forEach((id, j) => {
          const s0 = slotOf.get(id) ?? 0;
          const s1 = push(K, id);
          const t0 = sowEnd + span * 0.1 + span * 0.5 * (j / Math.max(1, taken.length));
          const t1 = t0 + span * 0.38;
          add(id, { t0, t1, c0: e.at, s0, c1: K, s1, lift: 1.2 });
          (e.side === 0 ? k0 : k1).push(t1);
        });
        if (e.kind === "capture") captures.push({ t: sowEnd, at: e.at, side: e.side });
        else tuz = { t: sowEnd, at: e.at };
      }
    }
  });
  k0.sort((x, y) => x - y);
  k1.sort((x, y) => x - y);
  return { segs, init, k0, k1, plies, lit, captures, tuz, tuzDrops };
}

/** Сколько значений в отсортированном массиве не больше t */
function countUpTo(arr: number[], t: number) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (arr[m]! <= t) lo = m + 1;
    else hi = m;
  }
  return lo;
}

/* ------------------------------------------------------------------ */
/* Геометрия доски в мировых единицах: шаг лунок = 1                    */
/* ------------------------------------------------------------------ */
const ROW_Y = 1.2;
const HOLE_R = 0.4;
const STONE_R = 0.095;
const KAZAN_X = 2.25;
const KAZAN_HALF = 1.86;
const KAZAN_W = 0.36;
const SLAB_X = 5.1;
const SLAB_Y = 2.02;
const SLAB_T = 0.34;

/** Центр лунки r на доске */
export function holeXY(r: number): [number, number] {
  if (r < PER_SIDE) return [-4 + r, ROW_Y];
  return [4 - (r - PER_SIDE), -ROW_Y];
}
const kazanX = (c: number) => (c === K0 ? KAZAN_X : -KAZAN_X);

function slotXYZ(c: number, s: number, salt: number): [number, number, number] {
  if (c >= RING) {
    const per = 51;
    const layer = Math.floor(s / per);
    const idx = s % per;
    const col = Math.floor(idx / 3);
    const row = idx % 3;
    const kx = kazanX(c);
    const dir = c === K0 ? 1 : -1;
    return [kx + dir * (-1.62 + col * 0.2 + layer * 0.1), (row - 1) * 0.19 + layer * 0.06, layer * STONE_R * 1.05];
  }
  const [hx, hy] = holeXY(c);
  const layer = s < 10 ? 0 : s < 18 ? 1 : s < 24 ? 2 : 3;
  const i = layer === 0 ? s : layer === 1 ? s - 10 : layer === 2 ? s - 18 : s - 24;
  const scale = [1, 0.74, 0.5, 0.3][layer]!;
  const rr = 0.112 * Math.sqrt(i + 0.5) * scale;
  const ang = i * 2.39996 + layer * 0.9 + salt * 0.7;
  return [hx + Math.cos(ang) * rr, hy + Math.sin(ang) * rr, layer * STONE_R * 1.2];
}

const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/* ------------------------------------------------------------------ */
/* Цвета из токенов                                                    */
/* ------------------------------------------------------------------ */
type RGB = [number, number, number];
type Palette = {
  mode: "wood" | "ink" | "night";
  slab: RGB; slab2: RGB; edge: RGB; grain: RGB; hole: RGB; wall: RGB; rim: RGB;
  stone: RGB; stoneHi: RGB; stoneLo: RGB; hot: RGB; tuz: RGB; ring: RGB; shadow: RGB; glow: RGB; line: RGB;
};
const css = (c: RGB, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function readPalette(el: HTMLElement): Palette {
  const cs = getComputedStyle(el);
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const pc = probe.getContext("2d", { willReadFrequently: true })!;
  const get = (name: string): RGB => {
    const v = cs.getPropertyValue(name).trim();
    pc.clearRect(0, 0, 1, 1);
    pc.fillStyle = "#000";
    if (v) pc.fillStyle = v;
    pc.fillRect(0, 0, 1, 1);
    const d = pc.getImageData(0, 0, 1, 1).data;
    return [d[0]!, d[1]!, d[2]!];
  };
  const m = cs.getPropertyValue("--cv-mode").trim();
  return {
    mode: m === "ink" || m === "night" ? m : "wood",
    slab: get("--cv-slab"), slab2: get("--cv-slab-2"), edge: get("--cv-edge"), grain: get("--cv-grain"),
    hole: get("--cv-hole"), wall: get("--cv-wall"), rim: get("--cv-rim"),
    stone: get("--cv-stone"), stoneHi: get("--cv-stone-hi"), stoneLo: get("--cv-stone-lo"),
    hot: get("--cv-hot"), tuz: get("--cv-tuz"), ring: get("--cv-ring"), shadow: get("--cv-shadow"), glow: get("--cv-glow"), line: get("--cv-line"),
  };
}

/* ------------------------------------------------------------------ */
/* Рендерер                                                            */
/* ------------------------------------------------------------------ */
export type Slot = { x: number; y: number; w: number; h: number };
export type BoardLayout = {
  holes: { x: number; y: number; rx: number; ry: number }[];
  /** Точка под лункой (подпись) */
  under: { x: number; y: number }[];
  kazan: { x: number; y: number };
  rivalKazan: { x: number; y: number };
  /** Ширина места под подпись казана на доске, px */
  tagW: number;
  tuzTag: { x: number; y: number } | null;
  vertical: boolean;
  farEdge: { x: number; y: number };
  nearEdge: { x: number; y: number };
};

export class BoardRenderer {
  private ctx: CanvasRenderingContext2D;
  private stat: HTMLCanvasElement;
  private sprites: Record<"stone" | "hot" | "glow" | "hotGlow", HTMLCanvasElement> | null = null;
  private pal: Palette | null = null;
  private tl: Timeline;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private vertical = false;
  private tilt = 0.62;
  private D = 15;
  private k = 1;
  private ox = 0;
  private oy = 0;
  private order: number[] = [];
  private buf: { sx: number; sy: number; r: number; z: number; hot: boolean; id: number }[] = [];
  hover = -1;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.stat = document.createElement("canvas");
    this.tl = buildTimeline();
    this.order = Array.from({ length: TOTAL }, (_, i) => i);
    this.buf = this.order.map((id) => ({ sx: 0, sy: 0, r: 0, z: 0, hot: false, id }));
  }

  get timeline() {
    return this.tl;
  }

  /** Камера: 3D точка доски → экран (CSS px) */
  private project(x: number, y: number, z: number): [number, number, number] {
    const vx = this.vertical ? y : x;
    const vy = this.vertical ? -x : y;
    const st = Math.sin(this.tilt);
    const ct = Math.cos(this.tilt);
    const depth = this.D - (vy * st + z * ct);
    const X = vx;
    const Y = vy * ct - z * st;
    const s = this.k / depth;
    return [this.ox + X * s, this.oy + Y * s, s];
  }

  resize(w: number, h: number, dpr: number, slot: Slot): BoardLayout {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.vertical = slot.w < 600 || slot.h > slot.w * 1.05;
    const aspect = slot.w / slot.h;
    this.tilt = this.vertical ? 0.26 : aspect > 2.4 ? 0.72 : aspect > 1.8 ? 0.6 : 0.42;
    this.D = this.vertical ? 18 : 15;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.stat.width = this.canvas.width;
    this.stat.height = this.canvas.height;
    // вписываем плиту доски в слот
    this.k = 1;
    this.ox = 0;
    this.oy = 0;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const x of [-SLAB_X, SLAB_X])
      for (const y of [-SLAB_Y, SLAB_Y])
        for (const z of [0, -SLAB_T]) {
          const [sx, sy] = this.project(x, y, z);
          minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
        }
    const k = Math.min(slot.w / (maxX - minX), slot.h / (maxY - minY));
    this.k = k;
    this.ox = slot.x + slot.w / 2 - (k * (minX + maxX)) / 2;
    this.oy = slot.y + slot.h / 2 - (k * (minY + maxY)) / 2;
    this.sprites = null;
    if (this.pal) this.paintStatic();
    return this.layout();
  }

  layout(): BoardLayout {
    const holes = [];
    const under = [];
    for (let r = 0; r < PER_SIDE; r++) {
      const [x, y] = holeXY(r);
      const { cx, cy, rx, ry } = this.ellipse(x, y, HOLE_R);
      holes.push({ x: cx, y: cy, rx, ry });
      const [ux, uy] = this.vertical ? this.project(x, y + HOLE_R + 0.15, 0) : this.project(x, SLAB_Y, -SLAB_T);
      under.push({ x: ux, y: uy });
    }
    const [kx, ky] = this.project(KAZAN_X + KAZAN_HALF + 0.38, 0, 0);
    const tagW = this.vertical
      ? Math.abs(this.project(0, ROW_Y - HOLE_R, 0)[0] - this.project(0, -ROW_Y + HOLE_R, 0)[0])
      : Math.abs(this.project(SLAB_X - 0.06, 0, 0)[0] - this.project(KAZAN_X + KAZAN_HALF + 0.04, 0, 0)[0]);
    const [rkx, rky] = this.project(-KAZAN_X - KAZAN_HALF - 0.38, 0, 0);
    let tuzTag = null;
    if (this.tl.tuz) {
      const [x, y] = holeXY(this.tl.tuz.at);
      const [tx, ty] = this.vertical ? this.project(x, y - HOLE_R - 0.32, 0) : this.project(x, y - HOLE_R - 0.3, 0);
      tuzTag = { x: tx, y: ty };
    }
    const [fx, fy] = this.vertical ? this.project(0, -SLAB_Y, 0) : this.project(0, -SLAB_Y, 0);
    const [nx, ny] = this.project(0, SLAB_Y, -SLAB_T);
    return { holes, under, kazan: { x: kx, y: ky }, rivalKazan: { x: rkx, y: rky }, tagW, tuzTag, vertical: this.vertical, farEdge: { x: fx, y: fy }, nearEdge: { x: nx, y: ny } };
  }

  setPalette(el: HTMLElement) {
    this.pal = readPalette(el);
    this.sprites = null;
    if (this.w) this.paintStatic();
  }

  private ellipse(x: number, y: number, r: number) {
    const [cx, cy, s] = this.project(x, y, 0);
    const a = this.project(x + (this.vertical ? 0 : r), y + (this.vertical ? r : 0), 0);
    const b = this.project(x - (this.vertical ? 0 : r), y - (this.vertical ? r : 0), 0);
    const c = this.project(x + (this.vertical ? r : 0), y + (this.vertical ? 0 : r), 0);
    const d = this.project(x - (this.vertical ? r : 0), y - (this.vertical ? 0 : r), 0);
    return { cx, cy, rx: Math.hypot(a[0] - b[0], a[1] - b[1]) / 2, ry: Math.hypot(c[0] - d[0], c[1] - d[1]) / 2, s };
  }

  /** Путь по контуру фигуры на плоскости доски */
  private polyPath(ctx: CanvasRenderingContext2D, pts: [number, number][], z = 0) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => {
      const [sx, sy] = this.project(x, y, z);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    });
    ctx.closePath();
  }

  private roundRect(w: number, h: number, r: number, n = 10): [number, number][] {
    const pts: [number, number][] = [];
    const corners: [number, number, number][] = [
      [w - r, h - r, 0],
      [-w + r, h - r, Math.PI / 2],
      [-w + r, -h + r, Math.PI],
      [w - r, -h + r, (3 * Math.PI) / 2],
    ];
    for (const [cx, cy, a0] of corners) for (let i = 0; i <= n; i++) {
      const a = a0 + (i / n) * (Math.PI / 2);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  private stadium(cx: number, half: number, wid: number): [number, number][] {
    const pts: [number, number][] = [];
    const n = 14;
    for (let i = 0; i <= n; i++) {
      const a = -Math.PI / 2 + (i / n) * Math.PI;
      pts.push([cx + half - wid + Math.cos(a) * wid, Math.sin(a) * wid]);
    }
    for (let i = 0; i <= n; i++) {
      const a = Math.PI / 2 + (i / n) * Math.PI;
      pts.push([cx - half + wid + Math.cos(a) * wid, Math.sin(a) * wid]);
    }
    return pts;
  }

  private hatch(ctx: CanvasRenderingContext2D, gap: number, color: string, width: number) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    const L = this.w + this.h;
    for (let x = -this.h; x < L; x += gap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x + this.h, this.h);
    }
    ctx.stroke();
    ctx.restore();
  }

  private paintStatic() {
    const pal = this.pal!;
    const g = this.stat.getContext("2d")!;
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.clearRect(0, 0, this.w, this.h);
    const slab = this.roundRect(SLAB_X, SLAB_Y, 0.42);
    const unit = this.k / this.D;

    // боковая грань плиты (толщина), видна у ближнего края
    const front: [number, number][] = slab.filter(([x, y]) => (this.vertical ? -x : y) > 0);
    const face = new Path2D();
    front.forEach(([x, y], i) => {
      const [sx, sy] = this.project(x, y, 0);
      if (i === 0) face.moveTo(sx, sy);
      else face.lineTo(sx, sy);
    });
    for (let i = front.length - 1; i >= 0; i--) {
      const [x, y] = front[i]!;
      const [sx, sy] = this.project(x, y, -SLAB_T);
      face.lineTo(sx, sy);
    }
    face.closePath();

    if (pal.mode === "ink") {
      g.fillStyle = css(pal.slab);
      g.fill(face);
      g.save();
      g.clip(face);
      this.hatch(g, 4, css(pal.line, 0.55), 1);
      g.restore();
      g.strokeStyle = css(pal.line);
      g.lineWidth = 1.4;
      g.stroke(face);
    } else {
      // тень под доской, потом грань поверх
      g.save();
      g.globalAlpha = pal.mode === "night" ? 0.6 : 0.35;
      g.filter = `blur(${Math.max(6, unit * 0.35)}px)`;
      this.polyPath(g, this.roundRect(SLAB_X * 0.98, SLAB_Y * 0.96, 0.42), -SLAB_T * 1.6);
      g.fillStyle = css(pal.shadow);
      g.fill();
      g.restore();
      g.fillStyle = css(pal.edge);
      g.fill(face);
    }
    // клеймо мастера: знак KURAK выжжен на торце доски (виден, когда торец достаточно высокий)
    if (!this.vertical) {
      const [lx0, ly0] = this.project(-0.62, SLAB_Y, -SLAB_T * 0.2);
      const [lx1, ly1] = this.project(0.62, SLAB_Y, -SLAB_T * 0.8);
      const hgt = ly1 - ly0;
      if (hgt > 9) {
        const wid = Math.min(lx1 - lx0, (hgt * 443) / 93);
        const sc = wid / 443;
        g.save();
        g.translate((lx0 + lx1) / 2 - wid / 2, ly0 + (hgt - 93 * sc) / 2);
        g.scale(sc, sc);
        g.fillStyle = pal.mode === "ink" ? css(pal.line) : pal.mode === "night" ? css(pal.rim, 0.55) : css(pal.shadow, 0.5);
        for (const d of KURAK_PATHS) g.fill(new Path2D(d));
        g.restore();
      }
    }

    // верхняя плоскость
    this.polyPath(g, slab);
    const [, farY] = this.project(0, this.vertical ? 0 : -SLAB_Y, 0);
    const [, nearY] = this.project(0, this.vertical ? 0 : SLAB_Y, 0);
    if (pal.mode === "ink") {
      g.fillStyle = css(pal.slab);
      g.fill();
      g.strokeStyle = css(pal.line);
      g.lineWidth = 1.6;
      g.stroke();
    } else {
      if (this.vertical) {
        const [l] = this.project(0, -SLAB_Y, 0);
        const [r] = this.project(0, SLAB_Y, 0);
        const gg = g.createLinearGradient(l, 0, r, 0);
        gg.addColorStop(0, css(pal.slab2));
        gg.addColorStop(0.5, css(pal.slab));
        gg.addColorStop(1, css(pal.slab2));
        g.fillStyle = gg;
      } else {
        const grad = g.createLinearGradient(0, farY, 0, nearY);
        grad.addColorStop(0, css(pal.slab2));
        grad.addColorStop(1, css(pal.slab));
        g.fillStyle = grad;
      }
      g.fill();
      // волокна дерева вдоль доски
      g.save();
      this.polyPath(g, slab);
      g.clip();
      const lines = pal.mode === "night" ? 26 : 64;
      for (let i = 0; i < lines; i++) {
        const y0 = -SLAB_Y + (i + 0.5) * ((2 * SLAB_Y) / lines);
        const amp = 0.03 + ((i * 37) % 11) / 260;
        const ph = (i * 1.7) % 6.28;
        g.beginPath();
        for (let s = 0; s <= 60; s++) {
          const x = -SLAB_X + (s / 60) * 2 * SLAB_X;
          const y = y0 + Math.sin(x * 0.55 + ph) * amp + Math.sin(x * 1.9 + ph * 2) * amp * 0.35;
          const [sx, sy] = this.project(x, y, 0);
          if (s === 0) g.moveTo(sx, sy);
          else g.lineTo(sx, sy);
        }
        g.strokeStyle = css(pal.grain, pal.mode === "night" ? 0.18 : 0.1 + ((i * 13) % 7) / 50);
        g.lineWidth = 0.6 + ((i * 7) % 5) / 4;
        g.stroke();
      }
      g.restore();
      // фаска: светлая кромка
      this.polyPath(g, slab);
      g.strokeStyle = css(pal.rim, pal.mode === "night" ? 0.5 : 0.55);
      g.lineWidth = pal.mode === "night" ? 1 : 1.5;
      g.stroke();
    }

    // казаны
    for (const c of [K0, K1]) this.carve(g, this.stadium(kazanX(c), KAZAN_HALF, KAZAN_W));
    // лунки
    for (let r = 0; r < RING; r++) {
      const [x, y] = holeXY(r);
      const pts: [number, number][] = [];
      for (let i = 0; i < 40; i++) {
        const a = (i / 40) * Math.PI * 2;
        pts.push([x + Math.cos(a) * HOLE_R, y + Math.sin(a) * HOLE_R]);
      }
      this.carve(g, pts);
    }
  }

  /** Вырезанное углубление: тёмная стенка сверху, светлая снизу, дно */
  private carve(g: CanvasRenderingContext2D, pts: [number, number][]) {
    const pal = this.pal!;
    if (pal.mode === "ink") {
      this.polyPath(g, pts);
      g.fillStyle = css(pal.hole);
      g.fill();
      g.save();
      g.clip();
      this.hatch(g, 3.2, css(pal.line, 0.42), 0.9);
      g.restore();
      this.polyPath(g, pts);
      g.strokeStyle = css(pal.line);
      g.lineWidth = 1.5;
      g.stroke();
      return;
    }
    // дно тёмное, нижняя стенка подсвечена: светлый серп через сдвинутую вверх маску с размытием
    const scr = pts.map(([x, y]) => this.project(x, y, 0));
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [sx, sy] of scr) {
      minX = Math.min(minX, sx); maxX = Math.max(maxX, sx); minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
    }
    const off = Math.min(maxX - minX, maxY - minY) * 0.2;
    this.polyPath(g, pts);
    g.fillStyle = css(pal.hole);
    g.fill();
    g.save();
    this.polyPath(g, pts);
    g.clip();
    g.beginPath();
    g.rect(0, 0, this.w, this.h);
    scr.forEach(([sx, sy], i) => (i === 0 ? g.moveTo(sx, sy - off) : g.lineTo(sx, sy - off)));
    g.closePath();
    g.filter = `blur(${Math.max(1, off * 0.55)}px)`;
    g.fillStyle = css(pal.wall);
    g.fill("evenodd");
    g.restore();
    // кромка
    this.polyPath(g, pts);
    g.strokeStyle = css(pal.rim, pal.mode === "night" ? 0.35 : 0.5);
    g.lineWidth = 1;
    g.stroke();
  }

  private makeSprites() {
    const pal = this.pal!;
    const S = 64;
    const mk = (fill: RGB, hi: RGB, lo: RGB, glow: boolean) => {
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d")!;
      const R = S / 2;
      if (glow) {
        const gg = g.createRadialGradient(R, R, 0, R, R, R);
        gg.addColorStop(0, css(fill, 0.9));
        gg.addColorStop(0.25, css(fill, 0.35));
        gg.addColorStop(1, css(fill, 0));
        g.fillStyle = gg;
        g.fillRect(0, 0, S, S);
        return c;
      }
      const r = R * 0.92;
      if (pal.mode === "ink") {
        g.beginPath();
        g.arc(R, R, r, 0, Math.PI * 2);
        g.fillStyle = css(fill);
        g.fill();
        g.beginPath();
        g.arc(R - r * 0.3, R - r * 0.32, r * 0.22, 0, Math.PI * 2);
        g.fillStyle = css(hi, 0.85);
        g.fill();
        return c;
      }
      const gr = g.createRadialGradient(R - r * 0.35, R - r * 0.4, r * 0.08, R, R, r);
      gr.addColorStop(0, css(hi));
      gr.addColorStop(0.45, css(fill));
      gr.addColorStop(1, css(lo));
      g.beginPath();
      g.arc(R, R, r, 0, Math.PI * 2);
      g.fillStyle = gr;
      g.fill();
      return c;
    };
    this.sprites = {
      stone: mk(pal.stone, pal.stoneHi, pal.stoneLo, false),
      hot: mk(pal.hot, pal.stoneHi, pal.hot.map((v) => Math.round(v * 0.55)) as RGB, false),
      glow: mk(pal.glow, pal.glow, pal.glow, true),
      hotGlow: mk(pal.hot, pal.hot, pal.hot, true),
    };
  }

  /** Положение коргоола id в момент t: мировые координаты и «в полёте ли» */
  private stoneAt(id: number, t: number): [number, number, number, boolean] {
    const segs = this.tl.segs[id]!;
    let seg: Seg | null = null;
    for (let i = segs.length - 1; i >= 0; i--) {
      if (segs[i]!.t0 <= t) {
        seg = segs[i]!;
        break;
      }
    }
    const salt = id % 7;
    if (!seg) {
      const { c, s } = this.tl.init[id]!;
      const [x, y, z] = slotXYZ(c, s, c);
      return [x, y, z, false];
    }
    const [x1, y1, z1] = slotXYZ(seg.c1, seg.s1, seg.c1);
    if (t >= seg.t1) return [x1, y1, z1, false];
    const [x0, y0, z0] = slotXYZ(seg.c0, seg.s0, seg.c0);
    const u = ease((t - seg.t0) / (seg.t1 - seg.t0));
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const lift = seg.lift * (0.35 + dist * 0.16) + salt * 0.004;
    return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, z0 + (z1 - z0) * u + Math.sin(Math.PI * u) * lift, true];
  }

  /** Счёт казанов и номер хода в момент t */
  score(t: number) {
    const tl = this.tl;
    let move = 0;
    for (const p of tl.plies) if (p.t0 <= t) move++;
    return { ours: countUpTo(tl.k0, t), theirs: countUpTo(tl.k1, t), move };
  }

  render(t: number) {
    if (!this.pal || !this.w) return;
    if (!this.sprites) this.makeSprites();
    const ctx = this.ctx;
    const pal = this.pal;
    const sp = this.sprites!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.stat, 0, 0);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const tl = this.tl;

    // подсветки лунок: ход, взятие, туз, наведение
    const ring = (r: number, color: RGB, alpha: number, width: number, fill = 0) => {
      const [x, y] = holeXY(r);
      const e = this.ellipse(x, y, HOLE_R * 1.08);
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = css(color, fill);
        ctx.fill();
      }
      ctx.strokeStyle = css(color, alpha);
      ctx.lineWidth = width;
      ctx.stroke();
    };
    for (const p of tl.plies) {
      if (t >= p.t0 && t <= p.t1) ring(p.from, p.side === 0 ? pal.hot : pal.ring, 0.9, 2);
    }
    for (const c of tl.captures) {
      const d = t - c.t;
      if (d >= 0 && d < 0.03) ring(c.at, c.side === 0 ? pal.hot : pal.ring, 1 - d / 0.03, 3, (1 - d / 0.03) * 0.25);
    }
    if (tl.tuz && t >= tl.tuz.t) {
      const d = t - tl.tuz.t;
      const pulse = d < 0.04 ? 1 - d / 0.04 : 0;
      let drop = 0;
      for (const td of tl.tuzDrops) {
        const dd = t - td;
        if (dd >= 0 && dd < 0.012) drop = Math.max(drop, 1 - dd / 0.012);
      }
      ring(tl.tuz.at, pal.tuz, 1, 2.5 + pulse * 4 + drop * 2, 0.22 + pulse * 0.3 + drop * 0.25);
      const [x, y] = holeXY(tl.tuz.at);
      const e = this.ellipse(x, y, HOLE_R * 1.3);
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = css(pal.tuz, 0.45 + drop * 0.4);
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (this.hover >= 0) ring(this.hover, pal.hot, 1, 2.5, 0.12);

    // коргоолы: сортировка по глубине
    const buf = this.buf;
    for (let i = 0; i < TOTAL; i++) {
      const [x, y, z, flying] = this.stoneAt(i, t);
      const [sx, sy, s] = this.project(x, y, z);
      const b = buf[i]!;
      b.sx = sx;
      b.sy = sy;
      b.r = STONE_R * s;
      b.z = z;
      b.hot = flying;
      if (flying) {
        const [hx, hy] = this.project(x, y, 0);
        ctx.beginPath();
        ctx.ellipse(hx, hy, b.r * 1.1, b.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = css(pal.shadow, Math.max(0, 0.3 - z * 0.12));
        ctx.fill();
      }
    }
    this.order.sort((a, b) => buf[a]!.sy + buf[a]!.z * 30 - (buf[b]!.sy + buf[b]!.z * 30));
    const night = pal.mode === "night";
    for (const id of this.order) {
      const b = buf[id]!;
      const d = b.r * 2;
      if (night) {
        ctx.globalCompositeOperation = "lighter";
        const gr = b.r * 4.2;
        ctx.globalAlpha = b.hot ? 0.75 : 0.28;
        ctx.drawImage(b.hot ? sp.hotGlow : sp.glow, b.sx - gr, b.sy - gr, gr * 2, gr * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
      ctx.drawImage(b.hot ? sp.hot : sp.stone, b.sx - b.r, b.sy - b.r, d, d);
    }

    // ночью наш казан светится тем ярче, чем он полнее
    if (night) {
      const n = countUpTo(tl.k0, t);
      if (n > 0) {
        const [cx, cy] = this.project(KAZAN_X, 0, 0);
        const e = this.ellipse(KAZAN_X, 0, KAZAN_HALF);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.min(0.5, n / 160);
        ctx.drawImage(sp.glow, cx - e.rx * 1.2, cy - e.ry * 1.6, e.rx * 2.4, e.ry * 3.2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }
    }
  }

  /** Номер нашей лунки под точкой экрана или -1 */
  hit(x: number, y: number) {
    for (let r = 0; r < PER_SIDE; r++) {
      const [hx, hy] = holeXY(r);
      const e = this.ellipse(hx, hy, HOLE_R * 1.15);
      const dx = (x - e.cx) / e.rx;
      const dy = (y - e.cy) / e.ry;
      if (dx * dx + dy * dy <= 1) return r;
    }
    return -1;
  }

  /** Время, когда наша лунка r получила первый коргоол стратегии */
  litAt(r: number) {
    return this.tl.lit[r] ?? Infinity;
  }
}
