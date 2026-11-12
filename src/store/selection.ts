"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CategoryId } from "@/content/services";

/**
 * «Ваш курак»: подборка услуг, недавно открытые направления и черновик заявки.
 * Живёт в localStorage этого устройства (этап «Возврат» из концепции).
 */
type BriefDraft = { name: string; contact: string; task: string; timing: string; budget: string };

type State = {
  picked: string[];
  recent: CategoryId[];
  draft: BriefDraft;
  drawerOpen: boolean;
  /** Последняя добавленная услуга: для анимации стежка в шапке */
  lastAdded: string | null;
  toggle: (id: string) => void;
  addMany: (ids: string[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  seen: (id: CategoryId) => void;
  setDraft: (patch: Partial<BriefDraft>) => void;
  resetDraft: () => void;
  setDrawer: (open: boolean) => void;
};

const EMPTY_DRAFT: BriefDraft = { name: "", contact: "", task: "", timing: "", budget: "" };

const safeStorage = createJSONStorage(() => {
  try {
    const probe = "__kurak";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    };
  }
});

export const useSelection = create<State>()(
  persist(
    (set) => ({
      picked: [],
      recent: [],
      draft: EMPTY_DRAFT,
      drawerOpen: false,
      lastAdded: null,
      toggle: (id) =>
        set((s) =>
          s.picked.includes(id)
            ? { picked: s.picked.filter((x) => x !== id), lastAdded: null }
            : { picked: [...s.picked, id], lastAdded: id },
        ),
      addMany: (ids) =>
        set((s) => {
          const fresh = ids.filter((id) => !s.picked.includes(id));
          return { picked: [...s.picked, ...fresh], lastAdded: fresh.at(-1) ?? s.lastAdded };
        }),
      remove: (id) => set((s) => ({ picked: s.picked.filter((x) => x !== id) })),
      clear: () => set({ picked: [], lastAdded: null }),
      seen: (id) => set((s) => ({ recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 4) })),
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: EMPTY_DRAFT }),
      setDrawer: (open) => set({ drawerOpen: open }),
    }),
    {
      name: "kurak-selection",
      storage: safeStorage,
      partialize: (s) => ({ picked: s.picked, recent: s.recent, draft: s.draft }),
      skipHydration: true,
    },
  ),
);
