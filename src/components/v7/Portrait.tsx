import { PhotoSlot } from "@/components/brand/PhotoSlot";
import type { CategoryId } from "@/content/services";
import { teamPhoto } from "@/content/photos";
import { BadgeMark, type ShapeId } from "./Art";
import s from "./V7.module.css";

/**
 * Портрет руководителя: цветной лоскут направления как оправа, внутри место под фото (PhotoSlot),
 * в углу наклейка с фигурой логотипа. У каждого направления своя фигура и цвет.
 * Фото подставляется из content/photos.ts (teamPhoto): пока пути нет, видна рамка «Фото: имя».
 */
const LOOK: Record<CategoryId, { shape: ShapeId; tone: string }> = {
  invest: { shape: "u", tone: "red" },
  events: { shape: "a", tone: "saffron" },
  brand: { shape: "r", tone: "cobalt" },
  smm: { shape: "k", tone: "teal" },
  pr: { shape: "u", tone: "cream" },
  sales: { shape: "k", tone: "red" },
  digital: { shape: "r", tone: "cobalt" },
  team: { shape: "a", tone: "teal" },
};

export function Portrait({ category, personId, label, size = "l" }: { category: CategoryId; personId?: string; label: string; size?: "l" | "s" }) {
  const look = LOOK[category];
  return (
    <div className={`${s.portrait} ${size === "s" ? s.portraitS : ""}`} data-tone={look.tone} data-slot={`portrait-${category}`}>
      <PhotoSlot kind="person" src={teamPhoto(personId)} label={label} hideLabel={size === "s"} className={s.portraitPhoto} />
      {size === "l" ? (
        <span className={s.portraitBadge} aria-hidden="true">
          <BadgeMark id={look.shape} className={s.portraitMark} />
        </span>
      ) : null}
    </div>
  );
}

/** «Руководитель SMM» → «руководитель SMM» для подписи «Фото: …»; аббревиатуры не трогаем */
export const lowerFirst = (t: string) => (t.length > 1 && t[1] === t[1]!.toLowerCase() ? t[0]!.toLowerCase() + t.slice(1) : t);
