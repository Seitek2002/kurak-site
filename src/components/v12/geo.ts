/**
 * Стилизованная география Кыргызстана для главного объекта варианта 12.
 * Не карта: граница упрощена (около 35 точек, по контуру Natural Earth 1:110m), хребты, озёра и высоты
 * нарисованы вручную по памяти, чтобы рельеф был узнаваем (Ала-Тоо, Иссык-Куль, Фергана), а не точен.
 * Всё в градусах: [долгота, широта].
 */
import type { T } from "@/content/kurak";

export type LonLat = [number, number];

/** Граница Кыргызстана, по часовой стрелке от запада Таласа */
export const KG_BORDER: LonLat[] = [
  [70.96, 42.27], [71.19, 42.7], [71.84, 42.85], [73.49, 42.5], [73.65, 43.09], [74.21, 43.3],
  [75.64, 42.88], [76.0, 42.99], [77.66, 42.96], [79.14, 42.86], [79.64, 42.5], [80.26, 42.35],
  [80.12, 42.12], [78.54, 41.58], [78.19, 41.19], [76.9, 41.07], [76.53, 40.43], [75.47, 40.56],
  [74.78, 40.37], [73.82, 39.89], [73.96, 39.66], [73.68, 39.43], [71.78, 39.28], [70.55, 39.6],
  [69.46, 39.53], [69.56, 40.1], [70.65, 39.94], [71.01, 40.24], [71.77, 40.15], [73.06, 40.87],
  [71.87, 41.39], [71.16, 41.14], [70.42, 41.52], [71.26, 42.17],
];

/** Иссык-Куль: вытянутый с запада на восток, Балыкчы на западном конце, Каракол у восточного */
export const ISSYK_KUL: LonLat[] = [
  [76.18, 42.43], [76.35, 42.55], [76.7, 42.63], [77.1, 42.67], [77.5, 42.71], [77.9, 42.72],
  [78.2, 42.67], [78.36, 42.57], [78.26, 42.47], [77.95, 42.38], [77.55, 42.27], [77.15, 42.18],
  [76.75, 42.2], [76.45, 42.28], [76.25, 42.36],
];

/** Малые озёра и водохранилище: Сон-Куль, Чатыр-Куль, Токтогульское */
export const SMALL_LAKES: { c: LonLat; rx: number; ry: number }[] = [
  { c: [75.12, 41.84], rx: 0.17, ry: 0.07 },
  { c: [75.3, 40.6], rx: 0.13, ry: 0.05 },
  { c: [72.88, 41.78], rx: 0.16, ry: 0.05 },
];

