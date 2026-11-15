import type { CategoryId } from "@/content/services";
import { KURAK_PATHS } from "../brand/KurakLogo";

const CATS: CategoryId[] = ["smm", "pr", "events", "brand", "sales"];

/** Рамки пяти фигур знака в координатах логотипа 443 × 93: x, y, ширина, высота */
const BOX: [number, number, number, number][] = [
  [0, 6.5, 82, 86.5],
  [88, 6.5, 85, 86.5],
  [181, 6.5, 75.5, 86.5],
  [251.5, 0, 108, 93],
  [361, 6.5, 82, 86.5],
];
const W = 443, H = 93;
const pct = (v: number, of: number) => `${+((v / of) * 100).toFixed(4)}%`;

/** Форма фигуры для mask-image: та же геометрия, что в KurakLogo, без искажений (рамка совпадает с фигурой) */
function shape(i: number) {
  const [x, y, w, h] = BOX[i]!;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${x} ${y} ${w} ${h}' preserveAspectRatio='none'><path d='${KURAK_PATHS[i]}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Знак KURAK, где каждая из пяти фигур сшита из треугольников своего направления. Декоративный.
 * Фигуры стоят на своих местах внутри рамки 443 × 93, поэтому знак не искажается;
 * каждая сидит в своей маске .v2-letter-mask, чтобы сцены могли двигать их по отдельности.
 */
export function QuiltWord({ className, letterClass }: { className?: string; letterClass?: string }) {
  return (
    <div className={["v2-word", className].filter(Boolean).join(" ")} aria-hidden="true">
      {BOX.map(([x, y, w, h], i) => (
        <span
          key={i}
          className="v2-letter-mask"
          style={{ "--x": pct(x, W), "--y": pct(y, H), "--w": pct(w, W), "--h": pct(h, H) } as React.CSSProperties}
        >
          <span
            className={["v2-letter", letterClass].filter(Boolean).join(" ")}
            data-cat={CATS[i]}
            style={{ "--i": i, "--shape": shape(i) } as React.CSSProperties}
          />
        </span>
      ))}
    </div>
  );
}
