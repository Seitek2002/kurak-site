import Link from "next/link";
import { TEAM } from "@/content/site";
import { Portrait } from "./Portrait";
import { Fill } from "./Fill";
import s from "./TeamPreview.module.css";

export function TeamPreview() {
  return (
    <section className="section" aria-labelledby="komanda-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="komanda-title" className="h-section">
            Кто будет делать ваш проект
          </h2>
          <Link href="/komanda" className={`btn btn--quiet ${s.all}`}>
            Вся команда
          </Link>
        </div>
        <ul className={s.grid} tabIndex={0} aria-label="Руководители направлений">
          {TEAM.map((p) => (
            <li key={p.role} className={s.person}>
              <Portrait person={p} />
              <h3 className={s.name}>
                <Fill value={p.name} note="имя" />
              </h3>
              <p className={s.role}>{p.role}</p>
              {p.exp && (
                <p className={s.exp}>
                  <Fill value={p.exp} />
                </p>
              )}
              <p className={s.line}>{p.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
