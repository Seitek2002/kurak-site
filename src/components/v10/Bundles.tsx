"use client";

import { BUNDLES, SERVICE_BY_ID, type Lang } from "@/content/kurak";
import { V10 } from "@/content/v10";
import { useSelection } from "@/store/selection";
import { wool } from "./wool";
import s from "./V10.module.css";

/**
 * Готовый набор = маленький чий, уже собранный из стеблей своих услуг: стебель на услугу,
 * цвет стебля = направление. Поперёк всех стеблей проходит общий ромб: узор только у набора целиком.
 */
const MW = 400;
const MH = 150;
const PITCH = 8;

function MiniChiy({ ids }: { ids: string[] }) {
  const n = ids.length;
  const band = MW / n;
  const cx = MW / 2;
  const cy = MH / 2;
  return (
    <svg viewBox={`0 0 ${MW} ${MH}`} className={s.mini} aria-hidden="true" focusable="false">
      {ids.map((id, i) => {
        const cat = SERVICE_BY_ID[id]?.category.id ?? "smm";
        return <rect key={id} x={i * band} y={0} width={band + 0.5} height={MH} style={{ fill: wool(cat) }} />;
      })}
      <path d={`M${cx} 18 L${MW - 14} ${cy} L${cx} ${MH - 18} L14 ${cy}Z`} className={s.miniMotif} />
      <path d={`M${cx} 44 L${cx + 70} ${cy} L${cx} ${MH - 44} L${cx - 70} ${cy}Z`} className={s.miniLine} />
      <path d={`M${cx} 60 L${cx + 26} ${cy} L${cx} ${MH - 60} L${cx - 26} ${cy}Z`} className={s.miniMotif} />
      <rect x={0} y={0} width={MW} height={MH} className={s.artWrap} />
      <rect x={0} y={6} width={MW} height={4} className={s.miniLine} />
      <rect x={0} y={MH - 10} width={MW} height={4} className={s.miniLine} />
      {Array.from({ length: MW / PITCH - 1 }, (_, i) => (
        <rect key={i} x={(i + 1) * PITCH - 0.6} y={0} width={1.2} height={MH} className={s.miniGap} />
      ))}
    </svg>
  );
}

function AddAll({ ids, lang, title }: { ids: string[]; lang: Lang; title: string }) {
  const all = useSelection((st) => ids.every((id) => st.picked.includes(id)));
  const addMany = useSelection((st) => st.addMany);
  return (
    <button
      type="button"
      className={`${s.btn} ${all ? s.btnQuiet : ""}`}
      aria-pressed={all}
      onClick={() => {
        if (!all) addMany(ids);
      }}
    >
      {all ? V10.bundles.allIn[lang] : V10.bundles.addAll[lang]}
      <span className="visually-hidden">: {title}</span>
    </button>
  );
}

export function Bundles({ lang }: { lang: Lang }) {
  return (
    <ul className={s.bundles}>
      {BUNDLES.map((b) => (
        <li key={b.id}>
          <article className={s.bundleCard} aria-labelledby={`v10-b-${b.id}`}>
            <MiniChiy ids={b.services} />
            <h3 id={`v10-b-${b.id}`} className={s.bundleTitle}>
              {b.title[lang]}
            </h3>
            <p className={s.lede} style={{ fontSize: "var(--v10-fs-md)" }}>
              {b.line[lang]}
            </p>
            <ul className={s.bundleList} aria-label={`${b.services.length} ${V10.bundles.count[lang]}`}>
              {b.services.map((id) => {
                const x = SERVICE_BY_ID[id];
                return x ? (
                  <li key={id} style={{ "--w": wool(x.category.id) } as React.CSSProperties}>
                    {x.service.title[lang]}
                  </li>
                ) : null;
              })}
            </ul>
            <div>
              <AddAll ids={b.services} lang={lang} title={b.title[lang]} />
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
