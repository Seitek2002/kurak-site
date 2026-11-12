import Link from "next/link";
import { TEAM } from "@/content/site";
import { Portrait } from "../Portrait";
import { Fill } from "../Fill";
import { Scene } from "./Scene";
import s from "./V2Team.module.css";

/** Команда: портреты выезжают из-под шва по одному, при наведении лоскут поворачивается. */
export function V2Team() {
  return (
    <section id="komanda" className={s.section} aria-labelledby="v2-team-title">
      <Scene target="komanda" scene="team" />
      <div className="container">
        <div className={s.head}>
          <h2 id="v2-team-title" className={s.title}>
            Кто будет делать ваш проект
          </h2>
          <Link href="/komanda" className="btn btn--quiet" data-cursor="Знакомиться">
            Вся команда
          </Link>
        </div>
        <ul className={s.grid} data-grid>
          {TEAM.map((p) => (
            <li key={p.role} className={s.person} data-person>
              <div className={s.photo}>
                <Portrait person={p} />
              </div>
              <h3 className={s.name}>
                <Fill value={p.name} note="имя" />
              </h3>
              <p className={s.role}>{p.role}</p>
              <p className={s.line}>{p.line}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
