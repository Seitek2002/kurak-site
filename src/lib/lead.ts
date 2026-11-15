import { trackLead } from "./track";

/**
 * Отправка заявки для вариантов 4–9. Тот же приёмник, что у вариантов 1–3:
 * NEXT_PUBLIC_LEAD_ENDPOINT (локально /api/lead, на GitHub Pages пусто = демо).
 *
 * Возвращает исход, а тексты ошибок каждый вариант пишет сам на своём языке:
 * - "sent": заявка принята, пиксели получили событие Lead
 * - "offline": приёмник не подключён (демо на Pages или нет токена бота, 503). Нельзя писать «отправлено»
 * - "error": сеть или сервер, стоит попробовать ещё раз
 */
export type LeadPayload = {
  name: string;
  contact: string;
  task?: string;
  /** Названия услуг по-русски: менеджер читает заявку в Telegram на русском */
  services?: string[];
  timing?: string;
  budget?: string;
};

export type LeadOutcome = "sent" | "offline" | "error";

export async function sendLead(payload: LeadPayload, page: string): Promise<LeadOutcome> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (!endpoint) return "offline";
  const url = endpoint.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${endpoint}` : endpoint;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, page }),
    });
    if (res.ok) {
      trackLead();
      return "sent";
    }
    return res.status === 503 ? "offline" : "error";
  } catch {
    return "error";
  }
}

/** Простые проверки полей: имя от двух букв, в контакте от 9 цифр или @ник Telegram */
export function validName(v: string) {
  return v.trim().length >= 2;
}
export function validContact(v: string) {
  const t = v.trim();
  return t.replace(/\D/g, "").length >= 9 || /^@[\w.]{4,}$/.test(t);
}
