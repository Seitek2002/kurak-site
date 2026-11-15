"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BoardStyle } from "@/content/v11";

/**
 * Состояние варианта 11 на этом устройстве: стиль доски и девятая лунка «Стратегия».
 * Услуги восьми направлений живут в общей подборке useSelection; стратегии там нет,
 * поэтому её отметка хранится здесь и уходит в заявку отдельной строкой.
 */
type State = {
  board: BoardStyle;
  strategy: boolean;
  setBoard: (b: BoardStyle) => void;
  setStrategy: (v: boolean) => void;
  toggleStrategy: () => void;
};

const safeStorage = createJSONStorage(() => {
  try {
    const probe = "__kurak_v11";
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

export const useV11 = create<State>()(
  persist(
    (set) => ({
      board: "wood",
      strategy: false,
      setBoard: (board) => set({ board }),
      setStrategy: (strategy) => set({ strategy }),
      toggleStrategy: () => set((s) => ({ strategy: !s.strategy })),
    }),
    { name: "kurak-v11", storage: safeStorage, skipHydration: true },
  ),
);