/** Хребты: ломаная по гребню, высота (0..1.3) и полуширина в градусах */
const RANGES: { p: LonLat[]; h: number; w: number }[] = [
  { p: [[72.2, 42.42], [73.4, 42.55], [74.6, 42.62], [75.7, 42.6]], h: 0.95, w: 0.17 }, // Кыргызский Ала-Тоо
  { p: [[70.9, 42.08], [71.8, 42.24], [72.8, 42.3], [73.6, 42.2]], h: 0.85, w: 0.14 }, // Таласский Ала-Тоо
  { p: [[70.4, 41.42], [71.0, 41.72], [71.7, 42.02]], h: 0.72, w: 0.14 }, // Чаткальский
  { p: [[73.1, 41.68], [73.6, 41.2], [74.2, 40.82], [74.9, 40.5]], h: 0.85, w: 0.14 }, // Ферганский
  { p: [[69.6, 39.86], [70.8, 39.76], [72.0, 39.76], [73.4, 39.86]], h: 0.95, w: 0.16 }, // Алайский
  { p: [[72.0, 39.36], [72.9, 39.36], [73.8, 39.46]], h: 1.15, w: 0.12 }, // Заалайский
  { p: [[75.9, 42.86], [76.8, 42.86], [77.7, 42.93], [78.7, 42.95]], h: 0.85, w: 0.11 }, // Кунгей Ала-Тоо
  { p: [[76.2, 42.08], [77.0, 41.98], [77.9, 42.12], [78.8, 42.22], [79.5, 42.28]], h: 0.95, w: 0.12 }, // Терскей Ала-Тоо
  { p: [[75.4, 40.62], [76.6, 40.76], [77.8, 41.06], [78.9, 41.6], [79.9, 42.05]], h: 1.05, w: 0.14 }, // Кокшаал-Тоо
  { p: [[79.6, 42.1], [80.15, 42.16]], h: 1.3, w: 0.16 }, // массив Хан-Тенгри и Жеңиш-Чокусу
  { p: [[75.2, 40.95], [76.2, 41.06], [77.0, 41.22]], h: 0.75, w: 0.1 }, // Ат-Башы
  { p: [[74.6, 41.68], [75.45, 41.64]], h: 0.6, w: 0.09 }, // Молдо-Тоо
  { p: [[73.4, 42.05], [74.5, 42.1], [75.4, 42.05]], h: 0.68, w: 0.1 }, // Суусамыр-Тоо, Жумгал-Тоо
  { p: [[75.6, 41.36], [76.6, 41.5], [77.5, 41.7]], h: 0.7, w: 0.1 }, // Нарын-Тоо
  { p: [[76.4, 41.78], [77.4, 41.86], [78.2, 41.8]], h: 0.62, w: 0.12 }, // центральные хребты
];

export type City = { id: string; at: LonLat; name: T; rank: 1 | 2 | 3 };

const c = (id: string, lon: number, lat: number, ru: string, ky: string, rank: 1 | 2 | 3): City => ({
  id,
  at: [lon, lat],
  name: { ru, ky },
  rank,
});

/** Города и крупные сёла. Бишкек первый: от него идёт весть */
export const CITIES: City[] = [
  c("bishkek", 74.59, 42.87, "Бишкек", "Бишкек", 1),
  c("osh", 72.8, 40.53, "Ош", "Ош", 1),
  c("jalalabad", 73.0, 40.94, "Жалал-Абад", "Жалал-Абад", 1),
  c("karakol", 78.39, 42.49, "Каракол", "Каракол", 1),
  c("naryn", 75.99, 41.43, "Нарын", "Нарын", 1),
  c("talas", 72.24, 42.52, "Талас", "Талас", 1),
  c("batken", 70.82, 40.06, "Баткен", "Баткен", 1),
  c("tokmok", 75.29, 42.84, "Токмок", "Токмок", 2),
  c("balykchy", 76.18, 42.46, "Балыкчы", "Балыкчы", 2),
  c("cholponata", 77.08, 42.65, "Чолпон-Ата", "Чолпон-Ата", 2),
  c("karabalta", 73.85, 42.81, "Кара-Балта", "Кара-Балта", 2),
  c("kyzylkiya", 72.13, 40.26, "Кызыл-Кыя", "Кызыл-Кыя", 2),
  c("uzgen", 73.3, 40.77, "Узген", "Өзгөн", 2),
  c("toktogul", 72.94, 41.87, "Токтогул", "Токтогул", 2),
  c("kochkor", 75.78, 42.21, "Кочкор", "Кочкор", 2),
  c("kazarman", 74.04, 41.4, "Казарман", "Казарман", 2),
  c("atbashy", 75.8, 41.17, "Ат-Башы", "Ат-Башы", 2),
  c("sarytash", 73.25, 39.73, "Сары-Таш", "Сары-Таш", 3),
  c("bokonbaevo", 76.99, 42.12, "Боконбаево", "Бөкөнбаев", 3),
  c("tashkumyr", 72.22, 41.35, "Таш-Кумыр", "Таш-Көмүр", 3),
  c("kerben", 71.75, 41.5, "Кербен", "Кербен", 3),
  c("kant", 74.85, 42.89, "Кант", "Кант", 3),
  c("kemin", 75.69, 42.78, "Кемин", "Кемин", 3),
  c("isfana", 69.53, 39.84, "Исфана", "Исфана", 3),
  c("sulukta", 69.57, 39.93, "Сулюкта", "Сүлүктү", 3),
  c("mailuusuu", 72.45, 41.27, "Майлуу-Суу", "Майлуу-Суу", 3),
  c("chaek", 74.5, 41.93, "Чаек", "Чаек", 3),
  c("nookat", 72.62, 40.27, "Ноокат", "Ноокат", 3),
  c("gulcha", 73.45, 40.32, "Гульча", "Гүлчө", 3),
  c("tyup", 78.36, 42.73, "Тюп", "Түп", 3),
  c("kyzyladyr", 71.59, 42.62, "Кызыл-Адыр", "Кызыл-Адыр", 3),
  c("suusamyr", 73.95, 42.18, "Суусамыр", "Суусамыр", 3),
];

