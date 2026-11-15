/**
 * Главный объект варианта 12: рельеф Кыргызстана линиями хребтов (Canvas 2D) и весть, которая расходится от Бишкека.
 *
 * Смысл движения:
 * - круги от флажка в Бишкеке: жарчы объявляет, «жар салуу»;
 * - линии хребтов перекрашиваются там, куда дошла весть; айылы загораются по очереди, от соседа к соседу,
 *   через перевалы медленнее, чем по долинам;
 * - в конце отклики бегут по тем же дорогам обратно в Бишкек: это заявка.
 *
 * Производительность: высоты считаются один раз в сетку; рельеф рисуется в два внеэкранных холста (до вести и после)
 * только при изменении размера или стиля. В кадре только склейка двух картинок, точки и линии.
 */
import { BOUNDS, COS_LAT, ISSYK_KUL, KG_BORDER, MAP_H, MAP_W, buildNetwork, elevation, groundTexture, inLake, inPoly, type Node } from "./geo";
import type { Lang } from "@/content/kurak";

type Palette = {
  bg: string;
  lineOut: string;
  lineIn: string;
  lineLit: string;
  lake: string;
  lakeLit: string;
  dot: string;
  lit: string;
  glow: string;
  edge: string;
  label: string;
  halo: string;
  signal: string;
  flag: string;
};

export type ReliefState = { heard: number; total: number; replied: number; stage: 0 | 1 | 2 | 3 };

/* ---------- Сетка высот: общая для всех экземпляров, считается один раз ---------- */
const GRID = { lon0: 67.5, lon1: 82.5, lat0: 46.5, lat1: 37.0, step: 0.05 };
let gridCache: { w: number; h: number; data: Float32Array } | null = null;

function grid() {
  if (gridCache) return gridCache;
  const w = Math.round((GRID.lon1 - GRID.lon0) / GRID.step) + 1;
  const h = Math.round((GRID.lat0 - GRID.lat1) / GRID.step) + 1;
  const data = new Float32Array(w * h);
  for (let j = 0; j < h; j++) {
    const lat = GRID.lat0 - j * GRID.step;
    for (let i = 0; i < w; i++) data[j * w + i] = elevation(GRID.lon0 + i * GRID.step, lat);
  }
  gridCache = { w, h, data };
  return gridCache;
}

