/**
 * «Поделиться портфолио»: заказчица хочет, чтобы портфолио можно было переслать шефу, коллегам, знакомым.
 * На телефоне открывает системное меню (WhatsApp, Telegram и т.д.), на компьютере копирует ссылку.
 * Вызывать из клиентского компонента по клику.
 */
export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

/** Абсолютная ссылка из пути с basePath ("/kurak-site/portfolio/…") */
export function absoluteUrl(path: string) {
  return new URL(path, window.location.origin).toString();
}

export async function shareLink(opts: { title: string; text: string; url: string }): Promise<ShareOutcome> {
  const url = absoluteUrl(opts.url);
  const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void>; canShare?: (d: ShareData) => boolean };
  const data = { title: opts.title, text: opts.text, url };
  if (nav.share && (!nav.canShare || nav.canShare(data))) {
    try {
      await nav.share(data);
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(`${opts.text} ${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}

/** Готовые ссылки «отправить в WhatsApp / Telegram» для тех, кто хочет явную кнопку */
export const whatsappShare = (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
export const telegramShare = (text: string, url: string) =>
  `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
