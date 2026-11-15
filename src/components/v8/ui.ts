"use client";

import { create } from "zustand";

/**
 * Состояние интерфейса варианта 8 (не сохраняется): открыта ли панель заявки, на каком она шаге,
 * и последняя фраза для вежливого live-региона («Добавили в заявку: …»).
 * Сама подборка живёт в общем useSelection.
 */
type Step = "list" | "form";
type V8Ui = {
  cartOpen: boolean;
  step: Step;
  said: { text: string; n: number };
  /** Сколько раз добавляли: ключ для «подпрыгивания» счётчика */
  bump: number;
  openCart: (step?: Step) => void;
  closeCart: () => void;
  setStep: (step: Step) => void;
  say: (text: string, added?: boolean) => void;
};

export const useV8 = create<V8Ui>()((set) => ({
  cartOpen: false,
  step: "list",
  said: { text: "", n: 0 },
  bump: 0,
  openCart: (step = "list") => set({ cartOpen: true, step }),
  closeCart: () => set({ cartOpen: false }),
  setStep: (step) => set({ step }),
  say: (text, added = false) => set((s) => ({ said: { text, n: s.said.n + 1 }, bump: added ? s.bump + 1 : s.bump })),
}));
