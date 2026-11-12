"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CATEGORIES, TASKS, type CategoryId, type TaskTag } from "@/content/services";
import { useSelection } from "@/store/selection";
import { Patch } from "./Patch";
import { Fill } from "./Fill";
import s from "./Services.module.css";

function svcWord(n: number) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return "услуга";
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "услуги";
  return "услуг";
}

export function Services() {
  const [task, setTask] = useState<TaskTag | null>(null);
  const [open, setOpen] = useState<Set<CategoryId>>(() => new Set());
  const picked = useSelection((st) => st.picked);
  const toggle = useSelection((st) => st.toggle);
  const seen = useSelection((st) => st.seen);

  const openCat = useCallback(
    (id: CategoryId, only = false) => {
      setOpen((prev) => {
        const next = new Set(only ? [] : prev);
        next.add(id);
        return next;
      });
      seen(id);
    },
    [seen],
  );

  // Переход с лоскута на первом экране или из подборки: #cat-smm
  useEffect(() => {
    const fromHash = () => {
      const m = window.location.hash.match(/^#cat-(\w+)$/);
      const id = m?.[1] as CategoryId | undefined;
      if (id && CATEGORIES.some((c) => c.id === id)) {
        setTask(null);
        openCat(id);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [openCat]);

  const visible = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        cat: c,
        services: task ? c.services.filter((x) => x.tags.includes(task)) : c.services,
      })).filter((x) => x.services.length > 0),
    [task],
  );
  const total = visible.reduce((n, x) => n + x.services.length, 0);

  const flip = (id: CategoryId) => {
    const opening = !open.has(id);
    setOpen((prev) => {
      const next = new Set(prev);
      if (opening) next.add(id);
      else next.delete(id);
      return next;
    });
    if (opening) seen(id);
  };

  return (
    <section id="uslugi" className="section" aria-labelledby="uslugi-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="uslugi-title" className="h-section">
            Соберите свой курак из&nbsp;услуг
          </h2>
          <p className="lead">
            Отметьте, что нужно бизнесу. Подборка сохранится на этом устройстве и сама подставится в&nbsp;заявку.
          </p>
        </div>

        <div className={s.filter} role="group" aria-labelledby="filter-label">
          <span id="filter-label" className={s.filterLabel}>Ваша задача</span>
          <div className={s.chips}>
            <button type="button" className={s.chip} aria-pressed={task === null} onClick={() => setTask(null)}>
              Любая
            </button>
            {TASKS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={s.chip}
                aria-pressed={task === t.id}
                onClick={() => setTask((cur) => (cur === t.id ? null : t.id))}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className={s.found} role="status">
            {task
              ? `${total} ${svcWord(total)} в ${visible.length} ${visible.length === 1 ? "направлении" : "направлениях"}`
              : `${total} ${svcWord(total)} в восьми направлениях`}
          </p>
        </div>

        <ol className={s.list}>
          {visible.map(({ cat, services }) => {
            const isOpen = open.has(cat.id);
            const pickedHere = cat.services.filter((x) => picked.includes(x.id)).length;
            const panelId = `panel-${cat.id}`;
            return (
              <li key={cat.id} id={`cat-${cat.id}`} className={s.row} data-cat={cat.id} data-open={isOpen || undefined}>
                <h3 className={s.rowHead}>
                  <button
                    type="button"
                    className={s.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => flip(cat.id)}
                  >
                    <span className={s.swatch}>
                      <Patch cat={cat.id} />
                    </span>
                    <span className={s.num}>{cat.n}</span>
                    <span className={s.goal}>{cat.goal}</span>
                    <span className={s.meta}>
                      <span className={s.short}>{cat.short}</span>
                      <span className={s.tally}>
                        {pickedHere > 0 ? `в подборке ${pickedHere} из ${cat.services.length}` : `${services.length} ${svcWord(services.length)}`}
                      </span>
                    </span>
                    <span className={s.plus} aria-hidden="true" />
                  </button>
                </h3>
                <div id={panelId} className={s.panel} hidden={!isOpen}>
                  <p className={s.lead}>
                    Ведёт:{" "}
                    {cat.lead.name ? <strong>{cat.lead.name}</strong> : <Fill note="имя руководителя">Имя</Fill>},{" "}
                    {cat.lead.role.charAt(0).toLowerCase() + cat.lead.role.slice(1)}
                  </p>
                  <ul className={s.services} data-count={services.length}>
                    {services.map((svc) => {
                      const on = picked.includes(svc.id);
                      return (
                        <li key={svc.id} className={s.svc} data-on={on || undefined}>
                          <h4 className={s.svcTitle}>{svc.title}</h4>
                          <ul className={s.includes}>
                            {svc.includes.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                          <p className={s.ask}>
                            С&nbsp;чем приходят: «{svc.ask}»
                          </p>
                          <button
                            type="button"
                            className={s.add}
                            aria-pressed={on}
                            onClick={() => toggle(svc.id)}
                          >
                            <span className={s.addIcon} aria-hidden="true" />
                            {on ? "В подборке" : "Добавить в заявку"}
                            <span className="visually-hidden">: {svc.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