/* ------------------------------------------------------------------ */
/* Проекция: «вид с юга», север наверху, долгота сжата по широте       */
/* ------------------------------------------------------------------ */

export const COS_LAT = 0.75; // cos(41.5°)
/** Рамка страны в градусах: по ней вписываем карту в экран */
export const BOUNDS = { lon0: 69.46, lon1: 80.26, lat0: 43.3, lat1: 39.28 };
export const MAP_W = (BOUNDS.lon1 - BOUNDS.lon0) * COS_LAT; // ширина страны в условных единицах
export const MAP_H = BOUNDS.lat0 - BOUNDS.lat1;

/* ------------------------------------------------------------------ */
/* Геометрия                                                           */
/* ------------------------------------------------------------------ */

export function inPoly(lon: number, lat: number, poly: LonLat[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]!;
    const [xj, yj] = poly[j]!;
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function inLake(lon: number, lat: number) {
  if (inPoly(lon, lat, ISSYK_KUL)) return true;
  for (const l of SMALL_LAKES) {
    const dx = (lon - l.c[0]) / l.rx;
    const dy = (lat - l.c[1]) / l.ry;
    if (dx * dx + dy * dy < 1) return true;
  }
  return false;
}

/** Расстояние от точки до отрезка в «плоских» градусах (долгота сжата) */
function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const vx = bx - ax;
  const vy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy || 1)));
  const dx = px - (ax + vx * t);
  const dy = py - (ay + vy * t);
  return Math.hypot(dx, dy);
}

/* Value noise: дешёвый, детерминированный */
function hash(i: number, j: number) {
  let h = (i * 374761393 + j * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c2 = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c2 - a) * v + (a - b - c2 + d) * u * v;
}
function fbm(x: number, y: number) {
  return noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;
}

/** Равнина за пределами сетки высот: только мелкая фактура */
export function groundTexture(lon: number, lat: number) {
  return 0.02 + 0.1 * fbm(lon * 7, lat * 7);
}

/** Высота 0..~1.4 в точке. Внутри страны рельеф выше, снаружи приглушён: страна «поднимается» над соседями */
export function elevation(lon: number, lat: number) {
  if (inLake(lon, lat)) return 0.02;
  const x = lon * COS_LAT;
  let e = 0;
  for (const r of RANGES) {
    let d = Infinity;
    for (let k = 0; k < r.p.length - 1; k++) {
      const a = r.p[k]!;
      const b = r.p[k + 1]!;
      d = Math.min(d, segDist(x, lat, a[0] * COS_LAT, a[1], b[0] * COS_LAT, b[1]));
    }
    const g = Math.exp(-((d / r.w) ** 2));
    e += r.h * g * (0.62 + 0.62 * noise(lon * 4.2, lat * 4.2));
  }
  e = 1.35 * (1 - Math.exp(-e / 1.1)); // мягкое насыщение там, где хребты сходятся
  const inside = inPoly(lon, lat, KG_BORDER);
  const tex = fbm(lon * 7, lat * 7);
  return inside ? 0.06 + e + 0.16 * tex * (0.35 + e) : 0.02 + 0.35 * e + 0.1 * tex;
}

