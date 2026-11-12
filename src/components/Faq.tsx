import { FAQ } from "@/content/site";
import s from "./Faq.module.css";

export function Faq() {
  return (
    <section id="voprosy" className="section" aria-labelledby="voprosy-title">
      <div className={`container ${s.grid}`}>
        <h2 id="voprosy-title" className={`h-section ${s.title}`}>
          Про цену, сроки и&nbsp;подрядчиков
        </h2>
        <div className={s.list}>
          {FAQ.map((f, i) => (
            <details key={f.q} className={s.item} name="faq" open={i === 0}>
              <summary className={s.q}>
                <span>{f.q}</span>
                <span className={s.icon} aria-hidden="true" />
              </summary>
              <p className={s.a}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
