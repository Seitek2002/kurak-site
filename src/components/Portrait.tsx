import type { Person } from "@/content/site";
import { categoryPhoto, SLOT_TEXT } from "@/content/photos";
import { PhotoSlot } from "./brand/PhotoSlot";
import { Patch } from "./Patch";
import s from "./Portrait.module.css";

/** Подпись места под фото: по имени, а пока имя черновик, по роли («Фото: руководитель SMM») */
export function portraitLabel(person: Person) {
  const who = person.name.draft ? person.role.charAt(0).toLowerCase() + person.role.slice(1) : person.name.value;
  return `${SLOT_TEXT.portrait.ru}: ${who}`;
}

/**
 * Портрет руководителя: фото «пришито» стежком на лоскут его направления.
 * Пока фото нет, внутри плейсхолдер с силуэтом и подписью. Фото вписывается в content/photos.ts
 * (TEAM_PHOTOS по id человека, связь с направлением в PERSON_BY_CATEGORY) и встаёт само.
 */
export function Portrait({ person }: { person: Person }) {
  return (
    <div className={s.frame} data-cat={person.category}>
      <span className={s.bg} data-portrait-bg aria-hidden="true">
        <Patch cat={person.category} plain />
      </span>
      <div className={s.photo}>
        <PhotoSlot kind="person" src={categoryPhoto(person.category)} label={portraitLabel(person)} className={s.slot} />
      </div>
    </div>
  );
}