function elevAt(lon: number, lat: number) {
  const g = grid();
  const fx = (lon - GRID.lon0) / GRID.step;
  const fy = (GRID.lat0 - lat) / GRID.step;
  // далеко за рамкой сетки (верх экрана на телефоне): просто равнина с фактурой
  if (fx < 0 || fy < 0 || fx > g.w - 1.001 || fy > g.h - 1.001) return groundTexture(lon, lat);
  const i = Math.floor(fx);
  const j = Math.floor(fy);
  const u = fx - i;
  const v = fy - j;
  const d = g.data;
  const a = d[j * g.w + i]!;
  const b = d[j * g.w + i + 1]!;
  const c = d[(j + 1) * g.w + i]!;
  const e = d[(j + 1) * g.w + i + 1]!;
  return a + (b - a) * u + (c - a) * v + (a - b - c + e) * u * v;
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => x * x * (3 - 2 * x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Флажок источника: фигура K из знака KURAK (блок с V-вырезом) */
const FLAG = [
  [0, 0],
  [82, 0],
  [52, 43.25],
  [82, 86.5],
  [0, 86.5],
] as const;

export class Relief {
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private bdpr = 1;
  private Z = 1;
  private S = 1;
  private SQ = 0.72;
  private ox = 0;
  private oy = 0;
  private A = 40;
  private mobile = false;
  private focusY = 0;
  private pal!: Palette;
  private base: HTMLCanvasElement | null = null;
  private lit: HTMLCanvasElement | null = null;
  private glow: HTMLCanvasElement | null = null;
  private nodes: Node[] = [];
  private villages = 0;
  private runners: { path: number[]; delay: number }[] = [];
  private tFergana = 0.7;
  private T = 0;
  private target = 0;
  private raf = 0;
  private last = 0;
  private visible = true;
  private running = false;
  private animated = true;
  private state: ReliefState = { heard: 0, total: 0, replied: 0, stage: 0 };
  private font = "sans-serif";

  constructor(
    private canvas: HTMLCanvasElement,
    private host: HTMLElement,
    private lang: Lang,
    private onState: (s: ReliefState) => void,
    /** Нижний край текста над картой (px от верха холста): карта начинается ниже */
    private safeTop: (mobile: boolean) => number = () => 0,
  ) {
    this.ctx = canvas.getContext("2d")!;
  }

  /** Пересчитать размеры, сеть и рельеф. Вызывать при монтировании и после ресайза */
  layout() {
    const r = this.canvas.getBoundingClientRect();
    this.W = Math.max(1, Math.round(r.width));
    this.H = Math.max(1, Math.round(r.height));
    this.mobile = this.W < 720;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.Z = this.mobile ? 1.75 : 1;
    this.bdpr = this.mobile ? Math.min(1.5, this.dpr) : this.dpr;
    this.SQ = this.mobile ? 0.86 : 0.72;
    this.canvas.width = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);

    // рамка карты на экране: на телефоне полоса между заголовком и подписями
    const box = this.mobile
      ? { l: this.W * 0.04, r: this.W * 0.88, t: this.H * 0.43, b: this.H * 0.66 }
      : { l: this.W * 0.035, r: this.W * 0.965, t: this.H * 0.33, b: this.H * 0.9 };
    // заголовок бывает в три строки (кыргызский): не даём карте залезть под него
    box.t = Math.max(box.t, this.safeTop(this.mobile) + (this.mobile ? 10 : 36));
    box.b = Math.max(box.b, box.t + this.H * (this.mobile ? 0.2 : 0.42));
    this.S = Math.min((box.r - box.l) / MAP_W, (box.b - box.t) / (MAP_H * this.SQ));
    this.ox = box.l + (box.r - box.l - MAP_W * this.S) / 2;
    this.oy = box.t + (box.b - box.t - MAP_H * this.S * this.SQ) / 2;
    this.focusY = (box.t + box.b) / 2;

    const villages = this.mobile ? 150 : this.W < 1100 ? 220 : 300;
    if (villages !== this.villages) {
      this.villages = villages;
      this.nodes = buildNetwork(villages);
      this.pickRunners();
      const fer = this.nodes.filter((n) => n.city && ["osh", "jalalabad", "batken", "talas", "uzgen"].includes(n.city.id));
      this.tFergana = Math.min(...fer.map((n) => n.t));
    }
    this.font = getComputedStyle(this.host).getPropertyValue("--v12-map-font").trim() || "sans-serif";
    this.paint();
  }

  /** Перечитать палитру из CSS-токенов и перерисовать рельеф */
  paint() {
    const cs = getComputedStyle(this.host);
    const v = (k: string) => cs.getPropertyValue(`--map-${k}`).trim();
    this.pal = {
      bg: v("bg"),
      lineOut: v("line-out"),
      lineIn: v("line-in"),
      lineLit: v("line-lit"),
      lake: v("lake"),
      lakeLit: v("lake-lit"),
      dot: v("dot"),
      lit: v("lit"),
      glow: v("glow"),
      edge: v("edge"),
      label: v("label"),
      halo: v("halo"),
      signal: v("signal"),
      flag: v("flag"),
    };
    const [base, lit] = this.terrain();
    this.base = base;
    this.lit = lit;
    this.glow = this.makeGlow();
    this.draw();
  }

  setAnimated(on: boolean) {
    this.animated = on;
    if (!on) {
      this.T = this.target = 1;
      this.draw();
    }
  }

  setTarget(p: number) {
    this.target = clamp01(p);
    this.kick();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.kick();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.running = false;
    this.base = this.lit = this.glow = null;
  }

  /* ---------------- рельеф ---------------- */

  /** Рельеф в двух версиях за один проход: до вести и после (хребты страны перекрашены) */
  private terrain(): [HTMLCanvasElement, HTMLCanvasElement] {
    const Z = this.Z;
    const bw = this.W * Z;
    const bh = this.H * Z;
    const p = this.pal;
    const make = () => {
      const cv = document.createElement("canvas");
      cv.width = Math.round(bw * this.bdpr);
      cv.height = Math.round(bh * this.bdpr);
      const g = cv.getContext("2d")!;
      g.scale(this.bdpr, this.bdpr);
      g.fillStyle = p.bg;
      g.fillRect(0, 0, bw, bh);
      g.lineJoin = "round";
      return { cv, g };
    };
    const A = make();
    const B = make();

    const gap = this.mobile ? 8.5 : 7; // шаг строк в пикселях битмапа
    const amp = gap * (this.mobile ? 7 : 8.6);
    this.A = amp;
    const step = this.mobile ? 3 : 2.5;
    const rows = Math.ceil(bh / gap) + Math.ceil((amp * 1.5) / gap);
    const xs: number[] = [];
    for (let x = -step; x <= bw + step; x += step) xs.push(x);
    const n = xs.length;
    const ys = new Float32Array(n);
    const fl = new Uint8Array(n);
    const lwOut = this.mobile ? 0.8 : 0.9;
    const lwIn = this.mobile ? 1.2 : 1.35;
    const line = (g: CanvasRenderingContext2D) => {
      g.beginPath();
      for (let k = 0; k < n; k++) (k ? g.lineTo : g.moveTo).call(g, xs[k]!, ys[k]!);
    };
    const runs = (g: CanvasRenderingContext2D, want: number) => {
      g.beginPath();
      let open = false;
      for (let k = 0; k < n; k++) {
        if (fl[k] === want) {
          if (open) g.lineTo(xs[k]!, ys[k]!);
          else g.moveTo(xs[k]!, ys[k]!);
          open = true;
        } else open = false;
      }
    };

    for (let r = 0; r < rows; r++) {
      const y0 = r * gap;
      const lat = BOUNDS.lat0 - (y0 / Z - this.oy) / (this.S * this.SQ);
      let any = false;
      for (let k = 0; k < n; k++) {
        const lon = BOUNDS.lon0 + (xs[k]! / Z - this.ox) / (COS_LAT * this.S);
        ys[k] = y0 - elevAt(lon, lat) * amp;
        const near = lat > 39 && lat < 43.5 && lon > 69.2 && lon < 80.5;
        fl[k] = near ? (inLake(lon, lat) ? 2 : inPoly(lon, lat, KG_BORDER) ? 1 : 0) : 0;
        if (fl[k]) any = true;
      }
      for (const [g, litVersion] of [[A.g, false], [B.g, true]] as const) {
        // закрываем то, что позади строки
        g.beginPath();
        g.moveTo(xs[0]!, y0 + 1);
        for (let k = 0; k < n; k++) g.lineTo(xs[k]!, ys[k]!);
        g.lineTo(xs[n - 1]!, y0 + 1);
        g.closePath();
        g.fillStyle = p.bg;
        g.fill();
        // вся строка тонко: земля за границей
        line(g);
        g.strokeStyle = p.lineOut;
        g.lineWidth = lwOut;
        g.stroke();
        if (!any) continue;
        // страна и озёра поверх
        runs(g, 1);
        g.strokeStyle = litVersion ? p.lineLit : p.lineIn;
        g.lineWidth = lwIn;
        g.stroke();
        runs(g, 2);
        g.strokeStyle = litVersion ? p.lakeLit : p.lake;
        g.lineWidth = lwIn;
        g.setLineDash([3, 3]);
        g.stroke();
        g.setLineDash([]);
      }
    }
    return [A.cv, B.cv];
  }

  private makeGlow() {
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const g = cv.getContext("2d")!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, this.pal.glow);
    grad.addColorStop(1, "transparent");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return cv;
  }

  /** Отклики: из дальних айылов по цепочке соседей обратно к Бишкеку */
  private pickRunners() {
    const order = this.nodes
      .map((n, i) => ({ n, i }))
      .filter((x) => x.i > 0 && x.n.parent >= 0)
      .sort((a, b) => b.n.t - a.n.t);
    const want = this.mobile ? 26 : 44;
    const stride = Math.max(1, Math.floor(order.length / want));
    this.runners = [];
    for (let k = 0; k < order.length && this.runners.length < want; k += stride) {
      const path: number[] = [];
      let i = order[k]!.i;
      let guard = 0;
      while (i >= 0 && guard++ < 400) {
        path.push(i);
        i = this.nodes[i]!.parent;
      }
      this.runners.push({ path, delay: (this.runners.length % 9) * 0.045 + (k / order.length) * 0.08 });
    }
  }

  /* ---------------- камера и проекция ---------------- */

  /** Камера: на телефоне идёт за вестью (Бишкек → Иссык-Куль → центр → Ош), в конце показывает всю страну */
  private camera(T: number) {
    if (this.Z === 1) return { x: 0, y: 0, k: 1 };
    const pts: [number, number, number, number][] = [
      // T, долгота, широта, увеличение (доля от Z): 0 = вся страна
      [0, 75.0, 41.3, 0],
      [0.1, 74.9, 42.55, 1],
      [0.3, 76.6, 42.3, 1],
      [0.5, 75.0, 41.6, 0.86],
      [0.68, 72.7, 40.55, 1],
      [0.8, 75.0, 41.3, 0],
      [1, 75.0, 41.3, 0],
    ];
    let a = pts[0]!;
    let b = pts[pts.length - 1]!;
    for (let i = 0; i < pts.length - 1; i++) {
      if (T >= pts[i]![0] && T <= pts[i + 1]![0]) {
        a = pts[i]!;
        b = pts[i + 1]!;
        break;
      }
    }
    const t = smooth(clamp01((T - a[0]) / (b[0] - a[0] || 1)));
    const lon = lerp(a[1], b[1], t);
    const lat = lerp(a[2], b[2], t);
    const zf = lerp(a[3], b[3], t);
    const z = 1 + (this.Z - 1) * zf; // 1 = вся страна, Z = ближе всего
    const bx = this.Z * (this.ox + (lon - BOUNDS.lon0) * COS_LAT * this.S);
    const by = this.Z * (this.oy + (BOUNDS.lat0 - lat) * this.S * this.SQ);
    const w = (this.W * this.Z) / z;
    const h = (this.H * this.Z) / z;
    let x = bx - (this.W / 2) * (this.Z / z);
    let y = by - this.focusY * (this.Z / z);
    x = Math.max(0, Math.min(this.W * this.Z - w, x));
    y = Math.max(0, Math.min(this.H * this.Z - h, y));
    return { x, y, k: z / this.Z };
  }

  /** Точка на поверхности рельефа в координатах битмапа */
  private bpos(n: { lon: number; lat: number }) {
    const e = elevAt(n.lon, n.lat);
    return {
      x: this.Z * (this.ox + (n.lon - BOUNDS.lon0) * COS_LAT * this.S),
      y: this.Z * (this.oy + (BOUNDS.lat0 - n.lat) * this.S * this.SQ) - e * this.A,
    };
  }

  /* ---------------- кадр ---------------- */

  private kick() {
    if (this.running || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const d = this.target - this.T;
    this.T = Math.abs(d) < 0.0004 ? this.target : this.T + d * (1 - Math.exp(-dt * 7));
    this.draw(now);
    // крутимся, пока догоняем прокрутку, или пока в начале зовёт флажок
    const idle = this.T === this.target && this.T > 0.02 && this.T < 0.999;
    if (this.visible && this.animated && !idle) this.raf = requestAnimationFrame(this.tick);
    else this.running = false;
  };

  private draw(now = performance.now()) {
    if (!this.base || !this.lit) return;
    const g = this.ctx;
    const p = this.pal;
    const T = this.T;
    const propRaw = (T - 0.05) / 0.66; // может быть больше 1: так у поздних айылов круги успевают погаснуть
    const prop = clamp01(propRaw);
    const resp = this.animated ? clamp01((T - 0.76) / 0.22) : 1;
    const cam = this.camera(T);
    const k = cam.k; // экран = (битмап - сдвиг) * k
    const sx = (x: number) => (x - cam.x) * k;
    const sy = (y: number) => (y - cam.y) * k;

    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    g.clearRect(0, 0, this.W, this.H);
    const src = (img: HTMLCanvasElement) =>
      g.drawImage(img, cam.x * this.bdpr, cam.y * this.bdpr, (this.W / k) * this.bdpr, (this.H / k) * this.bdpr, 0, 0, this.W, this.H);
    src(this.base);

    // область, куда дошла весть: хребты перекрашиваются
    const reach = 0.24 * this.S; // радиус «услышавшей» округи вокруг айыла, в градусах широты
    const pos = this.nodes.map((n) => this.bpos(n));
    let heard = 0;
    g.save();
    g.beginPath();
    this.nodes.forEach((n, i) => {
      if (n.t > prop) return;
      heard++;
      const age = clamp01((propRaw - n.t) / 0.09);
      const rr = reach * (0.35 + 0.65 * smooth(age)) * (n.city?.rank === 1 ? 1.5 : 1) * k * this.Z;
      const q = pos[i]!;
      g.moveTo(sx(q.x) + rr, sy(q.y));
      g.arc(sx(q.x), sy(q.y), rr, 0, Math.PI * 2);
    });
    g.clip();
    src(this.lit);
    g.restore();

    // дороги вести: от соседа к соседу
    g.lineWidth = 1;
    g.strokeStyle = p.edge;
    g.beginPath();
    this.nodes.forEach((n, i) => {
      if (n.parent < 0) return;
      const a = this.nodes[n.parent]!;
      if (a.t > prop) return;
      const u = clamp01((prop - a.t) / Math.max(0.004, n.t - a.t));
      const qa = pos[n.parent]!;
      const qb = pos[i]!;
      g.moveTo(sx(qa.x), sy(qa.y));
      g.lineTo(sx(lerp(qa.x, qb.x, u)), sy(lerp(qa.y, qb.y, u)));
    });
    g.stroke();

    // айылы
    const dotR = this.mobile ? 1.3 : 1.5;
    this.nodes.forEach((n, i) => {
      const q = pos[i]!;
      const x = sx(q.x);
      const y = sy(q.y);
      if (x < -20 || y < -20 || x > this.W + 20 || y > this.H + 20) return;
      const big = n.city ? (n.city.rank === 1 ? 2.2 : n.city.rank === 2 ? 1.6 : 1.25) : 1;
      if (n.t > prop) {
        g.fillStyle = p.dot;
        g.beginPath();
        g.arc(x, y, dotR * big * 0.8, 0, Math.PI * 2);
        g.fill();
        return;
      }
      const age = Math.max(0, (propRaw - n.t) / 0.05);
      if (this.glow) {
        const gs = (n.city ? 26 : 16) * big * 0.7;
        g.globalAlpha = 0.85;
        g.drawImage(this.glow, x - gs / 2, y - gs / 2, gs, gs);
        g.globalAlpha = 1;
      }
      // круг-отклик в момент, когда весть дошла
      if (this.animated && age < 1) {
        g.strokeStyle = p.lit;
        g.globalAlpha = 1 - age;
        g.lineWidth = 1.2;
        g.beginPath();
        g.arc(x, y, 3 + age * (n.city ? 22 : 12), 0, Math.PI * 2);
        g.stroke();
        g.globalAlpha = 1;
      }
      g.fillStyle = p.lit;
      g.beginPath();
      g.arc(x, y, dotR * big * 1.25, 0, Math.PI * 2);
      g.fill();
    });

    // флажок Бишкека зовёт: круги «жар»
    const root = pos[0]!;
    const rx = sx(root.x);
    const ry = sy(root.y);
    const callRings = (phase: number, alpha: number) => {
      for (let j = 0; j < 3; j++) {
        const f = (phase + j / 3) % 1;
        g.strokeStyle = p.lit;
        g.globalAlpha = alpha * (1 - f);
        g.lineWidth = 1.5;
        g.beginPath();
        g.ellipse(rx, ry, 8 + f * 120, (8 + f * 120) * this.SQ, 0, 0, Math.PI * 2);
        g.stroke();
      }
      g.globalAlpha = 1;
    };
    if (this.animated && T < 0.12) callRings((now / 2600) % 1, 1 - T / 0.12);

    // отклики возвращаются в Бишкек
    let replied = 0;
    if (resp > 0) {
      g.fillStyle = p.signal;
      for (const run of this.runners) {
        const u = smooth(clamp01((resp - run.delay) / 0.55));
        if (u >= 1) {
          replied++;
          continue;
        }
        if (u <= 0) continue;
        const pts = run.path.map((i) => pos[i]!);
        const at = (f: number) => {
          const s = f * (pts.length - 1);
          const i = Math.min(pts.length - 2, Math.floor(s));
          const t = s - i;
          return { x: lerp(pts[i]!.x, pts[i + 1]!.x, t), y: lerp(pts[i]!.y, pts[i + 1]!.y, t) };
        };
        for (let tr = 0; tr < 4; tr++) {
          const q = at(Math.max(0, u - tr * 0.018));
          g.globalAlpha = 1 - tr * 0.24;
          g.beginPath();
          g.arc(sx(q.x), sy(q.y), (this.mobile ? 2 : 2.4) - tr * 0.35, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.globalAlpha = 1;
      if (this.animated && resp < 1) callRings((now / 1400) % 1, 0.35 * resp);
    }

    // подписи городов, куда дошла весть
    g.textBaseline = "middle";
    g.lineJoin = "round";
    this.nodes.forEach((n, i) => {
      if (!n.city || n.t > prop) return;
      if (n.city.rank !== 1) return; // мелкие города без подписей: иначе они спорят с текстом
      if (i === 0) return;
      const q = pos[i]!;
      const fade = this.animated ? clamp01((propRaw - n.t) / 0.04) : 1;
      g.globalAlpha = fade;
      g.font = `600 ${this.mobile ? 12 : 13}px ${this.font}`;
      const text = n.city.name[this.lang];
      const x = sx(q.x) + 7;
      const y = sy(q.y) - 8;
      g.strokeStyle = p.halo;
      g.lineWidth = 4;
      g.strokeText(text, x, y);
      g.fillStyle = p.label;
      g.fillText(text, x, y);
      g.globalAlpha = 1;
    });

    // флажок KURAK над Бишкеком: источник вести
    const fh = this.mobile ? 20 : 24;
    const fw = (fh * 82) / 86.5;
    const poleH = fh * 1.55;
    const wave = this.animated ? Math.sin(now / 420) * 0.06 : 0;
    g.strokeStyle = p.label;
    g.lineWidth = 1.5;
    g.beginPath();
    g.moveTo(rx, ry);
    g.lineTo(rx, ry - poleH);
    g.stroke();
    g.fillStyle = p.flag;
    g.beginPath();
    FLAG.forEach(([fx, fy], j) => {
      const X = rx + (fx / 82) * fw;
      const Y = ry - poleH + (fy / 86.5) * fh + Math.sin((fx / 82) * Math.PI) * wave * fh;
      if (j) g.lineTo(X, Y);
      else g.moveTo(X, Y);
    });
    g.closePath();
    g.fill();
    g.font = `700 ${this.mobile ? 13 : 15}px ${this.font}`;
    const bt = this.nodes[0]!.city!.name[this.lang];
    g.strokeStyle = p.halo;
    g.lineWidth = 4;
    g.strokeText(bt, rx + fw + 6, ry - poleH + fh * 0.35);
    g.fillStyle = p.label;
    g.fillText(bt, rx + fw + 6, ry - poleH + fh * 0.35);
    g.fillStyle = p.lit;
    g.beginPath();
    g.arc(rx, ry, 3.2, 0, Math.PI * 2);
    g.fill();

    // состояние для счётчика и подписей
    const stage: ReliefState["stage"] = resp > 0 ? 3 : prop >= this.tFergana - 0.01 ? 2 : prop > 0.015 ? 1 : 0;
    const next: ReliefState = { heard: Math.max(1, heard), total: this.nodes.length, replied, stage };
    if (next.heard !== this.state.heard || next.replied !== this.state.replied || next.stage !== this.state.stage || next.total !== this.state.total) {
      this.state = next;
      this.onState(next);
    }
  }
}

/** Контур страны и Иссык-Куля для SVG-подложки без JS (та же проекция, без высот) */
export function outlinePaths(sq: number) {
  const P = (pts: [number, number][]) =>
    "M" + pts.map(([lon, lat]) => `${((lon - BOUNDS.lon0) * COS_LAT).toFixed(3)} ${((BOUNDS.lat0 - lat) * sq).toFixed(3)}`).join("L") + "Z";
  return { border: P(KG_BORDER), lake: P(ISSYK_KUL), w: MAP_W, h: MAP_H * sq };
}

export function projectFlat(lon: number, lat: number, sq: number) {
  return { x: (lon - BOUNDS.lon0) * COS_LAT, y: (BOUNDS.lat0 - lat) * sq };
}
