/** Значки каналов связи: контурные, одного веса. WhatsApp и Telegram узнаются по форме. */
export function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
      <path d="M9.2 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.5-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3-.1.7-.5.9-.6.4-1.5.6-2.6.2-1.7-.6-3.4-2.2-4.1-3.9-.5-1.1-.3-2.2.1-2.8z" />
    </svg>
  );
}

export function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 4L3 11l6 2.2L18 7l-7 7.5V20l3.2-3.6L18 19z" />
    </svg>
  );
}

export function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Тундук: венец юрты. Здесь он показывает прогресс помощника:
 * каждый отвеченный вопрос закрашивает одну пару перекладин.
 */
export function Tunduk({ filled, total = 3 }: { filled: number; total?: number }) {
  const bars = [32, 50, 68].slice(0, total);
  return (
    <svg viewBox="0 0 100 100" className="tunduk" role="img" aria-label={`${filled} / ${total}`}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="5" opacity="0.25" />
      <circle
        cx="50" cy="50" r="44" fill="none" stroke="var(--color-accent)" strokeWidth="5" strokeLinecap="round"
        pathLength="100" strokeDasharray={`${(filled / total) * 100} 100`} transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dasharray 420ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
      {bars.map((x, i) => (
        <g key={x} stroke={i < filled ? "var(--color-accent)" : "currentColor"} opacity={i < filled ? 1 : 0.25} strokeWidth="4" strokeLinecap="round" fill="none">
          <path d={`M${x} ${8 + Math.abs(50 - x) * 0.4} Q ${x + (x - 50) * 0.35} 50 ${x} ${92 - Math.abs(50 - x) * 0.4}`} />
          <path d={`M${8 + Math.abs(50 - x) * 0.4} ${x} Q 50 ${x + (x - 50) * 0.35} ${92 - Math.abs(50 - x) * 0.4} ${x}`} />
        </g>
      ))}
    </svg>
  );
}
