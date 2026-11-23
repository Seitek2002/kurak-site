import type { Lang } from "@/content/kurak";
import { PHOTOS, type PhotoId, type V9Photo } from "@/content/v9";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Фото из public/v9/photos (Wikimedia Commons, автор и лицензия в PHOTOS, атрибуция в подвале).
 * Обычный <img> с basePath: статический экспорт для GitHub Pages, next/image без оптимизатора.
 * width/height из файла, чтобы место было занято до загрузки.
 */
export function Photo({ id, lang, className, eager }: { id: PhotoId; lang: Lang; className?: string; eager?: boolean }) {
  const p: V9Photo = PHOTOS[id];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- статический экспорт, без оптимизатора изображений
    <img
      src={`${BASE}/v9/photos/${p.file}`}
      width={p.w}
      height={p.h}
      alt={p.alt[lang]}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={p.pos ? { objectPosition: p.pos } : undefined}
    />
  );
}
