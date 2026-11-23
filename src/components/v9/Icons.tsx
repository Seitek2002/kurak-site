/** Иконки варианта 9: контур 1.75, цвет из currentColor. Все декоративные: подпись всегда рядом. */
type P = { className?: string };

function Svg({ className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

export const IconWhatsApp = (p: P) => (
  <Svg {...p}>
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" />
    <path d="M9.2 8.6c.2-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.6l-.4.5c-.1.1-.1.3 0 .5.5.9 1.3 1.7 2.2 2.2.2.1.4.1.5 0l.5-.5c.2-.2.4-.2.6-.1l1.4.6c.3.1.4.3.4.5v.4c0 .3-.1.7-.5.9-.6.4-1.5.6-2.6.2-1.7-.6-3.4-2.2-4.1-3.9-.5-1.1-.3-2.2.1-2.8z" />
  </Svg>
);
export const IconTelegram = (p: P) => (
  <Svg {...p}>
    <path d="M21 4L3 11l6 2.2L18 7l-7 7.5V20l3.2-3.6L18 19z" />
  </Svg>
);
export const IconPhone = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);
export const IconDownload = (p: P) => (
  <Svg {...p}>
    <path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z" />
    <path d="M14 3v5h5M12 11v6M9 14.5l3 3 3-3" />
  </Svg>
);
export const IconShare = (p: P) => (
  <Svg {...p}>
    <circle cx="18" cy="5.5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="18.5" r="2.5" />
    <path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1" />
  </Svg>
);
export const IconArrowOut = (p: P) => (
  <Svg {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
);
export const IconArrowDownRight = (p: P) => (
  <Svg {...p}>
    <path d="M7 7l10 10M17 8v9H8" />
  </Svg>
);
