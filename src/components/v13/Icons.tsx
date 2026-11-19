/** Иконки варианта 13: один набор, линия 1.75, цвет из currentColor. Все декоративные (подпись рядом). */
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

export const IconMenu = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const IconClose = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconPlus = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const IconWhatsApp = (p: P) => (
  <Svg {...p}>
    <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6Z" />
    <path d="M9.2 8.6c.3 2.6 2.4 4.9 5.2 5.4l.9-1.3-1.8-.9-.7.7c-1-.4-1.9-1.3-2.3-2.3l.7-.7-.9-1.8Z" />
  </Svg>
);
export const IconTelegram = (p: P) => (
  <Svg {...p}>
    <path d="M20.5 4.5L3.5 11.2l5.6 2 2 6.3 3.2-3.9 4.6 3.4Z" />
    <path d="M9.1 13.2l8.4-6.1" />
  </Svg>
);
export const IconPhone = (p: P) => (
  <Svg {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </Svg>
);
export const IconInstagram = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="4" width="16" height="16" rx="5" />
    <circle cx="12" cy="12" r="3.6" />
    <path d="M16.8 7.2h.01" />
  </Svg>
);
export const IconPin = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const IconShare = (p: P) => (
  <Svg {...p}>
    <circle cx="6.5" cy="12" r="2.3" />
    <circle cx="17.5" cy="6" r="2.3" />
    <circle cx="17.5" cy="18" r="2.3" />
    <path d="M8.5 10.9l7-3.8M8.5 13.1l7 3.8" />
  </Svg>
);
export const IconDownload = (p: P) => (
  <Svg {...p}>
    <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" />
  </Svg>
);
