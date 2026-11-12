import type { Person } from "@/content/site";
import { Patch } from "./Patch";
import s from "./Portrait.module.css";

/**
 * Место под 2D-портрет. Пока художник рисует, стоит лоскут направления с инициалом.
 * Когда портрет готов: положите файл в public/team/<имя>.png и передайте src.
 */
export function Portrait({ person, src }: { person: Person; src?: string }) {
  const initial = person.name.draft ? "?" : person.name.value.charAt(0);
  return (
    <div className={s.frame} data-cat={person.category} data-slot={`portrait-${person.category}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={480} height={600} loading="lazy" />
      ) : (
        <>
          <span className={s.bg} aria-hidden="true">
            <Patch cat={person.category} plain />
          </span>
          <span className={s.initial} aria-hidden="true">{initial}</span>
        </>
      )}
    </div>
  );
}
