import type { CategoryId } from "@/content/services";
import s from "./V12.module.css";

/**
 * Восемь знаков: как идёт весть в каждом направлении. Движение включается, когда строку открыли или навели:
 * ветер несёт точки (SMM), эхо отражается от хребта (PR), люди съезжаются на той (ивенты), флажок узнают
 * в трёх местах (брендинг), каждого пришедшего встречают (продажи), дороги сходятся к месту (сайт),
 * на зов встают в ряд (найм), весть поднимается к тому, кто вкладывает (инвестиции).
 */
export function Glyph({ id, className }: { id: CategoryId; className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={[s.glyph, className].filter(Boolean).join(" ")} aria-hidden="true" focusable="false" data-glyph={id}>
      {BODY[id]}
    </svg>
  );
}

const K = "M0 0H16L10 8L16 16H0Z"; // фигура K знака: флажок

const BODY: Record<CategoryId, React.ReactNode> = {
  smm: (
    <>
      <path className={s.gWind} pathLength={100} d="M6 24C26 16 44 32 66 24" />
      <path className={s.gWind} pathLength={100} style={{ animationDelay: "-0.6s" }} d="M2 41C24 33 46 49 72 41" />
      <path className={s.gWind} pathLength={100} style={{ animationDelay: "-1.2s" }} d="M8 58C28 50 48 66 68 58" />
      {[
        [90, 18],
        [101, 30],
        [107, 44],
        [99, 58],
        [88, 66],
      ].map(([x, y], i) => (
        <circle key={i} className={s.gLight} style={{ animationDelay: `${-1.6 + i * 0.22}s` }} cx={x} cy={y} r="4" />
      ))}
    </>
  ),
  pr: (
    <>
      <path className={s.gRidge} d="M0 74L20 50L34 62L56 30L76 58L92 42L120 74" />
      <circle className={s.gSource} cx="18" cy="34" r="4" />
      {[0, 1, 2].map((i) => (
        <circle key={i} className={s.gEcho} style={{ animationDelay: `${-0.3 - i * 0.6}s` }} cx="18" cy="34" r="12" />
      ))}
      {[0, 1].map((i) => (
        <circle key={`b${i}`} className={`${s.gEcho} ${s.gEchoBack}`} style={{ animationDelay: `${-1.0 - i * 0.6}s` }} cx="92" cy="30" r="10" />
      ))}
    </>
  ),
  events: (
    <>
      <circle className={s.gPlace} cx="60" cy="40" r="11" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <circle
            key={i}
            className={s.gGather}
            style={{ "--dx": `${(-Math.cos(a) * 24).toFixed(1)}px`, "--dy": `${(-Math.sin(a) * 24).toFixed(1)}px`, animationDelay: `${-0.04 - (i % 4) * 0.05}s` } as React.CSSProperties}
            cx={(60 + Math.cos(a) * 38).toFixed(1)}
            cy={(40 + Math.sin(a) * 30).toFixed(1)}
            r="3.5"
          />
        );
      })}
    </>
  ),
  brand: (
    <>
      {[12, 50, 88].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 22 : 30}) scale(1.4)`}>
          <path className={i ? s.gKnown : s.gSource} style={{ animationDelay: `${-1.2 + i * 0.45}s` }} d={K} />
        </g>
      ))}
      <path className={s.gRidge} d="M4 70H116" />
    </>
  ),
  sales: (
    <>
      <path className={s.gRidge} d="M74 8V72" />
      {[16, 32, 48, 64].map((y, i) => (
        <g key={y}>
          <circle className={s.gArrive} style={{ animationDelay: `${-1.5 + i * 0.3}s` }} cx="14" cy={y} r="3.5" />
          <circle className={s.gMeet} style={{ animationDelay: `${-1.5 + i * 0.3}s` }} cx="96" cy={y} r="6" />
        </g>
      ))}
    </>
  ),
  digital: (
    <>
      <path className={s.gPath} d="M4 10C40 12 54 34 84 38" />
      <path className={s.gPath} d="M2 40H84" />
      <path className={s.gPath} d="M6 72C40 68 54 46 84 42" />
      <rect className={s.gPlaceFill} x="86" y="26" width="28" height="28" />
    </>
  ),
  team: (
    <>
      <path className={s.gRidge} d="M14 8V60" />
      <path className={s.gSource} transform="translate(14 8) scale(1.3)" d={K} />
      {[34, 52, 70, 88, 106].map((x, i) => (
        <circle key={x} className={s.gJoin} style={{ animationDelay: `${-1.6 + i * 0.25}s` }} cx={x} cy="60" r="5" />
      ))}
    </>
  ),
  invest: (
    <>
      <path className={s.gRidge} d="M6 72H30V56H54V42H78V26H100" />
      <circle className={s.gClimb} style={{ animationDelay: "-1.2s" }} cx="6" cy="72" r="4" />
      <circle className={s.gPlace} cx="108" cy="20" r="9" />
    </>
  ),
};
