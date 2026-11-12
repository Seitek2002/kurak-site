/** Событие заявки для пикселей Meta и Google: вызывается только после успешной отправки. */
export function trackLead() {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void };
  w.fbq?.("track", "Lead");
  w.gtag?.("event", "generate_lead");
}
