import type { CategoryId } from "@/content/services";
import { KURAK_PATHS } from "../brand/KurakLogo";

/**
 * Лоскуты портфолио: квадрат с фигурой из геометрии логотипа KURAK
 * (блок с V-вырезом, чаша U, чаша R, треугольник A и их повороты). Цвета только из токенов темы.
 */
export type Tone = "red" | "sand" | "madder" | "ink" | "cream";
type Shape = "k" | "u" | "r" | "a" | "arch" | "km" | "v" | "rise";

const SHAPES: Record<Shape, string> = {
  k: "M0 0H100L63 50L100 100H0Z",
  u: "M0 0H100V50A50 50 0 0 1 0 50Z",
  r: "M0 0H52A50 42.8 0 0 1 84.7 74.6L100 100H0Z",
  a: "M50 0L100 100H0Z",
  arch: "M0 100V50A50 50 0 0 1 100 50V100Z",
  km: "M0 0H100V100H0L37 50Z",
  v: "M0 0H100L50 100Z",
  rise: "M0 100L100 0V100Z",
};

/**
 * Лоскут каждого направления: фигура и пара «фон / фигура». Одинаковы на всех страницах портфолио.
 * Фигуры касаются краёв квадрата, поэтому обе краски тёмные или красные: на кремовой странице лоскут не теряет форму.
 */
export const CAT_PATCH: Record<CategoryId, { shape: Shape; bg: Tone; fg: Tone }> = {
  smm: { shape: "u", bg: "ink", fg: "red" },
  pr: { shape: "k", bg: "red", fg: "madder" },
  events: { shape: "a", bg: "madder", fg: "red" },
  brand: { shape: "r", bg: "red", fg: "ink" },
  sales: { shape: "arch", bg: "ink", fg: "red" },
  digital: { shape: "km", bg: "madder", fg: "red" },
  team: { shape: "v", bg: "red", fg: "madder" },
  invest: { shape: "rise", bg: "ink", fg: "red" },
};

export function Patch({ cat, className }: { cat: CategoryId; className?: string }) {
  const p = CAT_PATCH[cat];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false" data-bg={p.bg} data-fg={p.fg} preserveAspectRatio="none">
      <rect width="100" height="100" className="pf-bg" />
      <path d={SHAPES[p.shape]} className="pf-fg" />
    </svg>
  );
}

/**
 * Буквы логотипа по отдельности, каждая на своём лоскуте. viewBox каждой буквы — её габарит в логотипе,
 * так что пропорции знака не меняются.
 */
const LETTERS: { d: string; box: string; bg: Tone; fg: Tone }[] = [
  { d: KURAK_PATHS[0], box: "0 0 82 93", bg: "cream", fg: "red" },
  { d: KURAK_PATHS[1], box: "88 0 85 93", bg: "red", fg: "cream" },
  { d: KURAK_PATHS[2], box: "181 0 74 93", bg: "ink", fg: "sand" },
  { d: KURAK_PATHS[3], box: "251.5 0 108 93", bg: "madder", fg: "cream" },
  { d: KURAK_PATHS[4], box: "361 0 82 93", bg: "red", fg: "madder" },
];

export function LetterPatches({ className, cellClassName }: { className?: string; cellClassName?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {LETTERS.map((l) => (
        <span key={l.box} className={cellClassName} data-bg={l.bg} data-fg={l.fg}>
          <svg viewBox={l.box} focusable="false">
            <path d={l.d} />
          </svg>
        </span>
      ))}
    </div>
  );
}