/* ------------------------------------------------------------------ */
/* Сеть: айылы и города, по которым идёт весть                         */
/* ------------------------------------------------------------------ */

export type Node = {
  lon: number;
  lat: number;
  e: number;
  city?: City;
  /** Когда до точки доходит весть, 0..1 */
  t: number;
  parent: number;
};

function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Строит сеть: города + случайные (но детерминированные) айылы, гуще в долинах.
 * Время прихода вести считается кратчайшим путём от Бишкека по соседям: через хребты весть идёт дольше.
 */
export function buildNetwork(villages: number): Node[] {
  const rnd = prng(1207);
  const nodes: Node[] = CITIES.map((city) => ({ lon: city.at[0], lat: city.at[1], e: elevation(city.at[0], city.at[1]), city, t: 1, parent: -1 }));
  let guard = 0;
  while (nodes.length < CITIES.length + villages && guard++ < villages * 60) {
    const lon = BOUNDS.lon0 + rnd() * (BOUNDS.lon1 - BOUNDS.lon0);
    const lat = BOUNDS.lat1 + rnd() * (BOUNDS.lat0 - BOUNDS.lat1);
    if (!inPoly(lon, lat, KG_BORDER) || inLake(lon, lat)) continue;
    const e = elevation(lon, lat);
    const p = Math.max(0.03, 1 - e / 0.75) ** 2.2;
    if (rnd() > p) continue;
    // не ставим точки вплотную друг к другу
    let tooClose = false;
    for (const n of nodes) {
      if (Math.hypot((n.lon - lon) * COS_LAT, n.lat - lat) < 0.055) {
        tooClose = true;
        break;
      }
    }
    if (!tooClose) nodes.push({ lon, lat, e, t: 1, parent: -1 });
  }

  // соседи: k ближайших
  const K = 5;
  const n = nodes.length;
  const nb: { j: number; w: number }[][] = nodes.map(() => []);
  for (let i = 0; i < n; i++) {
    const a = nodes[i]!;
    const ds: { j: number; d: number }[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const b = nodes[j]!;
      ds.push({ j, d: Math.hypot((a.lon - b.lon) * COS_LAT, a.lat - b.lat) });
    }
    ds.sort((p, q) => p.d - q.d);
    for (const { j, d } of ds.slice(0, K)) {
      const b = nodes[j]!;
      // перевал: самая высокая точка на пути замедляет весть
      let top = 0;
      for (const s of [0.25, 0.5, 0.75]) top = Math.max(top, elevation(a.lon + (b.lon - a.lon) * s, a.lat + (b.lat - a.lat) * s));
      const w = d * (1 + 2.6 * Math.max(0, top - 0.35));
      nb[i]!.push({ j, w });
      nb[j]!.push({ j: i, w });
    }
  }

  // Дейкстра от Бишкека (индекс 0)
  const dist = new Array<number>(n).fill(Infinity);
  const done = new Array<boolean>(n).fill(false);
  dist[0] = 0;
  for (let step = 0; step < n; step++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!done[i] && (u < 0 || dist[i]! < dist[u]!)) u = i;
    if (u < 0 || dist[u] === Infinity) break;
    done[u] = true;
    for (const { j, w } of nb[u]!) {
      if (dist[u]! + w < dist[j]!) {
        dist[j] = dist[u]! + w;
        nodes[j]!.parent = u;
      }
    }
  }
  const max = Math.max(...dist.filter((x) => x < Infinity));
  nodes.forEach((node, i) => {
    node.t = dist[i]! < Infinity ? dist[i]! / max : 1;
  });
  return nodes;
}
