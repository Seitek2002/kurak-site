"use client";

import { useId, useState } from "react";
import { Fill } from "@/components/Fill";
import { PhotoSlot } from "@/components/brand/PhotoSlot";
import { CATEGORIES, UI, dt, type Category, type Lang } from "@/content/kurak";
import { SLOT_TEXT, teamPhoto } from "@/content/photos";
import { V10 } from "@/content/v10";
import { useSelection } from "@/store/selection";
import s from "./V10.module.css";

/** Кто ведёт направление: id портрета (Оксана ведёт ещё продажи, сайты, найм) */
const LEAD_ID: Record<string, string> = {
  smm: "smm-lead",
  pr: "pr-lead",
  events: "bibinur",
  brand: "nurchik",
  sales: "oksana",
  digital: "oksana",
  team: "oksana",
  invest: "oksana",
};

const STALKS = 11;

/** Пучок стеблей направления: перевязан нитью; при раскрытии стебли встают и обматываются шерстью */
export function Bundle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 170" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: STALKS }, (_, i) => {
        const x = 9 + i * 8.2;
        const rel = (x - 50) / 41;
        return (
          <g
            key={i}
            className={s.st}
            style={{ "--tx": `${((50 - x) * 0.8).toFixed(2)}px`, "--r": `${(rel * 13 + (i % 3) - 1).toFixed(1)}deg`, "--i": i } as React.CSSProperties}
          >
            <rect x={x - 1.9} y={6 + (i % 4) * 2} width={3.8} height={158 - (i % 4) * 3} rx={1.9} className={s.stBare} />
            <rect x={x - 2.6} y={20} width={5.2} height={130} rx={2.6} className={s.stWool} />
            <rect x={x - 2.6} y={20} width={5.2} height={130} rx={2.6} className={s.stTex} />
          </g>
        );
      })}
      <rect x={38} y={82} width={24} height={7} rx={3.5} className={s.tie} />
    </svg>
  );
}

/** Узор «витки шерсти»: один на страницу, на него ссылаются пучки и иллюстрации */
export function WrapDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="v10-wrap" width="6" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
          <rect width="6" height="0.8" style={{ fill: "var(--v10-chiy-shade)" }} opacity="0.35" />
        </pattern>
      </defs>
    </svg>
  );
}

export function AddToggle({ id, title, lang }: { id: string; title: string; lang: Lang }) {
  const on = useSelection((st) => st.picked.includes(id));
  const toggle = useSelection((st) => st.toggle);
  return (
    <button type="button" className={s.add} aria-pressed={on} onClick={() => toggle(id)}>
      <span className={s.addMark} aria-hidden="true" />
      {on ? UI.added[lang] : UI.add[lang]}
      <span className="visually-hidden">: {title}</span>
    </button>
  );
}

function PickedIn({ cat, lang }: { cat: Category; lang: Lang }) {
  const n = useSelection((st) => st.picked.filter((id) => cat.services.some((x) => x.id === id)).length);
  if (!n) return null;
  return (
    <span className={s.dirCount}>
      {n} <span className="visually-hidden">{V10.inRequest[lang]}</span>
      <span aria-hidden="true">✓</span>
    </span>
  );
}

function PickedTotal({ lang }: { lang: Lang }) {
  const n = useSelection((st) => st.picked.length);
  if (!n) return null;
  return (
    <span className={s.small}>
      {V10.services.picked[lang]}: {n}
    </span>
  );
}

/**
 * Восемь пучков. На широком экране пучки стоят в ряд, раскрытый показывает панель под рядом;
 * на узком это аккордеон. Разметка одна: кнопка aria-expanded + регион.
 */
export function Services({ lang }: { lang: Lang }) {
  const uid = useId();
  const [open, setOpen] = useState(0);

  return (
    <div className={s.dirs}>
      {CATEGORIES.map((c, i) => {
        const on = open === i;
        const leadId = LEAD_ID[c.id];
        const leadName = c.lead.name;
        const photoLabel = `${SLOT_TEXT.portrait[lang]}: ${leadName ?? c.lead.role[lang]}`;
        return (
          <div key={c.id} className={s.dir} style={{ "--w": `var(--v10-w${i + 1})` } as React.CSSProperties}>
            <h3 className={s.dirHead}>
              <button
                type="button"
                id={`${uid}-b${i}`}
                className={s.dirBtn}
                aria-expanded={on}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(on ? -1 : i)}
              >
                <Bundle className={s.bundle} />
                <span className={s.dirNum}>{c.n}</span>
                <span className={s.dirGoal}>{c.goal[lang]}</span>
                <span className={s.dirShort}>{c.short[lang]}</span>
                <PickedIn cat={c} lang={lang} />
              </button>
            </h3>
            <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className={s.dirPanel} hidden={!on}>
              <div className={s.leadBox}>
                <p className={s.leadGoal} aria-hidden="true">
                  {c.goal[lang]}
                </p>
                <div className={s.leadPerson}>
                  <div className={s.leadPhoto}>
                    <PhotoSlot kind="person" hideLabel src={teamPhoto(leadId)} label={photoLabel} />
                  </div>
                  <p className={s.leadWho}>
                    <span className={s.leadLabel}>{UI.leads[lang]}</span>
                    <span className={s.leadName}>
                      {leadName ? leadName : <Fill value={dt({ value: V10.services.nameSoon, draft: true }, lang)} />}
                    </span>
                    <span>{c.lead.role[lang]}</span>
                  </p>
                </div>
              </div>
              <ul className={s.svcs}>
                {c.services.map((sv) => (
                  <li key={sv.id}>
                    <article className={s.svc}>
                      <h4 className={s.svcTitle}>{sv.title[lang]}</h4>
                      <p className={s.ask}>
                        <span className={s.askLabel}>{UI.withTask[lang]}</span>
                        {sv.ask[lang]}
                      </p>
                      <div>
                        <p className={`${s.askLabel} ${s.small}`}>{UI.includes[lang]}</p>
                        <ul className={s.includes}>
                          {sv.includes.map((inc) => (
                            <li key={inc.ru}>{inc[lang]}</li>
                          ))}
                        </ul>
                      </div>
                      <AddToggle id={sv.id} title={sv.title[lang]} lang={lang} />
                    </article>
                  </li>
                ))}
              </ul>
              <div className={s.panelFoot}>
                <a href="#contact" className={s.textLink}>
                  {V10.services.toForm[lang]}
                </a>
                <PickedTotal lang={lang} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
