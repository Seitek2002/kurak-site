/**
 * Тогуз коргоол: движок партии для первого экрана варианта 11.
 *
 * Правила по кыргызским источникам (ky.wikipedia «Тогуз коргоол», 24.kg):
 * - доска: у каждого игрока девять лунок (үй), в начале по девять коргоолов, всего 162;
 * - ход: игрок берёт все коргоолы из своей лунки и раскладывает по одному против часовой стрелки,
 *   первый кладёт обратно в ту же лунку (если коргоол один, он уходит в следующую);
 * - если последний коргоол упал в лунку соперника и там стало чётное число, все коргоолы оттуда уходят в казан игрока;
 * - если там стало ровно три, лунка становится тузом игрока: один туз за партию, не девятая лунка соперника
 *   и не та же по номеру, что туз соперника; всё, что потом падает в туз, принадлежит его хозяину;
 * - для победы нужно 82 коргоола, 81 : 81 ничья.
 *
 * Кольцо лунок: 0..8 наши лунки 1..9, 9..17 лунки соперника 1..9. Раскладка идёт по кольцу +1.
 */
export type Side = 0 | 1;
export const PER_SIDE = 9;
export const RING = 18;
export const TOTAL = 162;
export const TO_WIN = 82;

export type Position = {
  holes: number[];
  kazan: [number, number];
  /** Индекс лунки на кольце, ставшей тузом игрока s, или -1 */
  tuz: [number, number];
  toMove: Side;
};

export type GameEvent =
  /** Коргоол из лунки from лёг в лунку to (to === from: первый коргоол вернулся на место) */
  | { kind: "sow"; side: Side; from: number; to: number }
  /** Коргоол из лунки from упал в туз to и ушёл в казан хозяина туза */
  | { kind: "tuzDrop"; side: Side; from: number; to: number; owner: Side }
  /** Все коргоолы лунки at ушли в казан игрока side */
  | { kind: "capture"; side: Side; at: number; count: number }
  /** Лунка at стала тузом игрока side, её три коргоола ушли в его казан */
  | { kind: "tuz"; side: Side; at: number }
  /** Конец партии: остатки на стороне игрока уходят в его казан */
  | { kind: "sweep"; side: Side; at: number; count: number };

export const sideOf = (r: number): Side => (r < PER_SIDE ? 0 : 1);
export const holeNumber = (r: number) => (r % PER_SIDE) + 1;

export function startPosition(): Position {
  return { holes: Array(RING).fill(PER_SIDE), kazan: [0, 0], tuz: [-1, -1], toMove: 0 };
}

export function clone(p: Position): Position {
  return { holes: p.holes.slice(), kazan: [p.kazan[0], p.kazan[1]], tuz: [p.tuz[0], p.tuz[1]], toMove: p.toMove };
}

const tuzOwner = (p: Position, r: number): Side | -1 => (p.tuz[0] === r ? 0 : p.tuz[1] === r ? 1 : -1);

export function legalMoves(p: Position, side: Side = p.toMove): number[] {
  const out: number[] = [];
  for (let i = 0; i < PER_SIDE; i++) {
    const r = side * PER_SIDE + i;
    if ((p.holes[r] ?? 0) > 0 && tuzOwner(p, r) === -1) out.push(r);
  }
  return out;
}

/** Ход из лунки from. Меняет позицию, возвращает события для анимации. */
export function play(p: Position, from: number): GameEvent[] {
  const side = p.toMove;
  const ev: GameEvent[] = [];
  const n = p.holes[from] ?? 0;
  p.holes[from] = 0;
  let r = n === 1 ? (from + 1) % RING : from;
  let last = r;
  for (let k = 0; k < n; k++) {
    const owner = tuzOwner(p, r);
    if (owner !== -1) {
      p.kazan[owner] += 1;
      ev.push({ kind: "tuzDrop", side, from, to: r, owner });
    } else {
      p.holes[r] = (p.holes[r] ?? 0) + 1;
      ev.push({ kind: "sow", side, from, to: r });
    }
    last = r;
    r = (r + 1) % RING;
  }
  if (sideOf(last) !== side && tuzOwner(p, last) === -1) {
    const c = p.holes[last] ?? 0;
    if (c % 2 === 0) {
      p.kazan[side] += c;
      p.holes[last] = 0;
      ev.push({ kind: "capture", side, at: last, count: c });
    } else if (c === 3 && canTuz(p, side, last)) {
      p.tuz[side] = last;
      p.kazan[side] += 3;
      p.holes[last] = 0;
      ev.push({ kind: "tuz", side, at: last });
    }
  }
  p.toMove = side === 0 ? 1 : 0;
  return ev;
}

function canTuz(p: Position, side: Side, r: number) {
  if (p.tuz[side] !== -1) return false;
  if (holeNumber(r) === PER_SIDE) return false;
  const other = p.tuz[side === 0 ? 1 : 0];
  if (other !== -1 && holeNumber(other) === holeNumber(r)) return false;
  return true;
}

/** Конец партии по правилам: у того, кто ходит, нет хода, остатки забирает хозяин стороны */
export function sweep(p: Position): GameEvent[] {
  const ev: GameEvent[] = [];
  for (let r = 0; r < RING; r++) {
    const c = p.holes[r] ?? 0;
    if (!c) continue;
    const s = sideOf(r);
    p.kazan[s] += c;
    p.holes[r] = 0;
    ev.push({ kind: "sweep", side: s, at: r, count: c });
  }
  return ev;
}
