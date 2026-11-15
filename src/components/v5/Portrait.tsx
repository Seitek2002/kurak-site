import { PhotoSlot } from "../brand/PhotoSlot";
import s from "./V5.module.css";

/**
 * Портрет: арка (перевёрнутая U логотипа) в золотой рамке с навершием, внутри место под фото
 * в тоне войлока руководителя: пунктир-стежок, силуэт и подпись «Фото: имя».
 * Фото придёт из content/photos.ts (src) и встанет в ту же арку, рамка останется.
 */
export function Portrait({ label, tone, src }: { label: string; tone: string; src?: string }) {
  return (
    <div className={s.portrait} data-tone={tone}>
      <svg className={s.portraitSvg} viewBox="0 0 220 280" aria-hidden="true" focusable="false">
        <path className={s.portraitLine} d="M1 279.5V110A109 109 0 0 1 219 110V279.5" />
        <path className={s.portraitApex} d="M110 0L117 11H103Z" />
      </svg>
      <PhotoSlot kind="person" src={src} label={label} className={s.portraitSlot} />
    </div>
  );
}
