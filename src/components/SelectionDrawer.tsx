"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CATEGORIES, CATEGORY_INDEX } from "@/content/services";
import { useSelection } from "@/store/selection";
import { Patch } from "./Patch";
import { MiniQuilt } from "./MiniQuilt";
import s from "./SelectionDrawer.module.css";

/** «Ваша подборка»: выдвижная панель из шапки. Нативный <dialog>: фокус, Esc и инертный фон бесплатно. */
export function SelectionDrawer() {
  const ref = useRef<HTMLDialogElement>(null);
  const open = useSelection((st) => st.drawerOpen);
  const setDrawer = useSelection((st) => st.setDrawer);
  const picked = useSelection((st) => st.picked);
  const recent = useSelection((st) => st.recent);
  const remove = useSelection((st) => st.remove);
  const clear = useSelection((st) => st.clear);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (hash: string) => {
    setDrawer(false);
    const v2 = pathname.startsWith("/v2");
    if (pathname === "/" || v2) {
      // на варианте 2 скроллом управляет Lenis: едем плавно, а не прыжком
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
      if (lenis && !hash.startsWith("cat-")) lenis.scrollTo(`#${hash}`, { offset: -88 });
      else window.location.hash = hash;
      if (hash.startsWith("cat-")) window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else router.push(`/#${hash}`);
  };

  const groups = CATEGORIES.map((c) => ({ cat: c, items: c.services.filter((x) => picked.includes(x.id)) })).filter(
    (g) => g.items.length,
  );

  return (
    <dialog
      ref={ref}
      className={s.drawer}
      aria-labelledby="drawer-title"
      onClose={() => setDrawer(false)}
      onClick={(e) => e.target === e.currentTarget && setDrawer(false)}
    >
      <div className={s.inner}>
        <div className={s.top}>
          <h2 id="drawer-title" className={s.title}>Ваша подборка</h2>
          <button type="button" className={s.close} onClick={() => setDrawer(false)} aria-label="Закрыть подборку">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className={s.quilt}>
          <MiniQuilt picked={picked} cells={Math.max(8, Math.ceil(picked.length / 4) * 4)} size="l" />
        </div>

        {groups.length === 0 ? (
          <p className={s.empty}>
            Пока пусто. Откройте меню услуг и нажмите «Добавить в&nbsp;заявку» у того, что нужно бизнесу.
          </p>
        ) : (
          <ul className={s.groups}>
            {groups.map(({ cat, items }) => (
              <li key={cat.id} data-cat={cat.id}>
                <p className={s.groupHead}>
                  <span className={s.sw} aria-hidden="true"><Patch cat={cat.id} plain /></span>
                  {cat.goal}
                </p>
                <ul className={s.items}>
                  {items.map((x) => (
                    <li key={x.id} className={s.item}>
                      <span>{x.title}</span>
                      <button type="button" className={s.remove} onClick={() => remove(x.id)} aria-label={`Убрать: ${x.title}`}>
                        Убрать
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {recent.length > 0 && (
          <div className={s.recent}>
            <p className={s.recentHead}>Вы смотрели</p>
            <ul className={s.recentList}>
              {recent.map((id) => (
                <li key={id} data-cat={id}>
                  <button type="button" className={s.recentBtn} onClick={() => go(`cat-${id}`)}>
                    <span className={s.sw} aria-hidden="true"><Patch cat={id} plain /></span>
                    {CATEGORY_INDEX[id].short}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.actions}>
          {picked.length > 0 ? (
            <>
              <button type="button" className="btn" onClick={() => go("zayavka")}>Перейти к заявке</button>
              <button type="button" className="btn btn--quiet" onClick={clear}>Очистить</button>
            </>
          ) : (
            <button type="button" className="btn btn--quiet" onClick={() => go("uslugi")}>Открыть меню услуг</button>
          )}
        </div>
      </div>
    </dialog>
  );
}
